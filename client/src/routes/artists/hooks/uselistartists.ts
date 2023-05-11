import { DocumentNode } from "graphql";

import {
  Artist,
  ListArtistsQuery,
  ListArtistsQueryVariables,
} from "../../../graphql/api";
import { listArtists } from "../../../graphql/queries";
import useList from "../../../hooks/uselist";
import Logger from "../../../logger";

const log = new Logger(__filename);

type UseListReturnType = Omit<ReturnType<typeof useList>, "data">;
interface UseListArtistsReturn extends UseListReturnType {
  artists: Artist[];
}

const useListArtists = (queryFn?: DocumentNode): UseListArtistsReturn => {
  log.debug("[artists/hooks/uselistartists.ts] useListArtists");

  const listArtistsFn = queryFn || listArtists;
  const { loading, error, data, refetch } =
    useList<ListArtistsQuery, ListArtistsQueryVariables>(listArtistsFn);
  const artists = (data?.listArtists?.items || []) as Artist[];

  log.debug("useListArtists.return:", {
    loading,
    error,
    artists,
  });
  return { loading, error, artists, refetch };
};

export default useListArtists;
