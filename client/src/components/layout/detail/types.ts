import { AlbumId, ArtistId, TrackId } from "../../../types";

export interface DetailProps {
  id: AlbumId | ArtistId | TrackId;
  trackId?: string;
  hidePlayButton?: boolean;
  hideNav?: boolean;
  children?: JSX.Element | JSX.Element[];
  onClick?: (ev: Event) => void;
}
