import { h } from "preact";

import Options, { Action, Title } from "../../components/options";
import useConf from "../../hooks/useconf";
import { ArtistListTypes, AlbumListTypes, TrackSelectionTypes } from "../../conf/types";

import icon from "./settings.svg";
import style from "./settings.css";

const Settings = () => {
  const { conf, setConf } = useConf();
  const updateConf = (key: string, value: any) => {
    conf[key] = value;
    setConf(conf);
  };

  return (
    <Options icon={icon}>
      <Title>Settings</Title>
      <Action noop={true}>
        <label for="search">
          Enable search:{" "}
          <input
            type="checkbox"
            id="search"
            checked={conf.searchEnabled}
            onChange={(ev) => updateConf("searchEnabled", (ev.target as any).checked)}
          />
        </label>
      </Action>
      <Action noop={true}>
        <div class={style.setting}>
          <label for="artist-list">Artist list type:</label>
          <select
            name="artist-list"
            id="artist-list"
            onChange={(ev) => updateConf("artistListType", (ev.target as any).value)}
          >
            <option
              value={ArtistListTypes.Mosaic}
              selected={conf.artistListType === ArtistListTypes.Mosaic}
            >
              Mosaic
            </option>
            <option
              value={ArtistListTypes.Thumbnails}
              selected={conf.artistListType === ArtistListTypes.Thumbnails}
            >
              Thumbnails
            </option>
            <option
              value={ArtistListTypes.List}
              selected={conf.artistListType === ArtistListTypes.List}
            >
              List
            </option>
          </select>
        </div>
      </Action>
      <Action noop={true}>
        <div class={style.setting}>
          <label for="album-list" class={style.label}>
            Album list type:
          </label>
          <select
            name="album-list"
            id="album-list"
            onChange={(ev) => updateConf("albumListType", (ev.target as any).value)}
          >
            <option
              value={AlbumListTypes.Grid}
              selected={conf.albumListType === AlbumListTypes.Grid}
            >
              Grid
            </option>
            <option
              value={AlbumListTypes.Thumbnails}
              selected={conf.albumListType === AlbumListTypes.Thumbnails}
            >
              Thumbnails
            </option>
            <option
              value={AlbumListTypes.List}
              selected={conf.albumListType === AlbumListTypes.List}
            >
              List
            </option>
          </select>
        </div>
      </Action>
      <Action noop={true}>
        <div class={style.stacked}>
          <label for="track-selection" class={style.label}>
            On track selection:
          </label>
          <select
            name="track-selection"
            id="track-selection"
            onChange={(ev) => updateConf("trackSelection", (ev.target as any).value)}
          >
            <option
              value={TrackSelectionTypes.AppendFrom}
              selected={conf.trackSelection === TrackSelectionTypes.AppendFrom}
            >
              Append from that track on
            </option>
            <option
              value={TrackSelectionTypes.AppendOne}
              selected={conf.trackSelection === TrackSelectionTypes.AppendOne}
            >
              Append only that track
            </option>
          </select>
        </div>
      </Action>
    </Options>
  );
};

export default Settings;
