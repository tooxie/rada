import { FunctionComponent, h } from "preact";
import style from "./style.css";

const PlaylistList: FunctionComponent = () => {
  return (
    <div class={style.home}>
      <h1>Playlist</h1>
      <p>Here will go the playlist list page.</p>
    </div>
  );
};

export default PlaylistList;
