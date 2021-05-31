import { ApolloQueryResult } from "@apollo/client";

import client from "../../graphql/client";
import { Artist, ListArtistsQuery, GetArtistQuery } from "../../graphql/api";
import {
  listArtists as listArtistsQuery,
  getArtist as getArtistQuery
} from "../../graphql/queries";

export const listArtists = async (): Promise<Artist[]> => {
  const result = (await client.query({
    query: listArtistsQuery
  })) as ApolloQueryResult<ListArtistsQuery>;
  const items = result.data?.listArtists?.items;

  return items || [];
};

export const getArtist = async (id: string): Promise<Artist | null> => {
  const result = (await client.query({
    query: getArtistQuery,
    variables: { id }
  })) as ApolloQueryResult<GetArtistQuery>;
  const item = result.data?.getArtist as Artist;

  return item || null;
};
