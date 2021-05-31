import { FunctionComponent, h } from "preact";
import { useState, useEffect } from "preact/hooks";

import { DetailProps } from "../../components/layout/detail/types";
import Spinner from "../../components/spinner";
import { Album } from "../../graphql/api";

import { getAlbum } from "./graphql";

const AlbumDetail: FunctionComponent<DetailProps> = ({ id }) => {
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      getAlbum(id).then(album => {
        setAlbum(album);
        setLoading(false);
      });
    }
  });

  if (loading) {
    return <Spinner />;
  } else if (!album) {
    return <p>Album not found</p>;
  }

  return <h1>{album.title}</h1>;
};

export default AlbumDetail;
