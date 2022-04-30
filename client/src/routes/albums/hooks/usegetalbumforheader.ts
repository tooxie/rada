import { ApolloQueryResult } from "@apollo/client";

import { Album, GetAlbumQuery, GetAlbumQueryVariables } from "../../../graphql/api";
import getClient from "../../../graphql/client";
import useGet from "../../../hooks/useget";
import { getAlbum } from "../../../graphql/custom";
import { AlbumId } from "../../../types";
import Logger from "../../../logger";

const log = new Logger(__filename);

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
  log.debug(`useGetAlbum("${id}")`);
  const pk: GetAlbumQueryVariables = { id };
  const {
    loading,
    error,
    item: album,
  } = useGet<Album, GetAlbumQueryVariables>(doGetAlbum, pk);

  const result = { loading, error, album };
  log.debug("useGetAlbum.return:", result);
  return result;
};

export default useGetAlbum;
