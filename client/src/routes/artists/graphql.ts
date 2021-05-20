import { gql, ApolloQueryResult } from "@apollo/client";

import client from "../../graphql/client";
import { Artist, ListArtistsQuery } from "../../graphql/api";
import { listArtists } from "../../graphql/queries";

export const getArtists = async (): Promise<Artist[]> => {
  const result = (await client.query({
    query: gql(listArtists)
  })) as ApolloQueryResult<ListArtistsQuery>;

  return result.data?.listArtists?.items || [];
};
