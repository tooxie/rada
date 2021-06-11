import { h } from "preact";
import { Route, Router } from "preact-router";

import Home from "../routes/home";
import Unauthorized from "../routes/unauthorized";
import NotFoundPage from "../routes/notfound";
import Queue from "../routes/queue";
import InviteList from "../routes/invites";

import Collection from "./layout/collection";
import Detail from "./layout/detail";

import Album from "../routes/albums/detail";
import AlbumHeader from "../routes/albums/header";
import AlbumList from "../routes/albums/list";

import Artist from "../routes/artists/detail";
import ArtistHeader from "../routes/artists/header";
import ArtistList from "../routes/artists/list";

import Playlist from "../routes/playlists/detail";
import PlaylistList from "../routes/playlists/list";

const ArtistCollection = Collection(ArtistList);
const AlbumCollection = Collection(AlbumList);
const PlaylistCollection = Collection(PlaylistList);
const Invitations = Collection(InviteList);

const ArtistDetail = Detail(Artist, ArtistHeader);
const AlbumDetail = Detail(Album, AlbumHeader);
const PlaylistDetail = Detail(Playlist);

const NotFound = Collection(NotFoundPage);

const AppRouter = () => {
  return (
    <Router key="preact_router">
      <Route path="/" component={Collection(Home)} />
      <Route path="/unauthorized" component={Unauthorized} />

      <Route path="/artists/" key="artists" component={ArtistCollection} />
      <Route path="/albums/" key="albums" component={AlbumCollection} />
      <Route path="/playlists/" key="playlists" component={PlaylistCollection} />

      <Route path="/artist/:id" key="artist" component={ArtistDetail} />
      <Route path="/album/:id" key="album" component={AlbumDetail} />
      <Route path="/album/:id/track/:trackId" key="track" component={AlbumDetail} />
      <Route path="/playlist/:id" key="playlist" component={PlaylistDetail} />

      <Route path="/queue" key="queue" component={Queue} />
      <Route path="/invitations" key="queue" component={Invitations} />

      <NotFound default />
    </Router>
  );
};

export default AppRouter;
