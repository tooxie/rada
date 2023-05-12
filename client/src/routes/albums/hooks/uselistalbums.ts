import gql from "graphql-tag";

import { Album, ListAlbumsQuery, ListAlbumsQueryVariables } from "../../../graphql/api";
import { ServerId } from "../../../types";
import useList from "../../../hooks/uselist";
import Logger from "../../../logger";

const log = new Logger(__filename);

const listAlbums = gql`
  query ListAlbums($filter: TableAlbumFilterInput) {
    listAlbums(filter: $filter) {
      items {
        serverId
        id
        name
        imageUrl
        year
        isVa
        artists {
          serverId
          id
          name
        }
      }
    }
  }
`;

type UseListReturnType = Omit<ReturnType<typeof useList>, "items">;
interface UseListAlbumsReturn extends UseListReturnType {
  albums: Album[];
}

const useListAlbums = (serverId: ServerId): UseListAlbumsReturn => {
  log.debug(`useListAlbums("${serverId}")`);
  const { loading, error, items, refetch } = useList<
    ListAlbumsQuery,
    Album,
    ListAlbumsQueryVariables
  >(listAlbums, serverId);

  const result = { loading, error, albums: items, refetch };
  log.debug("useListAlbums.return:", result);
  return result;
};

export default useListAlbums;
