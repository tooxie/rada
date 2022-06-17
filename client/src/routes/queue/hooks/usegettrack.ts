import { Track, GetTrackQueryVariables } from "../../../graphql/api";
import useGet from "../../../hooks/useget";
import { getTrack } from "../../../graphql/queries";
import { TrackId, AlbumId, ServerId } from "../../../types";
import Logger from "../../../logger";
import { toDbId } from "../../../utils/id";

const log = new Logger(__filename);

type UseGetReturnType = Omit<ReturnType<typeof useGet>, "item">;
interface UseGetTrackType extends UseGetReturnType {
  track: Track | null;
}

const useGetTrack = (serverId: ServerId, tId: TrackId, aId: AlbumId): UseGetTrackType => {
  if (!serverId || !tId || !aId) {
    throw new Error(`useGetTrack requires 3 parameters, serverId, trackId and albumId`);
  }
  log.debug(`useGetTrack(serverId:"${serverId}", trackId:"${tId}", albumId:"${aId}")`);
  const albumId = toDbId("album", aId);
  const id = toDbId("track", tId);
  const pk: GetTrackQueryVariables = { albumId, id };
  const {
    loading,
    error,
    item: track,
  } = useGet<Track, GetTrackQueryVariables>(serverId, getTrack, pk);

  const result = { loading, error, track };
  log.debug("useGetTrack.return:", result);
  return result;
};

export default useGetTrack;
