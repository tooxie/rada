import { ApolloQueryResult } from "@apollo/client";

import { Album } from "../../../graphql/api";
import getClient from "../../../graphql/client";
import useGet from "../../../hooks/useget";
import { GetAlbumQuery } from "../../../graphql/api";
import { getAlbum } from "../../../graphql/queries";
import { toDbId } from "../../../utils/id";

const doGetAlbum = async (variables: object) => {
  const client = await getClient();
  const result = (await client.query({
    query: getAlbum,
    variables,
  })) as ApolloQueryResult<GetAlbumQuery>;
  const item = result.data?.getAlbum as Album;

  return item || null;
};

export const useGetAlbum = (id: string) => {
  console.log(`useGetAlbum("${id}")`);
  const _id = toDbId("album", id);
  const pk = { id: _id, sk: _id };
  const { loading, error, item: album } = useGet<Album>(doGetAlbum, pk);

  console.log({ loading, error, album });
  return {
    loading,
    error,
    album,
  };
};

export default useGetAlbum;
