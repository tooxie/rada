#!/usr/bin/env python3
import logging

from sqlalchemy.orm.exc import NoResultFound

import models as m

logger = logging.getLogger('indexer')


class CacheManager(object):
    """
    Class that handles object caching and retrieval. The indexer should not
    access DB directly, it should instead ask for the objects to this class.

    """

    def __init__(self, ram_cache=True, use_db=True, q=None):
        logger.debug('[CACHE] Initializing...')

        if not ram_cache:
            logger.debug('[CACHE] Ignoring RAM cache')

        self.ram_cache = ram_cache
        self.use_db = use_db

        self.artists = {}
        self.albums = {}
        self.hashes = set()

        if not q:
            raise ValueError('No DB (q) provided');
        self.q = q

    def get_artist(self, slug):
        artist = self.artists.get(slug)

        if not artist:
            if self.use_db:
                try:
                    artist = q(m.Artist).filter_by(slug=slug).one()
                except NoResultFound:
                    pass
                if artist and self.ram_cache:
                    self.add_artist(artist)

        return artist

    def add_artist(self, artist):
        if self.ram_cache:
            self.artists[artist.slug] = artist

    def get_album(self, name, artist):
        album = self.albums.get(artist.name, {}).get(name)

        if not album:
            if self.use_db:
                try:
                    album = q(m.Album).filter_by(name=name).one()
                except NoResultFound:
                    pass
                if album and self.ram_cache:
                    self.add_album(album, artist)

        return album

    def add_album(self, album, artist):
        if self.ram_cache:
            if not self.albums.get(artist.name):
                self.albums[artist.name] = {}

            self.albums[artist.name][album.name] = album

    def add_hash(self, hash):
        if self.ram_cache:
            self.hashes.add(hash)

    def hash_exists(self, hash):
        if hash in self.hashes:
            return True

        if self.use_db:
            return bool(q(m.Track).filter_by(hash=hash).count())

        return False

    def clear(self):
        self.artists = {}
        self.albums = {}
        self.hashes = set()
