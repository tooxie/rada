import { h, Fragment } from "preact";
import { useLayoutEffect, useRef } from "preact/hooks";

import toMinutes from "../../utils/tominutes";
import usePlayer from "../../hooks/useplayer";

const _Timer = () => {
  const player = usePlayer();

  return <Fragment>{toMinutes(player?.getCurrentTime())}</Fragment>;
};

interface TimerProps {
  current: number;
  total?: number | null;
  playing: boolean;
}

const Timer = ({ current, total, playing }: TimerProps) => {
  const ref = useRef<HTMLDivElement>(null);

  if (!total) return <div />;

  const render = (el: HTMLDivElement | null, time: number) => {
    if (el) el.innerText = toMinutes(time > total ? total : time);
  };

  let elapsed = current;
  useLayoutEffect(() => {
    render(ref.current, elapsed);
    if (!playing) return;

    const intervalId = setInterval(() => {
      render(ref.current, ++elapsed);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [playing]);

  return <div ref={ref} />;
};

export default Timer;
