import { ApolloQueryResult } from "@apollo/client";

import { Artist } from "../../../graphql/api";
import getClient from "../../../graphql/client";
import useGet from "../../../hooks/useget";
import { GetArtistQuery, GetArtistQueryVariables } from "../../../graphql/api";
import { getArtist } from "../../../graphql/custom";
import { toDbId } from "../../../utils/id";
import { ArtistId } from "../../../types";

type UseGetReturnType = Omit<ReturnType<typeof useGet>, "item">;
interface UseGetArtistReturn extends UseGetReturnType {
  artist: Artist | null;
}

const doGetArtist = async (variables: { [k: string]: string }) => {
  const client = await getClient();
  const result = (await client.query({
    query: getArtist,
    variables,
  })) as ApolloQueryResult<GetArtistQuery>;
  const item = result.data?.getArtist as Artist;

  return item || null;
};

export const useGetArtist = (id: ArtistId): UseGetArtistReturn => {
  console.log(`[hooks/usegetartist.ts] useGetArtist("${id}")`);
  const dbId = toDbId("artist", id);
  const pk: GetArtistQueryVariables = { id: dbId };
  const {
    loading,
    error,
    item: artist,
  } = useGet<Artist, GetArtistQueryVariables>(doGetArtist, pk);

  const NOT_FOUND = `Artist '${dbId}' not found`;
  if (error?.message === NOT_FOUND) {
    return { loading, error: null, artist: null };
  }

  const result = { loading, error, artist };
  console.log("[hooks/usegetartist.ts] useGetArtist.return:", result);
  return result;
};

export default useGetArtist;
