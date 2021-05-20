import { FunctionalComponent, h } from "preact";
import { Route, Router } from "preact-router";

import Albums from "../routes/albums";
import Artists from "../routes/artists";
import Playlists from "../routes/playlists";
import Redirect from "./redirect";
import NotFoundPage from "../routes/notfound";
import Collection from "./layout/collection";
import Detail from "./layout/detail";

export default (() => {
  const ArtistCollection = Collection(Artists);
  const AlbumCollection = Collection(Albums);
  const PlaylistCollection = Collection(Playlists);

  const ArtistDetail = Detail(Artists);
  const AlbumDetail = Detail(Albums);
  const PlaylistDetail = Detail(Playlists);

  return (
    <Router>
      <Route path="/artists/" component={ArtistCollection} />
      <Route path="/albums/" component={AlbumCollection} />
      <Route path="/playlists/" component={PlaylistCollection} />

      <Route path="/artists/:id" component={ArtistDetail} />
      <Route path="/albums/:id" component={AlbumDetail} />
      <Route path="/playlists/:id" component={PlaylistDetail} />

      <Redirect path="/" to="/albums" />
      <NotFoundPage default />
    </Router>
  );
}) as FunctionalComponent;
