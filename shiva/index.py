#!/usr/bin/env python3
"""Shiva-server's music indexer repurposed for Gawshi.
Index your music collection for later publication to Gawshi.

Usage:
    indexer [-h] [-v] [-q] [--no-hash] [--reindex] [--write-every=<num>]
        [--verbose-sql]

Options:
    -h, --help           Show this help message and exit
    --no-hash            Do not hash files (used to identify and ignore
                         duplicates, but slows down indexing considerably).
    --reindex            Drop and recreate the database before indexing.
    --write-every=<num>  Write to disk and clear cache every <num> tracks
                         indexed.
    --verbose-sql        Print every SQL statement. Be careful, it's a little
                         too verbose.
    -v, --verbose        Show debugging messages about the progress.
    -q, --quiet          Suppress warnings.
"""
# K-Pg
from time import time
import configparser
import hashlib
import logging
import logging.config
import os
import sys
import traceback

from docopt import docopt
from slugify import slugify
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy.exc import NoResultFound

import models as m
from metadata import MetadataManagerReadError
from cache import CacheManager

log_conf = './logging.conf'
dirname = os.path.dirname(__file__)
logging.config.fileConfig(os.path.join(dirname, log_conf))
logger = logging.getLogger('indexer')
q = None
config = None
NULL_ID = "00000000-0000-0000-0000-000000000000"


def set_config():
    global config
    if not config:
        dirname = os.path.dirname(__file__)
        config_path = os.path.join(dirname, "./gawshi.conf")
        config = configparser.ConfigParser()
        config.read(config_path)


class Indexer(object):

    VALID_FILE_EXTENSIONS = (
        'asf', 'wma',  # ASF
        'flac',  # FLAC
        'mp4', 'm4a', 'm4b', 'm4p',  # M4A
        'ape',  # Monkey's Audio
        'mp3',  # MP3
        'mpc', 'mp+', 'mpp',  # Musepack
        'spx',  # Ogg Speex
        'ogg', 'oga',  # Ogg Vorbis / Theora
        'tta',  # True Audio
        'wv',  # WavPack
        'ofr',  # OptimFROG
    )

    def __init__(self, hash_files=False, reindex=False, media_dirs=None,
            write_every=0, engine=None, session=None):
        # self.use_lastfm = use_lastfm
        self.hash_files = hash_files
        self.reindex = reindex
        self.write_every = write_every or 0

        # If we are going to have only 1 track in cache at any time we might as
        # well just ignore it completely.
        use_cache = (write_every != 1)
        self.cache = CacheManager(
            ram_cache=use_cache,
            use_db=not use_cache,
            q=session.query)

        self.engine = engine
        self.session = session
        self.media_dirs = media_dirs
        self.allowed_extensions = ('flac', 'mp3')

        self._ext = None
        self._meta = None
        self.track_count = 0
        self.skipped_tracks = 0
        self.count_by_extension = {}
        for extension in self.allowed_extensions:
            self.count_by_extension[extension] = 0

        if not len(self.media_dirs):
            logger.error('Remember to set the music_dir option, otherwise I '
                "don't know where to look for.")

        if reindex:
            logger.info('Dropping database...')

            confirmed = input('This will destroy all the information. '
                'Proceed? [y/N] ') in ('y', 'Y')
            if not confirmed:
                logger.error('Aborting.')
                sys.exit(1)

            m.Base.metadata.drop_all(self.engine)
            logger.info('Recreating database...')
            m.Base.metadata.create_all(self.engine)

    def get_artist(self, name):
        name = name.strip() if isinstance(name, str) else None
        if not name:
            return None

        slug = slugify(name)
        artist = self.cache.get_artist(slug)
        if artist:
            return artist

        artist = q(m.Artist).filter_by(slug=slug).first()
        if artist:
            return artist

        # artist = m.Artist(name=name, image=self.get_artist_image(name),
        #     slug=slug)
        artist = m.Artist(name=name, slug=slug)

        self.session.add(artist)
        self.session.commit()
        self.cache.add_artist(artist)

        return artist

    def get_album(self, name, artist):
        name = name.strip() if isinstance(name, str) else None
        if not name or not artist:
            return None

        album = self.cache.get_album(name, artist)
        if album:
            return album

        # release_year = self.get_release_year(name, artist)
        # cover = self.get_album_cover(name, artist)
        # album = m.Album(name=name, year=release_year, cover=cover)
        query = q(m.Album).join(m.Artist, m.Album.artists)
        try:
            album = query.filter(m.Album.name == name).one()
        except NoResultFound:
            album = m.Album(name=name)

        self.session.add(album)
        self.session.commit()
        self.cache.add_album(album, artist)

        return album

    def add_to_session(self, track):
        self.session.add(track)
        ext = self.get_extension()
        self.count_by_extension[ext] += 1

        logger.info('[ OK ] %s' % track.path)

        return True

    def skip(self, reason=None, print_traceback=None):
        self.skipped_tracks += 1

        if logger.getEffectiveLevel() <= logging.INFO:
            _reason = ' (%s)' % reason if reason else ''
            logger.info('[ SKIP ] %s%s' % (self.file_path, _reason))
            if print_traceback:
                logger.info(traceback.format_exc())

        return True

    def commit(self, force=False):
        if not force:
            if not self.write_every:
                return False

            if self.track_count % self.write_every != 0:
                return False

        logger.debug('Writing to database...')
        self.session.commit()

        if self.write_every > 1:
            logger.debug('Clearing cache')
            self.cache.clear()

        return True

    def get_track(self):
        """
        Takes a path to a track, reads its metadata and creates a Track object
        with it.

        """

        # try:
        #     full_path = self.file_path
        # except UnicodeDecodeError:
        #     self.skip('Unrecognized encoding', print_traceback=True)
        #     # If file name is in an strange encoding ignore it.
        #     return False

        if q(m.Track).filter_by(path=self.file_path).count():
            self.skip('Already indexed')
            return None

        track_hash = None
        if (self.hash_files):
            track_hash = self.hash(self.file_path)
        try:
            track = m.Track(self.file_path, hash=track_hash)
        except MetadataManagerReadError:
            self.skip('Corrupted file', print_traceback=True)

            # If the metadata manager can't read the file, it's probably not an
            # actual music file, or it's corrupted. Ignore it.
            return None

        if self.hash_files and q(m.Track).filter_by(hash=track_hash).count():
            self.skip('Duplicated file')
            return None

        return track

    def hash(self, path):
        with open(path, mode='rb') as f:
            h = hashlib.md5(f.read())
            return h.hexdigest()

    # def get_metadata_reader(self):
    #     return self._meta

    # def set_metadata_reader(self, track):
    #     self._meta = track.get_metadata_reader()
    #     return self._meta

    def get_extension(self):
        return self.file_path.rsplit('.', 1)[1].lower()

    def is_track(self):
        """Try to guess whether the file is a valid track or not."""
        if not os.path.isfile(self.file_path):
            return False

        if '.' not in self.file_path:
            return False

        ext = self.get_extension()
        if ext not in self.VALID_FILE_EXTENSIONS:
            logger.debug('[ SKIP ] %s (Unrecognized extension)' %
                      self.file_path)

            return False
        elif ext not in self.allowed_extensions:
            logger.debug('[ SKIP ] %s (Ignored extension)' % self.file_path)

            return False

        return True

    def walk(self, target, exclude=tuple()):
        """Recursively walks through a directory looking for tracks."""
        _ignored = ''
        _target = os.path.expanduser(target)

        logger.debug('Walking %s' % _target)
        if not os.path.isdir(_target):
            logger.debug('Target is not a directory')
            return False

        for root, dirs, files in os.walk(_target):
            logger.debug(root)
            if _ignored and root.startswith(_ignored):
                # Is there a nicer way to express this?
                continue

            if root in exclude:
                logger.debug('[ SKIP ] %s (Excluded by config)' % root)
                _ignored = root
                continue

            self.process_files(root, files)

    def process_files(self, root, files):
        album = None
        for name in files:
            self.file_path = os.path.join(root, name)
            if not self.is_track():
                continue

            self.track_count += 1
            track = self.get_track()
            if not track:
                continue

            meta = track.get_metadata_reader()
            artist = self.get_artist(meta.artist)
            # Here we iterate over all music files in a directory. It could
            # happen that they all belong to the same album, or that they are
            # unrelated. If the file we are analyzing has the same album name
            # as the previous one, then we treat them as part of the same
            # album. Otherwise we create a new album for that file. We don't
            # support the case in which is a mix of tracks of different albums,
            # they have to be grouped under the same directory.
            if not album or meta.album != album.name:
                album = self.get_album(meta.album, artist)

            track.album = album.pk if album else f"album:{NULL_ID}"
            if artist:
                track.artists.append(artist)
                if album:
                    album.artists.append(artist)

            self.add_to_session(track)
        self.session.commit()

    def print_stats(self):
        if self.track_count == 0:
            logger.info('\nNo track indexed.')

            return True

        elapsed_time = self.final_time - self.initial_time
        logger.info('\nRun in %d seconds. Avg %.3fs/track (or %.3f tracks/s)' % (
                 elapsed_time,
                 (elapsed_time / self.track_count),
                 (self.track_count / elapsed_time),
         ))
        logger.info('Found %d tracks. Skipped: %d. Indexed: %d.' % (
                 self.track_count,
                 self.skipped_tracks,
                 (self.track_count - self.skipped_tracks)))
        for extension, count in self.count_by_extension.items():
            if count:
                logger.info('%s: %d tracks' % (extension, count))

    def run(self):
        self.initial_time = time()

        for mdir in self.media_dirs:
            self.walk(mdir)

        self.final_time = time()


def get_music_dir():
    """This utility will make sure that we resolve the correct directory for
    the music. It's possible for the user to set a relative directory, which
    should be relative to the location of the config file, in this case the
    `shiva/` directory. The database, however, will be relative to the root
    directory, i.e. `gawshi/`.

    That's why this utility will momentarily switch the cwd to `shiva/` to
    properly resolve the music dir path and then reset it to whatever it was
    before.
    """

    old_cwd = os.getcwd()
    os.chdir(os.path.dirname(__file__))
    music_dir = os.path.abspath(config.get('gawshi', 'music_dir'))
    os.chdir(old_cwd)

    return music_dir


def main():
    arguments = docopt(__doc__)
    set_config()

    if arguments['--quiet']:
        logger.setLevel(logging.ERROR)
    elif arguments['--verbose']:
        logger.setLevel(logging.DEBUG)
    else:
        logger.setLevel(logging.INFO)

    if arguments['--verbose-sql']:
        config.getboolean('gawshi', 'sqlalchemy_echo', fallback=True)

    kwargs = {
        'hash_files': not arguments['--no-hash'],
        'reindex': arguments['--reindex'],
        'write_every': arguments['--write-every'],
    }

    try:
        if kwargs['write_every'] is not None:
            kwargs['write_every'] = int(kwargs['write_every'])
    except TypeError:
        error_values = (kwargs['write_every'], type(kwargs['write_every']))
        sys.stderr.write('ERROR: Invalid value for --write-every, expected '
            '<int>, got "%s" <%s>. instead' % error_values)
        sys.exit(3)

    print(f'Database: %s' % config.get('gawshi', 'db_url'))
    music_dir = get_music_dir()
    print('Music dir: %s' % music_dir)
    if config.get('gawshi', 'discogs_token'):
        print('Discogs token: ***************')

    # Force script to `cd` to the root of the project, otherwise sqlalchemy
    # will not find the DB.
    dirname = os.path.dirname(__file__)
    os.chdir(os.path.join(dirname, ".."))

    # Generate database
    engine = create_engine(
        config.get('gawshi', 'db_url'),
        echo=config.getboolean('gawshi', 'sqlalchemy_echo', fallback=False))
    session = Session(engine)
    kwargs['engine'] = engine
    kwargs['session'] = session
    kwargs['media_dirs'] = [music_dir]
    global q
    q = session.query
    try:
        m.Base.metadata.create_all(engine)
    except Exception as e:
        logger.error(e)
        logger.error(f'Error using DB: %s' % db_url)
        sys.exit(1)

    indexer = Indexer(**kwargs)
    indexer.run()
    # Every track will be added to the session but they will be written down to
    # disk only once at the end. With the --write-every flag you can define how
    # often we hit the drive.
    indexer.commit(force=True)
    indexer.print_stats()


if __name__ == '__main__':
    main()
