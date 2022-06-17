import { Fragment, h } from "preact";
import { useEffect } from "preact/hooks";
import { Link } from "preact-router";

import { toHref } from "../../utils/id";
import { DetailProps } from "../../components/layout/types";
import ErrorMsg from "../../components/error";
import Spinner from "../../components/spinner";
import { Artist, Track } from "../../graphql/api";
import toMinutes from "../../utils/tominutes";
import usePlayer from "../../hooks/useplayer";
import { TrackSelectionTypes } from "../../conf/types";
import useConf from "../../conf/hooks/useconf";
import Logger from "../../logger";

import useGetAlbum from "./hooks/usegetalbum";
import style from "./detail.css";

const log = new Logger(__filename);

const AlbumDetail = ({ id, trackId, serverId }: DetailProps) => {
  const { loading, error, album } = useGetAlbum(serverId, id);
  const { conf } = useConf();
  const player = usePlayer();

  useEffect(() => window.scrollTo(0, 0), []);

  if (error) return <ErrorMsg error={error} margins={true} />;
  if (!loading && !album) return <p class={style.empty}>Album not found</p>;
  if (!album) {
    return (
      <Fragment>
        <div class={style.header}>
          <div class={style.name}>
            <h1>&nbsp;</h1>
          </div>
        </div>
        <div class={style.tracklist}>
          <Spinner />
        </div>
      </Fragment>
    );
  }
  if (!album.artists) album.artists = [];

  const trackList = ((album.tracks || []) as Required<Track>[]).filter((t) => t.url);
  const getTracks = (i: number) => (i == 0 ? trackList : trackList.slice(i));
  const append = (i: number) => {
    if (trackList.length <= i) return;

    switch (conf.trackSelection) {
      case TrackSelectionTypes.AppendOne:
        player?.appendTracks([trackList[i]]);
        break;
      case TrackSelectionTypes.AppendFrom:
        player?.appendTracks(getTracks(i));
        break;
    }
  };
  const isVa = (album.artists || []).length > 1;
  const durationInSeconds = trackList.reduce((total, track) => {
    return total + (track.lengthInSeconds || 0);
  }, 0);
  const duration = toMinutes(durationInSeconds);
  log.debug(`Duration: ${durationInSeconds}s (${duration})`);
  const shouldHighlight = (id: string): Boolean => `track:${trackId}` === id;
  const noArtist = album.artists.length === 0;

  return (
    <Fragment>
      <div class={style.header}>
        <div class={style.name}>
          <h1>
            {album.name ? album.name : <span class={style.missing}>{"<no title>"}</span>}
          </h1>
        </div>
      </div>
      <div class={style.details}>
        <div class={noArtist ? style.missing : isVa ? style.va : style.artist}>
          {noArtist
            ? "<no artist>"
            : isVa
            ? "V/A"
            : album.artists.map((artist: Artist) => (
                <Link href={toHref(artist)}>{artist.name}</Link>
              ))}
          &nbsp;
        </div>
        <div class={style.year}>
          {!!album.year && `| ${album.year} `}
          {trackList.length > 0 && `| ${trackList.length} tracks | ${duration}`}
        </div>
      </div>
      <div class={style.tracklist}>
        {trackList.length === 0 && "No tracks"}
        {trackList.map((track: Required<Track>, i: number) => (
          <div
            key={track.id}
            class={`${style.track} ${shouldHighlight(track.id) ? style.highlight : ""}`}
          >
            <div class={style.ordinal}>{track.ordinal || " "}</div>
            <div class={style.stretch} onClick={() => append(i)}>
              <div class={style.title}>
                <div>
                  {track.title ? (
                    <span>{track.title}</span>
                  ) : (
                    <span class={style.missing}>{"<no title>"}</span>
                  )}
                  {track.info && <span class={style.info}>&nbsp;{track.info}</span>}
                  {track.features && (
                    <span class={style.features}>
                      &nbsp;ft. {(track.features || []).join(", ")}
                    </span>
                  )}
                </div>
                <div class={style.length}>
                  {toMinutes(track.lengthInSeconds)}
                  {isVa ? (
                    <span class={style.artists}>
                      {(track.artists || []).map((artist) => artist.name).join(", ")}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Fragment>
  );
};

export default AlbumDetail;
