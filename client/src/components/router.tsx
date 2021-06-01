import { h } from "preact";
import { lazy } from "preact/compat";
import { Route, Router } from "preact-router";

import Redirect from "./redirect";
import Collection from "./layout/collection";
import Detail from "./layout/detail";

import NotFoundPage from "../routes/notfound";

const Album = lazy(() => import("../routes/albums/detail"));
const AlbumHeader = lazy(() => import("../routes/albums/header"));
const AlbumList = lazy(() => import("../routes/albums/list"));

const Artist = lazy(() => import("../routes/artists/detail"));
const ArtistHeader = lazy(() => import("../routes/artists/header"));
const ArtistList = lazy(() => import("../routes/artists/list"));

const Playlist = lazy(() => import("../routes/playlists/detail"));
const PlaylistList = lazy(() => import("../routes/playlists/list"));

export default () => {
  const ArtistCollection = Collection(ArtistList);
  const AlbumCollection = Collection(AlbumList);
  const PlaylistCollection = Collection(PlaylistList);

  const ArtistDetail = Detail("Artist", Artist, ArtistHeader);
  const AlbumDetail = Detail("Album", Album, AlbumHeader);
  const PlaylistDetail = Detail("Playlist", Playlist);

  return (
    <Router>
      <Route path="/artists/" key="artists" component={ArtistCollection} />
      <Route path="/albums/" key="albums" component={AlbumCollection} />
      <Route
        path="/playlists/"
        key="playlists"
        component={PlaylistCollection}
      />

      <Route path="/artists/:id" key="artist" component={ArtistDetail} />
      <Route path="/albums/:id" key="album" component={AlbumDetail} />
      <Route path="/playlists/:id" key="playlist" component={PlaylistDetail} />

      <Redirect path="/" to="/artists" />
      <NotFoundPage default />
    </Router>
  );
};
