import { ApolloQueryResult } from "@apollo/client";

import { Track, GetTrackQuery, GetTrackQueryVariables } from "../../../graphql/api";
import getClient from "../../../graphql/client";
import useGet from "../../../hooks/useget";
import { getTrack } from "../../../graphql/queries";
import { TrackId, AlbumId } from "../../../types";
import Logger from "../../../logger";

const log = new Logger(__filename);

const doGetTrack = async (variables: GetTrackQueryVariables): Promise<Track | null> => {
  const client = await getClient();
  const result = (await client.query({
    query: getTrack,
    variables,
  })) as ApolloQueryResult<GetTrackQuery>;
  const item = result.data?.getTrack as Track;

  return item || null;
};

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
  } = useGet<Track, GetTrackQueryVariables>(doGetTrack, pk);

  const result = { loading, error, track };
  log.debug("useGetTrack.return:", result);
  return result;
};

export default useGetTrack;
