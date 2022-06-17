import { h } from "preact";
import { Route, Router } from "preact-router";

import useAppState from "../hooks/useappstate";
import Collection from "./layout/collection";
import Detail from "./layout/detail";
import PrefixServer from "./redirect";

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
import ServerList from "../routes/servers/list";
import ServerAdd from "../routes/servers/add";

const Album = Detail(AlbumDetail, AlbumHeader, "album");
const Albums = Collection(AlbumList);
const Artist = Detail(ArtistDetail, ArtistHeader, "artist");
const Artists = Collection(ArtistList);
const Friends = Collection(FriendList);
const Servers = Collection(ServerList);
const AddServer = Collection(ServerAdd);
const Tracks = Collection(TrackList);

const NotFound = Collection(NotFoundPage);
const Root = Collection(Home);

const AppRouter = () => {
  const { appState } = useAppState();

  return (
    <Router key="preact_router">
      <Route path="/" component={Root} />
      <Route path="/unauthorized" component={Unauthorized} />

      {/* To keep compatibility with the shortcuts defined in the manifest file */}
      <Route path="/artists" key="artists" component={PrefixServer} />
      <Route path="/albums" key="albums" component={PrefixServer} />
      <Route path="/tracks" key="tracks" component={PrefixServer} />

      <Route path="/server/:serverId/artists" key="artists" component={Artists} />
      <Route path="/server/:serverId/artist/:id" key="artist" component={Artist} />
      <Route path="/server/:serverId/albums" key="albums" component={Albums} />
      <Route path="/server/:serverId/album/:id" key="album" component={Album} />
      <Route
        path="/server/:serverId/album/:id/track/:trackId"
        key="track"
        component={Album}
      />
      <Route path="/server/:serverId/tracks" key="tracks" component={Tracks} />

      {appState.isAdmin && <Route path="/friends" key="friends" component={Friends} />}
      {appState.isAdmin && <Route path="/servers" key="servers" component={Servers} />}

      <Route default component={NotFound} />
    </Router>
  );
};

export default AppRouter;
