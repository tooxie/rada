import { h } from "preact";

import toMinutes from "../../utils/tominutes";
import { useLayoutEffect, useRef } from "preact/hooks";

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

  if (!total) return null;

  let remaining = total - current;
  useLayoutEffect(() => {
    render(ref.current, remaining);
    if (!playing) return;

    const intervalId = setInterval(() => {
      render(ref.current, --remaining);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [playing]);

  return <div ref={ref} />;
};

export default Countdown;
