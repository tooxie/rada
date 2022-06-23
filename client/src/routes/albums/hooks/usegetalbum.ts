import { Album, GetAlbumQueryVariables } from "../../../graphql/api";
import useGet from "../../../hooks/useget";
import { getAlbumWithTracks } from "../../../graphql/custom";
import { AlbumId } from "../../../types";
import { toDbId } from "../../../utils/id";
import Logger from "../../../logger";

const log = new Logger(__filename);

type UseGetReturnType = Omit<ReturnType<typeof useGet>, "item">;
interface UseGetAlbumReturn extends UseGetReturnType {
  album: Album | null;
}

const useGetAlbum = (id?: AlbumId): UseGetAlbumReturn => {
  log.debug(`useGetAlbum("${id}")`);
  const dbId = toDbId("album", id);
  const pk: GetAlbumQueryVariables = { id: dbId };
  const {
    loading,
    error,
    item: album,
  } = useGet<Album, GetAlbumQueryVariables>(getAlbumWithTracks, pk);

  const NOT_FOUND = `Album '${dbId}' not found`;
  if (error === NOT_FOUND) {
    return { loading, error: null, album: null };
  }

  const result = { loading, error, album };
  log.debug("useGetAlbum.return:", result);
  return result;
};

export default useGetAlbum;
