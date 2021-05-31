import { Artist } from "../../graphql/api";
import { getArtist } from "./graphql";
import { useGet } from "../../hooks";

export const useGetArtist = (id: string) => {
  return useGet<Artist>(id, getArtist);
};
