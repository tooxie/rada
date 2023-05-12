import {
  Artist,
  ListArtistsQuery,
  ListArtistsQueryVariables,
} from "../../../graphql/api";
import { listArtists } from "../../../graphql/queries";
import useList from "../../../hooks/uselist";
import Logger from "../../../logger";
import type { ServerId } from "../../../types";

const log = new Logger(__filename);

type UseListReturnType = Omit<ReturnType<typeof useList>, "items">;
interface UseListArtistsReturn extends UseListReturnType {
  artists: Artist[];
}

const useListArtists = (serverId: ServerId): UseListArtistsReturn => {
  log.debug("[artists/hooks/uselistartists.ts] useListArtists");
  const { loading, error, items, refetch } = useList<
    ListArtistsQuery,
    Artist,
    ListArtistsQueryVariables
  >(listArtists, serverId);

  log.debug("useListArtists.return:", {
    loading,
    error,
    artists: items,
  });
  return { loading, error, artists: items, refetch };
};

export default useListArtists;
