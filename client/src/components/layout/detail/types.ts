import { AlbumId, ArtistId, TrackId } from "../../../types";

export interface DetailProps {
  id: AlbumId | ArtistId | TrackId;
  trackId?: string;
  hidePlayButton?: boolean;
  children?: JSX.Element | JSX.Element[];
}
