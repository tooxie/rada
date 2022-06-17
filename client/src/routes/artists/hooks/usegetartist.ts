import { Artist } from "../../../graphql/api";
import useGet from "../../../hooks/useget";
import { GetArtistQueryVariables } from "../../../graphql/api";
import { getArtist } from "../../../graphql/custom";
import { toDbId } from "../../../utils/id";
import { ArtistId, ServerId } from "../../../types";
import Logger from "../../../logger";

const log = new Logger(__filename);

type UseGetReturnType = Omit<ReturnType<typeof useGet>, "item">;
interface UseGetArtistReturn extends UseGetReturnType {
  artist: Artist | null;
}

export const useGetArtist = (
  serverId: ServerId,
  artistId: ArtistId
): UseGetArtistReturn => {
  log.debug(`useGetArtist(serverId:"${serverId}", artistId:"${artistId}")`);
  const id = toDbId("artist", artistId);
  const pk: GetArtistQueryVariables = { id };
  const {
    loading,
    error,
    item: artist,
  } = useGet<Artist, GetArtistQueryVariables>(serverId, getArtist, pk);

  const NOT_FOUND = `Artist '${id}' not found`;
  if (error === NOT_FOUND) {
    return { loading, error: null, artist: null };
  }

  const result = { loading, error, artist };
  log.debug("useGetArtist.return:", result);
  return result;
};

export default useGetArtist;
