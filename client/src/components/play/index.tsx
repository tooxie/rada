import { h } from "preact";

import { Track } from "../../graphql/api";
import usePlayer from "../../hooks/useplayer";

interface PlayProps {
  children?: JSX.Element | JSX.Element[];
  class?: string;
  track: Required<Track>;
}

const Play = (props: PlayProps) => {
  const player = usePlayer();
  const handler = () => player?.queue.append([props.track]);

  return (
    <div onClick={handler} class={props.class}>
      {props.children}
    </div>
  );
};

export default Play;
