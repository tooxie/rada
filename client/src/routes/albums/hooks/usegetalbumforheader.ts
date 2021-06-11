import { ApolloQueryResult } from "@apollo/client";

import { Album, GetAlbumQuery, GetAlbumQueryVariables } from "../../../graphql/api";
import getClient from "../../../graphql/client";
import useGet from "../../../hooks/useget";
import { getAlbum } from "../../../graphql/custom";
import { AlbumId } from "../../../types";

const doGetAlbum = async (variables: GetAlbumQueryVariables) => {
  const client = await getClient();
  const result = (await client.query({
    query: getAlbum,
    variables,
  })) as ApolloQueryResult<GetAlbumQuery>;
  const item = result.data?.getAlbum as Album;

  return item || null;
};

const useGetAlbum = (id: AlbumId) => {
  console.log(`[hooks/usegetalbumforheader.ts] useGetAlbum("${id}")`);
  const pk: GetAlbumQueryVariables = { id };
  const {
    loading,
    error,
    item: album,
  } = useGet<Album, GetAlbumQueryVariables>(doGetAlbum, pk);

  const result = { loading, error, album };
  console.log("[hooks/usegetalbumforheader.ts] useGetAlbum.return:", result);
  return result;
};

export default useGetAlbum;
