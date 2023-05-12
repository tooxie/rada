import gql from "graphql-tag";

import type { Track, ListOrphanTracksQuery } from "../../../graphql/api";

import useList from "../../../hooks/uselist";
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

type UseListReturnType = Omit<ReturnType<typeof useList>, "data">;
interface UseListTracksReturn extends UseListReturnType {
  tracks: Track[];
}

const useListTracks = (): UseListTracksReturn => {
  log.debug("useListTracks");
  const { loading, error, data, refetch } = useList<ListOrphanTracksQuery>(listTracks);
  const tracks = data?.listOrphanTracks?.items || [];

  const result = { loading, error, tracks, refetch };
  log.debug("useListTracks.return:", result);
  return result;
};

export default useListTracks;
