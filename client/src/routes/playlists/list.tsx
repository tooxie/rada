import { FunctionalComponent, h } from "preact";
import style from "./style.css";

const PlaylistList: FunctionalComponent = () => {
  return (
    <div class={style.home}>
      <h1>Playlist</h1>
      <p>Here will go the playlist list page.</p>
    </div>
  );
};

export default PlaylistList;
