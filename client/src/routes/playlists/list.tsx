import { h } from "preact";
import { Link } from "preact-router";

import Spinner from "../../components/spinner";

import useListPlaylists from "./hooks/uselistplaylists";
import style from "./style.css";

const PlaylistList = () => {
  const { loading, error, playlists } = useListPlaylists();

  // Playlists will have to include the server id to reference a resource, for example:
  // pk             sk             name           server
  // playlist:uuid  playlist:uuid  Acoustic punk
  // playlist:uuid  track:uuid                    server:uuid
  // playlist:uuid  track:uuid                    (no server means it's local)
  // playlist:uuid  album:uuid                    server:uuid

  // The same with favorites. What's the difference between playlists and favorites?
  // That playlists translate to tracks that we can add to the queue, while favorites
  // are only albums and/or artists that are shown in the "homepage". Can playlists
  // be favorited? I don't see why not.
  return (
    <div class={style.playlistgrid}>This resource is currently not implemented.</div>
  );

  if (loading) {
    return <Spinner />;
  } else {
    if (error) return <p class={style.empty}>ERROR: {error?.message}</p>;
    if (!playlists || playlists.length < 1)
      return <p class={style.empty}>No Playlists</p>;
  }

  return (
    <div class={style.playlistgrid}>
      {playlists.map((plist) => (
        <Link href={`/playlist/${plist.id}`}>
          <h1>{plist.name}</h1>
        </Link>
      ))}
    </div>
  );
};

export default PlaylistList;
