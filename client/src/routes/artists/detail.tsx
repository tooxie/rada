import { FunctionComponent, h } from "preact";
import { useState, useEffect } from "preact/hooks";

import { DetailProps } from "../../components/layout/detail/types";
import Spinner from "../../components/spinner";
import { Artist } from "../../graphql/api";

import { getArtist } from "./graphql";
import style from "./style.css";

const ArtistDetail: FunctionComponent<DetailProps> = ({ id }) => {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading) {
      getArtist(id)
        .then(artist => {
          setArtist(artist);
          setLoading(false);
        })
        .catch(error => {
          setError(error.message);
          setLoading(false);
        });
    }
  });

  console.log(`loading: ${loading}`);
  console.log(`error: "${error}"`);
  if (loading) {
    return (
      <div style={{ marginTop: "2rem" }}>
        <Spinner />
      </div>
    );
  } else if (!artist) {
    return error ? <p>{error}</p> : <p>Artist not found</p>;
  }

  return <h1 class={style.name}>{artist.name}</h1>;
};

export default ArtistDetail;
