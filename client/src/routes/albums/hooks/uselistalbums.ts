import gql from "graphql-tag";

import { Album, ListAlbumsQuery, ListAlbumsQueryVariables } from "../../../graphql/api";
import { ServerId } from "../../../types";
import useQuery from "../../../hooks/usequery";
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

type UseQueryReturnType = Omit<ReturnType<typeof useQuery>, "data">;
interface UseListAlbumsReturn extends UseQueryReturnType {
  albums: Album[];
}

const useListAlbums = (serverId: ServerId): UseListAlbumsReturn => {
  log.debug(`useListAlbums("${serverId}")`);
  const { loading, error, data, refetch } = useQuery<
    ListAlbumsQuery,
    ListAlbumsQueryVariables
  >(listAlbums, {});
  const albums = data?.listAlbums?.items || [];

  const result = { loading, error, albums, refetch };
  log.debug("useListAlbums.return:", result);
  return result;
};

export default useListAlbums;
