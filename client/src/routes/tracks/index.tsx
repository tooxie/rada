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

  if (error) {
    log.error(error);
    return <ErrorMsg error={error} />;
  }
  if (tracks.length === 0) {
    if (loading) return <Spinner />;
    else return <div>No tracks</div>;
  }

  const sortedTracks = [...tracks].sort(byPath);
  const filterFn = (track: Track, needle: string): boolean => {
    const haystack = `${track.title} ${track.path}`;
    return haystack.toLowerCase().includes(needle.toLowerCase());
  };

  return (
    <Fragment>
      <Search
        input={sortedTracks}
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
    <div onClick={getHandler(track)}>
      <div class={style.track}>
        <img src={icon} />
        <div class={style.details}>
          <div class={style.artists}>{renderArtists(track.artists || [])}</div>
          <span class={classes}>{track.title || "<no title>"}</span>
          <span class={style.length}>{toMinutes(track.lengthInSeconds)}</span>
        </div>
      </div>
      <div class={style.path}>{track.path}</div>
    </div>
  );
};

const byPath = (t1: Track, t2: Track): -1 | 0 | 1 => {
  if (t1.path.toLowerCase() < t2.path.toLowerCase()) return -1;
  if (t1.path.toLowerCase() > t2.path.toLowerCase()) return 1;

  return 0;
};

export default Tracks;
