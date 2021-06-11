import { ApolloQueryResult } from "@apollo/client";

import { Album, GetAlbumQuery, GetAlbumQueryVariables } from "../../../graphql/api";
import getClient from "../../../graphql/client";
import useGet from "../../../hooks/useget";
import { getAlbumWithTracks } from "../../../graphql/custom";
import { AlbumId } from "../../../types";
import { toDbId } from "../../../utils/id";

type UseGetReturnType = Omit<ReturnType<typeof useGet>, "item">;
interface UseGetAlbumReturn extends UseGetReturnType {
  album: Album | null;
}

const doGetAlbum = async (variables: GetAlbumQueryVariables) => {
  const client = await getClient();
  const result = (await client.query({
    query: getAlbumWithTracks,
    variables,
  })) as ApolloQueryResult<GetAlbumQuery>;
  const item = result.data?.getAlbum as Album;

  return item || null;
};

const useGetAlbum = (id: AlbumId): UseGetAlbumReturn => {
  console.log(`[hooks/usegetalbum.ts] useGetAlbum("${id}")`);
  const dbId = toDbId("album", id);
  const pk: GetAlbumQueryVariables = { id: dbId };
  const {
    loading,
    error,
    item: album,
  } = useGet<Album, GetAlbumQueryVariables>(doGetAlbum, pk);

  const NOT_FOUND = `Album '${dbId}' not found`;
  if (error?.message === NOT_FOUND) {
    return { loading, error: null, album: null };
  }

  const result = { loading, error, album };
  console.log("[hooks/usegetalbum.ts] useGetAlbum.return:", result);
  return result;
};

export default useGetAlbum;
