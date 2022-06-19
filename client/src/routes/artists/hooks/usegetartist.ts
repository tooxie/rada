import { Artist } from "../../../graphql/api";
import useGet from "../../../hooks/useget";
import { GetArtistQueryVariables } from "../../../graphql/api";
import { getArtist } from "../../../graphql/custom";
import { toDbId } from "../../../utils/id";
import { ArtistId } from "../../../types";
import Logger from "../../../logger";

const log = new Logger(__filename);

type UseGetReturnType = Omit<ReturnType<typeof useGet>, "item">;
interface UseGetArtistReturn extends UseGetReturnType {
  artist: Artist | null;
}

export const useGetArtist = (id: ArtistId): UseGetArtistReturn => {
  log.debug(`useGetArtist("${id}")`);
  const dbId = toDbId("artist", id);
  const pk: GetArtistQueryVariables = { id: dbId };
  const {
    loading,
    error,
    item: artist,
  } = useGet<Artist, GetArtistQueryVariables>(getArtist, pk);

  const NOT_FOUND = `Artist '${dbId}' not found`;
  if (error?.message === NOT_FOUND) {
    return { loading, error: null, artist: null };
  }

  const result = { loading, error, artist };
  log.debug("useGetArtist.return:", result);
  return result;
};

export default useGetArtist;
