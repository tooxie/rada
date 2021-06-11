#!/usr/bin/env python3
import io
import os
import uuid

from sqlalchemy import Table, Column, String, ForeignKey, Integer, Unicode
from sqlalchemy.orm import declarative_base, relationship

from metadata import MetadataManager

Base = declarative_base()

__all__ = ('Artist', 'Album', 'Track')


artist_album_relation = Table('artist_album', Base.metadata,
    Column('artist_id', String(128), ForeignKey('artists.pk')),
    Column('album_id', String(128), ForeignKey('albums.pk')),
)


artist_track_relation = Table('artist_track', Base.metadata,
    Column('artist_id', String(128), ForeignKey('artists.pk')),
    Column('track_id', String(128), ForeignKey('tracks.pk')),
)

def get_uuid():
    return str(uuid.uuid4())


class Artist(Base):
    __tablename__ = 'artists'

    pk = Column(String(128), default=get_uuid, primary_key=True)
    name = Column(String(128), unique=True, nullable=False)
    slug = Column(String(128), unique=True, nullable=False)
    image = Column(String(256))
    gql_id = Column(String(128))
    discogs_id = Column(String(128))
    albums = relationship('Album', secondary=artist_album_relation,
        backref='artists')
    tracks = relationship('Track', secondary=artist_track_relation,
        backref='artists')

    def __repr__(self):
        return '<Artist (%s)>' % self.name


class Album(Base):
    __tablename__ = 'albums'

    pk = Column(String(128), default=get_uuid, primary_key=True)
    name = Column(String(128), nullable=False)
    year = Column(Integer)
    cover = Column(String(256))
    gql_id = Column(String(128))
    discogs_id = Column(String(128))
    tracks = relationship('Track', foreign_keys="Track.album")

    def __repr__(self):
        return '<Album (%s)>' % self.name


class Track(Base):
    __tablename__ = 'tracks'

    pk = Column(String(128), default=get_uuid, primary_key=True)
    path = Column(Unicode(256), unique=True, nullable=False)
    title = Column(String(128))
    bitrate = Column(Integer)
    file_size = Column(Integer)
    length = Column(Integer)
    ordinal = Column(Integer)
    hash = Column(String(128), unique=True)
    album = Column(String(128), ForeignKey('albums.pk'))
    gql_id = Column(String(128))
    url = Column(String(256), unique=True)

    def __init__(self, path, *args, **kwargs):
        if not isinstance(path, (str, io.TextIOBase)):
            raise ValueError('Invalid parameter for Track. Path or File '
                'expected, got %s' % type(path))

        _path = path
        if isinstance(path, io.TextIOBase):
            _path = path.name

        self._meta = None
        self.set_path(_path)

        super(Track, self).__init__(*args, **kwargs)

    def get_path(self):
        if self.path:
            return self.path.encode('utf-8')

        return None

    def set_path(self, path):
        if path != self.get_path():
            self.path = path

            if os.path.exists(self.get_path()):
                meta = self.get_metadata_reader()
                self.file_size = meta.filesize
                self.bitrate = meta.bitrate
                self.length = meta.length
                self.ordinal = meta.track_number
                self.title = meta.title

    def get_metadata_reader(self):
        """Return a MetadataManager object."""
        if not getattr(self, '_meta', None):
            self._meta = MetadataManager(self.get_path())

        return self._meta

    def __repr__(self):
        return "<Track ('%s')>" % self.title
