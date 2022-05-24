import { Fragment, h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { Link } from "preact-router";

import { DetailProps } from "../../components/layout/detail/types";
import ErrorMsg from "../../components/error";
import Spinner from "../../components/spinner";
import { Artist, Track } from "../../graphql/api";
import { AlbumId } from "../../types";
import toMinutes from "../../utils/tominutes";
import usePlayer from "../../hooks/useplayer";
import Logger from "../../logger";

import useGetAlbum from "./hooks/usegetalbum";
import style from "./detail.css";

const log = new Logger(__filename);

const AlbumDetail = ({ id, trackId }: DetailProps) => {
  const { loading, error, album } = useGetAlbum(id as AlbumId);
  const [faved, setFaved] = useState(false);
  const player = usePlayer();

  useEffect(() => window.scrollTo(0, 0), []);

  if (error) return <ErrorMsg error={error} margin={4} />;
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
  const appendFrom = (i: number) => player?.appendTracks(getTracks(i));
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
          <h1>{album.name}</h1>
        </div>
      </div>
      <div class={style.details}>
        <div class={noArtist ? style.missing : isVa ? style.va : style.artist}>
          {/* Some day we will be able to add albums to favorites... */}
          <div class={style.fav} onClick={() => setFaved(!faved)}>
            {faved ? <span>&#9825;</span> : "+"}&nbsp;
          </div>
          {noArtist
            ? "<no artist>"
            : isVa
            ? "V/A"
            : album.artists.map((artist: Artist) => (
                <Link href={"/artist/" + artist.id.split(":")[1]}>{artist.name}</Link>
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
            <div class={style.stretch} onClick={() => appendFrom(i)}>
              <div class={style.title}>
                <div>
                  {track.title ? (
                    <span>{track.title}</span>
                  ) : (
                    <span class={style.missing}>&lt;no title&gt;</span>
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
