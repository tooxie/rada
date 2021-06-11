import { h } from "preact";
import { Route, Router } from "preact-router";

import Redirect from "./redirect";
import Collection from "./layout/collection";
import Detail from "./layout/detail";

import NotFoundPage from "../routes/notfound";

import Album from "../routes/albums/detail";
import AlbumHeader from "../routes/albums/header";
import AlbumList from "../routes/albums/list";

import Artist from "../routes/artists/detail";
import ArtistHeader from "../routes/artists/header";
import ArtistList from "../routes/artists/list";

import Playlist from "../routes/playlists/detail";
import PlaylistList from "../routes/playlists/list";

export default () => {
  const ArtistCollection = Collection("Artist", ArtistList);
  const AlbumCollection = Collection("Album", AlbumList);
  const PlaylistCollection = Collection("Playlist", PlaylistList);

  const ArtistDetail = Detail("Artist", Artist, ArtistHeader);
  const AlbumDetail = Detail("Album", Album, AlbumHeader);
  const PlaylistDetail = Detail("Playlist", Playlist);

  return (
    <Router key="preact_router">
      <Route path="/artists/" key="artists" component={ArtistCollection} />
      <Route path="/albums/" key="albums" component={AlbumCollection} />
      <Route path="/playlists/" key="playlists" component={PlaylistCollection} />

      <Route path="/album/:id" key="album" component={AlbumDetail} />
      <Route path="/artist/:id" key="artist" component={ArtistDetail} />
      <Route path="/playlist/:id" key="playlist" component={PlaylistDetail} />

      <Redirect path="/" to="/artists" />
      <NotFoundPage default />
    </Router>
  );
};
