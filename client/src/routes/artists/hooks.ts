import { Artist } from "../../graphql/api";
import { getArtist, listArtists } from "./graphql";
import { useGet, useList } from "../../hooks";

export const useGetArtist = (id: string) => {
  const { loading, error, item: artist } = useGet<Artist>(id, getArtist);

  return {
    loading,
    error,
    artist
  };
};

export const useListArtists = () => {
  console.log("useListArtists");
  const { loading, error, items: artists } = useList<Artist[]>(listArtists);

  console.log("useListArtists.return:");
  console.log({ loading, error, artists });
  return {
    loading,
    error,
    artists
  };
};
