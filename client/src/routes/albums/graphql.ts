import { ApolloQueryResult } from "@apollo/client";

import client from "../../graphql/client";
import { Album, ListAlbumsQuery, GetAlbumQuery } from "../../graphql/api";
import {
  listAlbums as listAlbumsQuery,
  getAlbum as getAlbumQuery
} from "../../graphql/queries";

export const listAlbums = async (): Promise<Album[]> => {
  const result = (await client.query({
    query: listAlbumsQuery
  })) as ApolloQueryResult<ListAlbumsQuery>;
  const items = result.data?.listAlbums?.items;

  return items || [];
};

export const getAlbum = async (id: string): Promise<Album | null> => {
  const result = (await client.query({
    query: getAlbumQuery,
    variables: { id }
  })) as ApolloQueryResult<GetAlbumQuery>;
  const item = result.data?.getAlbum as Album;

  return item || null;
};
