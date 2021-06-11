#!/usr/bin/env python3
import os
import json
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from config import config
from discogs import Discogs
import models as m


def enrich(db, client):
    for artist in db.query(m.Artist).all():
        result = client.get_artist(artist.name)
        if not result:
            print('[404] [ARTIST] %s' % artist.name)
            continue

        # TODO: If I have the same artist twice in the DB ("blink182" vs.
        # TODO: "blink-182" for example) we should "merge" them together
        # logger.debug('[rename] %s -> %s' % (artist.name, result.name))
        # artist.name = result.name
        # TODO: if an artist with the same slug already exists:
        # TODO:   if discogs ID are the same for all artists with the same slug:
        # TODO:     merge them? or something like that...
        # TODO: else:
        # TODO:   artist.slug = slugify(result.name)

        print('[OK] [ARTIST] %s' % artist.name)
        if len(result.images) > 0:
            artist.image = result.images[0]['uri']
            db.add(artist)

        for album in artist.albums:
            result = client.get_album(artist.name, album.name)
            if result:
                print('[OK] [album] %s' % album.name)
                if result.year:
                    album.year = result.year
                if len(result.images) > 0:
                    album.cover = result.images[0]['uri']
                db.add(album)
            else:
                print('[404] [album] %s' % album.name)

        db.commit()

def main():
    engine = create_engine(config['DB_URL'])
    session = Session(engine)

    dirname = os.path.dirname(__file__)
    pkg_path = os.path.join(dirname, '../client/package.json')
    with open(pkg_path, 'r') as f:
        pkg = json.loads(f.read())
        # Get your token from https://www.discogs.com/settings/developers
        discogs = Discogs(config['DISCOGS_TOKEN'], pkg['name'], pkg['version'])

        enrich(session, discogs)

if __name__ == '__main__':
    main()
