import { createRef, h } from "preact";

import { Track } from "../../../graphql/api";
import Options, { Action, Title } from "../../../components/options";
import usePlayer from "../../../hooks/useplayer";

import style from "./style.css";
import fromHereIcon from "./fromhere.svg";
// import stopAfterIcon from "./stopafter.svg";
import playIcon from "./play.svg";
import removeIcon from "./remove.svg";

const DEFAULT_ALBUM_COVER = "/assets/img/no-cover.jpeg";
interface QueueOptionsProps {
  track: Track;
  index: number;
}

const getAlbumCover = (track: Track) => track.album.imageUrl || DEFAULT_ALBUM_COVER;

const QueueOptions = ({ track, index }: QueueOptionsProps) => {
  const player = usePlayer();
  // const client = useApolloClient();
  const ref = createRef();

  const fromHere = () => player?.skipTo(index);
  const remove = () => player?.removeTrackAt(index);
  // const untilHere = () => alert("Playing until here");
  const onlyThis = () => alert("Playing only this track");

  const backgroundImage = `url("${getAlbumCover(track)}")`;
  const artists = (track.artists || [])
    .map((a) => a.name)
    .filter((a) => a)
    .join(", ");

  return (
    <Options>
      <Title>
        <div class={style.cover} style={{ backgroundImage }}>
          &nbsp;
        </div>
        <div class={style.details}>
          {track.title ? (
            <div class={style.title}>{track.title}</div>
          ) : (
            <div class={style.missing}>&lt;no title&gt;</div>
          )}
          {artists && <div>{artists}</div>}
        </div>
      </Title>

      <div class={style.actions} ref={ref}>
        <Action on={fromHere}>
          <img src={fromHereIcon} /> Play from this track on
        </Action>
        <Action on={remove}>
          <img src={removeIcon} /> Remove from Queue
        </Action>
        <Action on={onlyThis}>
          <img src={playIcon} /> Play only this track
        </Action>
        {/*
        <Action on={untilHere}>
          <img src={stopAfterIcon} /> Stop playback after this track
        </Action>
        // TODO: Add playlists
        <Step ref={ref} on={_getPls} next={renderPlaylists}>
          <img src={playlistIcon} /> Add to playlist
        </Step>
        */}
      </div>
    </Options>
  );
};

export default QueueOptions;
