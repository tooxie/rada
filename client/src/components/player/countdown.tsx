import { h } from "preact";

import toMinutes from "../../utils/tominutes";
import usePlayer from "../../hooks/useplayer";
import { useEffect, useLayoutEffect, useRef } from "preact/hooks";

const _Countdown = () => {
  const player = usePlayer();
  if (!player) return <div />;

  const total = player.getCurrentTrack()?.lengthInSeconds;
  const elapsed = player.getCurrentTime();
  if (!total) return <div>{toMinutes(elapsed)}</div>;
  if (elapsed > total) return <div>0:00</div>;

  return <div>{toMinutes(total - elapsed)}</div>;
};

interface CountdownProps {
  current: number;
  total?: number | null;
  playing: boolean;
}

const Countdown = ({ current, total, playing }: CountdownProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const render = (el: HTMLDivElement | null, time: number) => {
    if (el) el.innerText = toMinutes(time > 0 ? time : 0);
  };

  if (!total) return <div />;

  let remaining = total - current;
  useLayoutEffect(() => {
    render(ref.current, remaining);
    if (!playing) return;

    const intervalId = setInterval(() => {
      remaining -= 1;
      if (remaining < 0) remaining = 0;
      render(ref.current, remaining);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [playing]);

  return <div ref={ref} />;
};

export default Countdown;
