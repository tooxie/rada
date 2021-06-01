import client from "../../../graphql/client";
import { Artist, ListArtistsQuery } from "../../../graphql/api";
import { listArtists } from "../../../graphql/queries";
import useQuery from "../../../hooks/usequery";

const useListArtists = (nextToken?: string) => {
  console.log("useListArtists");
  const { loading, error, data } = useQuery<ListArtistsQuery, any>(
    client,
    listArtists,
    { nextToken }
  );
  const artists = (data?.listArtists?.items || []) as Artist[];

  console.log("useListArtists.return:");
  console.log({ loading, error, artists });
  return { loading, error, artists };
};

export default useListArtists;
