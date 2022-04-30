import { Playlist, ListPlaylistsQuery } from "../../../graphql/api";
import { listPlaylists } from "../../../graphql/queries";
import useQuery from "../../../hooks/usequery";
import Logger from "../../../logger";

const log = new Logger(__filename);

const useListPlaylists = () => {
  log.debug("useListPlaylists");
  const { loading, error, data } = useQuery<ListPlaylistsQuery, any>(listPlaylists, {});
  const playlists = (data?.listPlaylists?.items || []) as Playlist[];

  log.debug("useListPlaylists.return:");
  log.debug({ loading, error, playlists });
  return { loading, error, playlists };
};

export default useListPlaylists;
