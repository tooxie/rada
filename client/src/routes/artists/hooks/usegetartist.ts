import { ApolloQueryResult } from "@apollo/client";

import { Artist } from "../../../graphql/api";
import client from "../../../graphql/client";
import useGet from "../../../hooks/useget";
import { GetArtistQuery } from "../../../graphql/api";
import { getArtist } from "../../../graphql/queries";
import { toDbId } from "../../../utils/id";

const doGetArtist = async (variables: { [k: string]: string }) => {
  const result = (await client.query({
    query: getArtist,
    variables,
  })) as ApolloQueryResult<GetArtistQuery>;
  const item = result.data?.getArtist as Artist;

  return item || null;
};

export const useGetArtist = (artistId: string) => {
  console.log(`useGetArtist(${artistId})`);
  const id = toDbId("artist", artistId);
  const { loading, error, item: artist } = useGet<Artist>(doGetArtist, { id });

  console.log({ loading, error, artist });
  return {
    loading,
    error,
    artist,
  };
};

export default useGetArtist;
