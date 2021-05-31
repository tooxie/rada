import { ApolloQueryResult } from "@apollo/client";

import client from "../../graphql/client";
import { Artist, GetArtistQuery, ListArtistsQuery } from "../../graphql/api";
import {
  listArtists as listArtistsQuery,
  getArtist as getArtistQuery
} from "../../graphql/queries";
import { useQuery } from "../../hooks";

export const listArtists = (nextToken?: string) => {
  console.log("listArtists");
  const { loading, error, data } = useQuery<ListArtistsQuery, any>(
    client,
    listArtistsQuery,
    { nextToken }
  );
  const artists = (data?.listArtists?.items || []) as Artist[];

  console.log("listArtists.return:");
  console.log({ loading, error, artists });
  return { loading, error, artists };
};

export const getArtist = async (id: string): Promise<Artist | null> => {
  const result = (await client.query({
    query: getArtistQuery,
    variables: { id }
  })) as ApolloQueryResult<GetArtistQuery>;
  const item = result.data?.getArtist as Artist;

  return item || null;
};
