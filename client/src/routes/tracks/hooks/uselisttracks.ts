import gql from "graphql-tag";

import type { Track, ListOrphanTracksQuery } from "../../../graphql/api";
import type { ServerId } from "../../../types";
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
        path
        artists {
          id
          name
        }
      }
    }
  }
`;

type UseListReturnType = Omit<ReturnType<typeof useList>, "items">;
interface UseListTracksReturn extends UseListReturnType {
  tracks: Track[];
}

const useListTracks = (serverId: ServerId): UseListTracksReturn => {
  log.debug("useListTracks");
  const { loading, error, items, refetch } = useList<ListOrphanTracksQuery, Track>(
    listTracks,
    serverId
  );
  const result = { loading, error, tracks: items, refetch };

  log.debug("useListTracks.return:", { loading, error, tracks: items });
  return result;
};

export default useListTracks;
