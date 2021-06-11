import { Fragment, h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { Link, route } from "preact-router";

import { DetailProps } from "../../components/layout/detail/types";
import Spinner from "../../components/spinner";
import { Artist, Album, Track } from "../../graphql/api";
import { AlbumId } from "../../types";
import toMinutes from "../../utils/tominutes";

import useGetAlbum from "./hooks/usegetalbum";
import style from "./detail.css";
import AlbumOptions from "./albumoptions";
import TrackOptions from "./trackoptions";
import usePlayer from "../../hooks/useplayer";

let _album: Album | null = null;

const AlbumDetail = ({ id, trackId }: DetailProps) => {
  const { loading, error, album } = useGetAlbum(id as AlbumId);
  const [faved, setFaved] = useState(false);
  const player = usePlayer();

  useEffect(() => window.scrollTo(0, 0), []);

  if (id !== _album?.id) _album = null;
  if (!loading && album) _album = album;

  if (error) return <p class={style.empty}>{error.message}</p>;
  if (!loading && !album) return <p class={style.empty}>Album not found</p>;
  if (!_album) {
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

  const trackList = ((_album.tracks || []) as Required<Track>[]).filter((t) => t.url);
  const getTracks = (i: number) => (i == 0 ? trackList : trackList.slice(i));
  const appendFrom = (i: number) => {
    if (!player) return;
    player.appendTracks(getTracks(i));
    route("/queue");
  };
  const isVa = (_album.artists || []).length > 1;
  const durationInSeconds = trackList.reduce((total, track) => {
    return total + (track.lengthInSeconds || 0);
  }, 0);
  const duration = toMinutes(durationInSeconds);
  console.log(`[albums/detail.tsx] Duration: ${durationInSeconds}s (${duration})`);
  const shouldHighlight = (id: string): Boolean => `track:${trackId}` === id;

  return (
    <Fragment>
      <div class={style.header}>
        <div class={style.name}>
          <h1>{_album.name}</h1>
        </div>
        <AlbumOptions />
      </div>
      <div class={style.details}>
        {/* Some day we will be able to add albums to favorites... */}
        <div class={style.fav} onClick={() => setFaved(!faved)}>
          {faved ? <span>&#9825;</span> : <span>+</span>}&nbsp;
        </div>
        {isVa ? (
          <div class={style.va}>V/A&nbsp;</div>
        ) : (
          <div class={style.artist}>
            {(_album.artists || []).map((artist: Artist) => (
              <Link href={"/artist/" + artist.id.split(":")[1]}>{artist.name}</Link>
            ))}
            &nbsp;
          </div>
        )}
        {!!_album.year && <div class={style.year}>|&nbsp;{_album.year}&nbsp;</div>}
        <div class={style.duration}>
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
                {track.title ? (
                  <div>{track.title}</div>
                ) : (
                  <div class={style.missing}>&lt;no title&gt;</div>
                )}
                <div class={style.length}>
                  {toMinutes(track.lengthInSeconds)}
                  {isVa ? (
                    <span class={style.artists}>
                      {(track.artists || []).map((artist) => artist.name).join(", ")}
                    </span>
                  ) : null}
                  {track.features ? (
                    <span class={style.features}>
                      &nbsp;ft. {(track.features || []).join(", ")}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
            <TrackOptions />
          </div>
        ))}
      </div>
    </Fragment>
  );
};

export default AlbumDetail;
