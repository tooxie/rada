import { Album, GetAlbumQueryVariables } from "../../../graphql/api";
import useGet from "../../../hooks/useget";
import { getAlbum } from "../../../graphql/custom";
import { AlbumId, ServerId } from "../../../types";
import Logger from "../../../logger";
import { toDbId } from "../../../utils/id";

const log = new Logger(__filename);

const useGetAlbum = (serverId: ServerId, albumId: AlbumId) => {
  log.debug(`useGetAlbum("${albumId}", "${serverId}")`);
  const id = toDbId("album", albumId);
  const pk: GetAlbumQueryVariables = { id };
  const {
    loading,
    error,
    item: album,
  } = useGet<Album, GetAlbumQueryVariables>(getAlbum, serverId, pk);

  const result = { loading, error, album };
  log.debug("useGetAlbum.return:", result);
  return result;
};

export default useGetAlbum;
