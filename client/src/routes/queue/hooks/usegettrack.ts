import { Track, GetTrackQueryVariables } from "../../../graphql/api";
import useGet from "../../../hooks/useget";
import { getTrack } from "../../../graphql/queries";
import { TrackId, AlbumId } from "../../../types";
import Logger from "../../../logger";

const log = new Logger(__filename);

type UseGetReturnType = Omit<ReturnType<typeof useGet>, "item">;
interface UseGetTrackType extends UseGetReturnType {
  track: Track | null;
}

const useGetTrack = (trackId: TrackId, albumId: AlbumId): UseGetTrackType => {
  if (!trackId || !albumId) {
    throw new Error(
      `useGetTrack requires 2 parameters, trackId and albumId. Got "${trackId}" and "${albumId}"`
    );
  }
  log.debug(`useGetTrack("${trackId}", "${albumId}")`);
  const pk: GetTrackQueryVariables = { albumId, id: trackId };
  const {
    loading,
    error,
    item: track,
  } = useGet<Track, GetTrackQueryVariables>(getTrack, pk);

  const result = { loading, error, track };
  log.debug("useGetTrack.return:", result);
  return result;
};

export default useGetTrack;
