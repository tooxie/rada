import { Album, ListAlbumsQuery } from "../../../graphql/api";
import { listAlbums } from "../../../graphql/queries";
import useQuery from "../../../hooks/usequery";

const useListAlbums = () => {
  console.log("useListAlbums");
  const { loading, error, data } = useQuery<ListAlbumsQuery, any>(listAlbums, {});
  const albums = (data?.listAlbums?.items || []) as Album[];

  console.log("useListAlbums.return:");
  console.log({ loading, error, albums });
  return { loading, error, albums };
};

export default useListAlbums;
