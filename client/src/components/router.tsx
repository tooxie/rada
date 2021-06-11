import { h, FunctionComponent } from "preact";
import { memo } from "preact/compat";
import { Route, Router } from "preact-router";

import useAppState from "../hooks/useappstate";
import Collection from "./layout/collection";
import Detail from "./layout/detail";
import PrefixServer from "./redirect";
import Logger from "../logger";

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
import useConf from "../hooks/useconf";

const log = new Logger(__filename);

const AppRouter = () => {
  const { conf } = useConf();
  const { dispatch, actions } = useAppState();

  // Update server ID when route changes
  const handleRouteChange = (e: any) => {
    if (e.url.includes("/server/server:")) {
      const serverId = e.url.split("/")[2];
      log.debug("serverId", serverId);
      // TODO: Update app-wide server ID. Not sure if we need this for anything
      // really, I mean you can always get the serverId directly from the URL
      // anyway, but it feels cleaner to have a centralized place for this.
      // Feels like the right thing to do.
      // dispatch(actions.SetServerId);
    }
  };

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

const NotFound = Collection(NotFoundPage);

const AppRouter = () => {
  return (
    <Router key="preact_router" onChange={handleRouteChange}>
      <Route path="/" component={Root} />
      <Route path="/unauthorized" component={Unauthorized} />

      {/* Legacy routes that need to be redirected */}
      <Route path="/artists" key="artists-legacy" component={PrefixServer} />
      <Route path="/albums" key="albums-legacy" component={PrefixServer} />
      <Route path="/tracks" key="tracks-legacy" component={PrefixServer} />

      {/* Server-specific routes */}
      <Route path="/server/:serverId/artists" key="artists-list" component={Artists} />
      <Route path="/server/:serverId/artist/:id" key="artist-detail" component={Artist} />
      <Route path="/server/:serverId/albums" key="albums-list" component={Albums} />
      <Route path="/server/:serverId/album/:id" key="album-detail" component={Album} />
      <Route
        path="/server/:serverId/album/:id/track/:trackId"
        key="track-detail"
        component={Album}
      />
      <Route path="/server/:serverId/tracks" key="tracks-list" component={Tracks} />

      {/* Admin routes */}
      <AdminRoute path="/friends" key="friends" component={Friends} />
      <AdminRoute path="/servers" key="servers" component={Servers} />
      <AdminRoute path="/servers/add" key="servers-add" component={AddServer} />

      <Route default component={NotFound} />
    </Router>
  );
};

interface RouteProps {
  path: string;
  key: string;
  component: FunctionComponent<any>;
}

const AdminRoute = ({ path, key, component }: RouteProps) => {
  const { appState } = useAppState();

  if (appState.isAdmin) {
    return <Route path={path} key={key} component={component} />;
  }

  return null;
};

export default memo(AppRouter);
