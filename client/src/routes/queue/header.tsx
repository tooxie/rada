import { h } from "preact";

import useGetAlbum from "../albums/hooks/usegetalbum";
import { AlbumId } from "../../types";

interface HeaderProps {
  albumId: AlbumId;
}

const Header = ({ albumId }: HeaderProps) => {
  const { loading, error, album } = useGetAlbum(albumId);

  if (loading || error || !album) {
    return <div />;
  }

  return <div>Head</div>;
};

export default Header;
