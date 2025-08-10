import { useMemo } from "preact/hooks";
import { DocumentNode } from "graphql";
import { TypedDocumentNode } from "@apollo/client";

import { Album, GetAlbumQueryVariables } from "../../../graphql/api";
import useGet from "../../../hooks/useget";
import { getAlbumWithTracks } from "../../../graphql/custom";
import { AlbumId, ServerId } from "../../../types";
import { toDbId } from "../../../utils/id";
import Logger from "../../../logger";

const log = new Logger(__filename);

type V = { [k: string]: string };
type Q = DocumentNode | TypedDocumentNode<any, V>;
type UseGetReturnType = Omit<ReturnType<typeof useGet>, "item">;
interface UseGetAlbumReturn extends UseGetReturnType {
  album: Album | null;
}

const useGetAlbum = (serverId: ServerId, albumId?: AlbumId): UseGetAlbumReturn => {
  log.debug(`useGetAlbum(serverId:"${serverId}", albumId:"${albumId}")`);
  const id = toDbId("album", albumId);
  const pk: GetAlbumQueryVariables = { id };

  const result = useGet<Album, GetAlbumQueryVariables>(getAlbumWithTracks, serverId, pk);

  const NOT_FOUND = `Album '${id}' not found`;
  if (result.error === NOT_FOUND) {
    return useMemo(() => ({ loading: result.loading, error: null, album: null }), [result.loading]);
  }

  return useMemo(() => {
    const returnValue = { loading: result.loading, error: result.error, album: result.item };
    log.debug("useGetAlbum.return:", returnValue);
    return returnValue;
  }, [result.loading, result.error, result.item]);
};

export default useGetAlbum;
