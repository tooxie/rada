import { FunctionComponent, h } from "preact";

import { DetailProps } from "../../components/layout/detail/types";
import Spinner from "../../components/spinner";

import style from "./style.css";
import { useGetArtist } from "./hooks";

const ArtistDetail: FunctionComponent<DetailProps> = props => {
  const { loading, item: artist, error } = useGetArtist(props.id);

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

  return (
    <div class={style.artist}>
      <h1 class={style.name}>{artist.name}</h1>
    </div>
  );
};

export default ArtistDetail;
