import { ApolloQueryResult } from "@apollo/client";

import { Artist } from "../../../graphql/api";
import client from "../../../graphql/client";
import useGet from "../../../hooks/useget";
import { GetArtistQuery } from "../../../graphql/api";
import { getArtist } from "../../../graphql/queries";

const doGetArtist = async (id: string) => {
  const result = (await client.query({
    query: getArtist,
    variables: { id }
  })) as ApolloQueryResult<GetArtistQuery>;
  const item = result.data?.getArtist as Artist;

  return item || null;
};

export const useGetArtist = (id: string) => {
  console.log("useGetArtist");
  const { loading, error, item: artist } = useGet<Artist>(id, doGetArtist);

  console.log({ loading, error, artist });
  return {
    loading,
    error,
    artist
  };
};

export default useGetArtist;
