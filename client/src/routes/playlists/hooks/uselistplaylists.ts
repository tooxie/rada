import { Playlist, ListPlaylistsQuery } from "../../../graphql/api";
import { listPlaylists } from "../../../graphql/queries";
import useQuery from "../../../hooks/usequery";

const useListPlaylists = () => {
  console.log("useListPlaylists");
  const { loading, error, data } = useQuery<ListPlaylistsQuery, any>(listPlaylists, {});
  const playlists = (data?.listPlaylists?.items || []) as Playlist[];

  console.log("useListPlaylists.return:");
  console.log({ loading, error, playlists });
  return { loading, error, playlists };
};

export default useListPlaylists;
