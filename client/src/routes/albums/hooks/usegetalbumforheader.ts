import { Album, GetAlbumQueryVariables } from "../../../graphql/api";
import useGet from "../../../hooks/useget";
import { getAlbum } from "../../../graphql/custom";
import { AlbumId } from "../../../types";
import Logger from "../../../logger";

const log = new Logger(__filename);

const useGetAlbum = (id: AlbumId) => {
  log.debug(`useGetAlbum("${id}")`);
  const pk: GetAlbumQueryVariables = { id };
  const {
    loading,
    error,
    item: album,
  } = useGet<Album, GetAlbumQueryVariables>(getAlbum, pk);

  const result = { loading, error, album };
  log.debug("useGetAlbum.return:", result);
  return result;
};

export default useGetAlbum;
