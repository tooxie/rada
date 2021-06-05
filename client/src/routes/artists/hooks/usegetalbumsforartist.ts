import { ApolloQueryResult } from "@apollo/client";

import client from "../../../graphql/client";
import useList from "../../../hooks/uselist";
import { GetAlbumsForArtistQuery } from "../../../graphql/api";
import { getAlbumsForArtist } from "../../../graphql/queries";
import { Album } from "../../../graphql/api";

const doGetAlbumsForArtist = async (variables: {
  [k: string]: string;
}): Promise<Album[]> => {
  const result = (await client.query({
    query: getAlbumsForArtist,
    variables,
  })) as ApolloQueryResult<GetAlbumsForArtistQuery>;
  const albums = result.data?.getAlbumsForArtist as Album[];

  return albums || [];
};

const useGetAlbumsForArtist = (artistId: string) => {
  console.log(`useGetAlbumsForArtist(${JSON.stringify(artistId)})`);
  const {
    loading,
    error,
    items: albums,
  } = useList<Album>(doGetAlbumsForArtist, { artistId });

  return { loading, error, albums };
};

export default useGetAlbumsForArtist;
