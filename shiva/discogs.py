#!/usr/bin/env python3
import json
import discogs_client

class Discogs:
    def __init__(self, token, app_name, app_version):
        self.client = discogs_client.Client(
            '%s/%s' % (app_name, app_version),
            user_token=token)

    def get_artist(self, name):
        result = self.client.search(name, type='artist')
        if result.count > 0:
            return result[0]

    def get_album(self, artist_name, name):
        result = self.client.search(name, type='master', artist=artist_name)
        if result.count > 0:
            return result[0].main_release

        # Let's try with releases instead of masters then...
        result = self.client.search(name, type='release', artist=artist_name)
        if result.count > 0:
            return result[0]

        return None  # Well... we tried ¯\_(ツ)_/¯
