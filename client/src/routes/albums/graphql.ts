import { gql, ApolloQueryResult } from "@apollo/client";

import client from "../../graphql/client";
import { Album, ListAlbumsQuery } from "../../graphql/api";
import { listAlbums } from "../../graphql/queries";

export const getAlbums = async (): Promise<Album[]> => {
  const result = (await client.query({
    query: gql(listAlbums)
  })) as ApolloQueryResult<ListAlbumsQuery>;

  return result.data?.listAlbums?.items || [];
};
