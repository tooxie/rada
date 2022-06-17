import type { FunctionComponent } from "preact";

import { AlbumId, ArtistId, TrackId, ServerId } from "../../types";

export interface ListProps {
  serverId: ServerId;
}

export type ListComponent = FunctionComponent<ListProps>;

export interface DetailProps {
  serverId: ServerId;
  id: AlbumId | ArtistId | TrackId;
  trackId?: string;
  hidePlayButton?: boolean;
  hideNav?: boolean;
  children?: JSX.Element | JSX.Element[];
  onClick?: (ev: Event) => void;
}
