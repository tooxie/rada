import { Fragment, h } from "preact";

import type { Artist, Track } from "../../graphql/api";
import type { IPlayer } from "../../player/types";
import type { ListProps } from "../../components/layout/types";

import ErrorMsg from "../../components/error";
import Logger from "../../logger";
import ScrollTop from "../../components/scrolltop";
import Search from "../../components/search";
import Spinner from "../../components/spinner";
import toMinutes from "../../utils/tominutes";
import useConf from "../../hooks/useconf";
import usePlayer from "../../hooks/useplayer";

import useListTracks from "./hooks/uselisttracks";
import style from "./styles.css";
import icon from "./track.svg";

const log = new Logger(__filename);

const Tracks = ({ serverId }: ListProps) => {
  const { conf } = useConf();
  const player = usePlayer();
  const { loading, error, tracks } = useListTracks(serverId);

  if (loading) return <Spinner />;
  if (error) {
    log.error(error);
    return <ErrorMsg error={error} />;
  }
  if (!tracks.length) return <div>No tracks</div>;

  const filterFn = (track: Track, s: string): boolean => {
    const title = (track.title || "").toLowerCase();
    return title.includes(s.toLowerCase());
  };

  return (
    <Fragment>
      <Search
        input={tracks}
        key="track-list"
        noResultsClass={style.empty}
        filter={filterFn}
        enabled={conf.searchEnabled}
      >
        {(result: Track[]) => (
          <div class={style.tracks}>
            {result.map(renderTrack(player))}
            <ScrollTop />
          </div>
        )}
      </Search>
      <div class={style.note}>
        Note: This is a list of tracks that do not belong to any album.
      </div>
    </Fragment>
  );
};

const renderArtists = (artists: Artist[]) => {
  if (artists.length === 0) {
    return <div class={style.missing}>{"<no artist>"}</div>;
  }
  return artists.map((artist: Artist) => <span class={style.artist}>{artist.name}</span>);
};

const renderTrack = (player?: IPlayer | null) => (track: Track) => {
  if (!player) return null;

  const getHandler = (track: Track) => () => {
    player.appendTracks([track]);
    if (player.getQueueLength() === 1) player.play();
  };
  const classes = [style.title, track.title ? "" : style.missing].join(" ");

  return (
    <div class={style.track} onClick={getHandler(track)}>
      <img src={icon} />
      <div class={style.details}>
        <div class={style.artists}>{renderArtists(track.artists || [])}</div>
        <span class={classes}>{track.title || "<no title>"}</span>
        <span class={style.length}>{toMinutes(track.lengthInSeconds)}</span>
      </div>
    </div>
  );
};

export default Tracks;
