#!/usr/bin/env python3
import datetime
import os

import dateutil.parser
import mutagen


class MetadataManagerReadError(Exception):
    pass


class MetadataManager(object):
    """A format-agnostic metadata wrapper around Mutagen.

    This makes reading/writing audio metadata easy across all possible audio
    formats by using properties for the different keys.

    In order to persist changes to the metadata, the ``save()`` method needs to
    be called.

    """

    def __init__(self, filepath):
        self._original_path = filepath
        try:
            self.reader = mutagen.File(filepath, easy=True)
        except Exception as e:
            msg = e
            if hasattr(e, 'message'):
                msg = e.message
            raise MetadataManagerReadError(msg)

    @property
    def title(self):
        return self._getter('title')

    @property
    def artist(self):
        """The artist name."""
        return self._getter('artist')

    @artist.setter
    def artist(self, value):
        self.reader['artist'] = value

    @property
    def album(self):
        """The album name."""
        return self._getter('album')

    @album.setter
    def album(self, value):
        self.reader['album'] = value

    @property
    def release_year(self):
        """The album release year."""
        default_date = datetime.datetime(datetime.MINYEAR, 1, 1)
        default_date = default_date.replace(tzinfo=None)
        date = self._getter('date', '')
        try:
            parsed_date = dateutil.parser.parse(date, default=default_date)
        except ValueError:
            return None

        parsed_date = parsed_date.replace(tzinfo=None)
        if parsed_date != default_date:
            return parsed_date.year

        return None

    @release_year.setter
    def release_year(self, value):
        self.reader['year'] = value

    @property
    def track_number(self):
        """The track number."""

        try:
            _number = int(self._getter('tracknumber'))
        except (TypeError, ValueError):
            _number = None

        return _number

    @track_number.setter
    def track_number(self, value):
        self.reader['tracknumber'] = value

    @property
    def genre(self):
        """The music genre."""
        return self._getter('genre')

    @genre.setter
    def genre(self, value):
        self.genre = value

    @property
    def length(self):
        """The length of the song in seconds."""
        return int(round(self.reader.info.length))

    @property
    def bitrate(self):
        """The audio bitrate."""
        if hasattr(self.reader.info, 'bitrate'):
            return self.reader.info.bitrate / 1000

    @property
    def sample_rate(self):
        """The audio sample rate."""
        return self.reader.info.sample_rate

    @property
    def filename(self):
        """The file name of this audio file."""
        return os.path.basename(self.reader.filename)

    @property
    def filepath(self):
        """The absolute path to this audio file."""
        return os.path.abspath(self.reader.filename)

    @property
    def origpath(self):
        """The original path with which this class was instantiated. This
        function avoids a call to ``os.path``.  Usually you'll want to use
        either :meth:`.filename` or :meth:`.filepath` instead."""
        return self._original_path

    @property
    def filesize(self):
        """The size of this audio file in the filesystem."""
        return os.stat(self.reader.filename).st_size

    # Helper functions

    def _getter(self, attr, fallback=None):
        """Return the first list item of the specified attribute or fall back
        to a default value if attribute is not available."""
        return self.reader[attr][0] if attr in self.reader else fallback

    def save(self):
        """Save changes to file metadata."""
        self.reader.save()
