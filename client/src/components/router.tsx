import { FunctionComponent, h } from "preact";
import { lazy } from "preact/compat";
import { Route, Router } from "preact-router";

import Redirect from "./redirect";
import Collection from "./layout/collection";
import Detail from "./layout/detail";

import NotFoundPage from "../routes/notfound";
import Album from "../routes/albums/detail";
import AlbumHeader from "../routes/albums/header";
import Artist from "../routes/artists/detail";
import ArtistHeader from "../routes/artists/header";
import Playlist from "../routes/playlists/detail";

const AlbumList = lazy(() => import("../routes/albums/list"));
const ArtistList = lazy(() => import("../routes/artists/list"));
const PlaylistList = lazy(() => import("../routes/playlists/list"));

export default (() => {
  const ArtistCollection = Collection(ArtistList);
  const AlbumCollection = Collection(AlbumList);
  const PlaylistCollection = Collection(PlaylistList);

  const ArtistDetail = Detail("Artist", Artist, ArtistHeader);
  const AlbumDetail = Detail("Album", Album, AlbumHeader);
  const PlaylistDetail = Detail("Playlist", Playlist);

  return (
    <Router>
      <Route path="/artists/" component={ArtistCollection} />
      <Route path="/albums/" component={AlbumCollection} />
      <Route path="/playlists/" component={PlaylistCollection} />

      <Route path="/artists/:id" component={ArtistDetail} />
      <Route path="/albums/:id" component={AlbumDetail} />
      <Route path="/playlists/:id" component={PlaylistDetail} />

      <Redirect path="/" to="/artists" />
      <NotFoundPage default />
    </Router>
  );
}) as FunctionComponent;
