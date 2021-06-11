import { DocumentNode } from "graphql";

import {
  Artist,
  ListArtistsQuery,
  ListArtistsQueryVariables,
} from "../../../graphql/api";
import { listArtists } from "../../../graphql/queries";
import useQuery from "../../../hooks/usequery";

type UseQueryReturnType = Omit<ReturnType<typeof useQuery>, "data">;
interface UseListArtistsReturn extends UseQueryReturnType {
  artists: Artist[];
}

const useListArtists = (queryFn?: DocumentNode): UseListArtistsReturn => {
  console.log("[artists/hooks/uselistartists.ts] useListArtists");

  const listArtistsFn = queryFn || listArtists;
  const { loading, error, data } = useQuery<ListArtistsQuery, ListArtistsQueryVariables>(
    listArtistsFn,
    {}
  );
  const artists = (data?.listArtists?.items || []) as Artist[];

  console.log("[artists/hooks/uselistartists.ts] useListArtists.return:", {
    loading,
    error,
    artists,
  });
  return { loading, error, artists };
};

export default useListArtists;
