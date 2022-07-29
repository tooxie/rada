import gql from "graphql-tag";

import { Track, ListOrphanTracksQuery } from "../../../graphql/api";
import useQuery from "../../../hooks/usequery";
import Logger from "../../../logger";

const log = new Logger(__filename);

const listTracks = gql`
  query ListTracks {
    listOrphanTracks {
      items {
        id
        title
        lengthInSeconds
        url
        artists {
          id
          name
        }
      }
    }
  }
`;

type UseQueryReturnType = Omit<ReturnType<typeof useQuery>, "data">;
interface UseListTracksReturn extends UseQueryReturnType {
  tracks: Track[];
}

const useListTracks = (): UseListTracksReturn => {
  log.debug("useListTracks");
  const { loading, error, data, refetch } = useQuery<ListOrphanTracksQuery>(listTracks);
  const tracks = data?.listOrphanTracks?.items || [];

  const result = { loading, error, tracks, refetch };
  log.debug("useListTracks.return:", result);
  return result;
};

export default useListTracks;
