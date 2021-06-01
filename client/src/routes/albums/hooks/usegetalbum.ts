import { ApolloQueryResult } from "@apollo/client";

import { Album } from "../../../graphql/api";
import client from "../../../graphql/client";
import useGet from "../../../hooks/useget";
import { GetAlbumQuery } from "../../../graphql/api";
import { getAlbum } from "../../../graphql/queries";

const doGetAlbum = async (id: string) => {
  const result = (await client.query({
    query: getAlbum,
    variables: { id }
  })) as ApolloQueryResult<GetAlbumQuery>;
  const item = result.data?.getAlbum as Album;

  return item || null;
};

export const useGetAlbum = (id: string) => {
  console.log("useGetAlbum");
  const { loading, error, item: album } = useGet<Album>(id, doGetAlbum);

  console.log({ loading, error, album });
  return {
    loading,
    error,
    album
  };
};

export default useGetAlbum;
