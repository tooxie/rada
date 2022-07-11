#!/usr/bin/env python3
import logging
import logging.config
import os


def get_logger():
    return logging.getLogger(__name__)
    log_conf = '../logging.conf'
    dirname = os.path.dirname(__file__)
    logging.config.fileConfig(os.path.join(dirname, log_conf))

    return logging.getLogger('process')


def enrich(client, artist, album=None):
    if album:
        return enrich_album(client, artist, album)
    else:
        return enrich_artist(client, artist)


# DOCU: We should document how the database is designed and what each field
# means. Especially those fields that, like `discogs_id`, modify the behaviour
# of the process.py script. We should mention that if you want to re-run the
# enrich script you have to remove the `discogs_id` value from the record.
def enrich_artist(client, artist):
    if artist.discogs_id:
        return

    log = get_logger()
    result = client.get_artist(artist.name)
    if not result:
        log.debug('[ARTIST] [DISCOGS] [404] %s' % artist.name)
        artist.discogs_id = "__NOT_FOUND__"
        return

    log.debug('[ARTIST] [DISCOGS] [OK] %s' % artist.name)
    if result.images and len(result.images) > 0:
        artist.image = result.images[0]['uri']

    artist.discogs_id = result.id


def enrich_album(client, artist, album):
    if not artist or album.discogs_id:
        return

    log = get_logger()
    result = client.get_album(artist.name, album.name)
    if not result:
        log.debug('[404] [album] (%s) %s' % (artist.name, album.name))
        album.discogs_id = "__NOT_FOUND__"
        return

    log.debug('[OK] [album] (%s) %s' % (artist.name, album.name))
    if result.images:
        album.cover = result.images[0]['uri']

    if not album.year and result.year:
        album.year = result.year

    album.discogs_id = result.id
