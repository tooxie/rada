import gql from "graphql-tag";

import { Album, ListAlbumsQuery } from "../../../graphql/api";
import useQuery from "../../../hooks/usequery";
import Logger from "../../../logger";

const log = new Logger(__filename);

const listAlbums = gql`
  query ListAlbums($filter: TableAlbumFilterInput) {
    listAlbums(filter: $filter) {
      items {
        id
        name
        imageUrl
        year
        isVa
        artists {
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

const useListAlbums = (): UseListAlbumsReturn => {
  log.debug("useListAlbums");
  const { loading, error, data } = useQuery<ListAlbumsQuery>(listAlbums);
  const albums = data?.listAlbums?.items || [];

  const result = { loading, error, albums };
  log.debug("useListAlbums.return:", result);
  return result;
};

export default useListAlbums;
