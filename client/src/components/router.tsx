import { h } from "preact";
import { Route, Router } from "preact-router";

import useAppState from "../hooks/useappstate";
import Collection from "./layout/collection";
import Detail from "./layout/detail";

import Home from "../routes/home";
import Unauthorized from "../routes/unauthorized";
import NotFoundPage from "../routes/notfound";

import AlbumDetail from "../routes/albums/detail";
import AlbumHeader from "../routes/albums/header";
import AlbumList from "../routes/albums/list";

import ArtistDetail from "../routes/artists/detail";
import ArtistHeader from "../routes/artists/header";
import ArtistList from "../routes/artists/list";

import TrackList from "../routes/tracks";

import FriendList from "../routes/friends";

const Album = Detail(AlbumDetail, AlbumHeader);
const Albums = Collection(AlbumList);
const Artist = Detail(ArtistDetail, ArtistHeader);
const Artists = Collection(ArtistList);
const Friends = Collection(FriendList);
const Tracks = Collection(TrackList);

const NotFound = Collection(NotFoundPage);
const Root = Collection(Home);

const AppRouter = () => {
  const { appState } = useAppState();

  return (
    <Router key="preact_router">
      <Route path="/" component={Root} />
      <Route path="/unauthorized" component={Unauthorized} />

      <Route path="/artists" key="artists" component={Artists} />
      <Route path="/albums" key="albums" component={Albums} />
      <Route path="/tracks" key="tracks" component={Tracks} />
      {appState.isAdmin && <Route path="/friends" key="friends" component={Friends} />}

      <Route path="/artist/:id" key="artist" component={Artist} />
      <Route path="/album/:id" key="album" component={Album} />
      <Route path="/album/:id/track/:trackId" key="track" component={Album} />

      <NotFound default />
    </Router>
  );
};

export default AppRouter;
