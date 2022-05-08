import { h } from "preact";
import { useRef } from "preact/hooks";
// import { useEffect, useLayoutEffect, useRef, useState } from "preact/hooks";

// import Logger from "../../logger";

import playIcon from "./play-big.svg";
import wifiIcon from "./wifi.svg";
import pauseIcon from "./pause.svg";
import style from "./vinyl.css";
// import arm from "./arm.png"; // https://www.pngkit.com/view/u2q8o0r5o0w7i1e6_vinyl-record-player-arm/

// const log = new Logger(__filename);

interface ProgressProps {
  isPlaying: boolean;
  isLoading: boolean;
  totalTime?: number;
  currentTime?: number;
  onPlay: () => void;
  onPause: () => void;
}

// type ElementWidth = `${number}px`;
// type ElementPosition = { top: `${number}px`; left: `${number}px` };

const Progress = (props: ProgressProps) => {
  // const [armWidth, setArmWidth] = useState<ElementWidth>();
  // const [armPos, setArmPos] = useState<ElementPosition>();
  // const [armRot, setArmRot] = useState<number>(-14);
  // const [armClasses, setArmClasses] = useState<string[]>();

  // const imgRef = useRef<HTMLImageElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);

  const icon = props.isLoading ? wifiIcon : props.isPlaying ? pauseIcon : playIcon;
  // const isIdle = !props.isLoading && !props.isPlaying && props.currentTime === 0;
  // const firstLoad = props.isLoading && !props.isPlaying && props.currentTime === 0;
  // const remaining = (props.totalTime || 0) - (props.currentTime || 0);
  // const transition = props.isPlaying ? `${remaining}s linear` : "0.25s ease";
  const toggle = (ev: Event) => {
    ev.stopPropagation();
    if (props.isPlaying) props.onPause();
    else props.onPlay();
  };

  // let classes: string[] = [style.arm];
  // if (isIdle) classes.push(style.idle);
  // if (firstLoad) classes.push(style.loading);
  // if (!isIdle && props.isPlaying) classes.push(style.playing);

  // useEffect(() => setArmClasses(classes), [props.isPlaying, props.isLoading]);
  // useEffect(() => {
  //   if (!wrapper.current || !imgRef.current) return;
  //   const div = wrapper.current.getBoundingClientRect();
  //   const arm = imgRef.current.getBoundingClientRect();
  //   log.debug("div", div);
  //   log.debug("arm", arm);

  //   setArmWidth(`${div.width / 2}px`);
  //   setArmPos({
  //     top: `${div.top + (div.height - arm.height)}px`,
  //     left: `${div.left - arm.width / 4}px`,
  //   });
  //   setArmClasses(classes);
  // }, []);

  // TODO: When the status of `playing` changes we have to force the needle
  // to the correct position.
  // useLayoutEffect(() => {
  //   if (!imgRef.current || isIdle) return;

  //   if (props.isPlaying) {
  //     if (!props.currentTime || !props.totalTime) return;
  //     // This is the difference in degrees between the "loading" and the
  //     // "playing" states, taken from the CSS file.
  //     const delta = 24;

  //     const progress = (props.currentTime * 100) / props.totalTime;
  //     const current = (progress * delta) / 100;
  //     console.log(current);
  //     console.log(`rotate(${-12 + current}deg)`);
  //     setArmRot(-12 + current);
  //   } else if (!props.isLoading) {
  //     const computedStyle = window.getComputedStyle(imgRef.current);
  //     const transform = computedStyle.getPropertyValue("transform");
  //     imgRef.current.style.transform = transform;
  //   }
  // }, [props.isPlaying]);
  // const armStyle = {
  //   ...armPos,
  //   transition,
  //   width: armWidth,
  //   transform: `rotate(${armRot}deg)`,
  // };
  const noop = (ev: Event) => ev.stopPropagation();

  return (
    <section class={style.vinyl} onClick={noop}>
      <div class={style.border} ref={wrapper}>
        <div class={style.controls}>
          <img src={icon} onClick={toggle} />
        </div>
      </div>
      {/*
      <img
        src={arm}
        ref={imgRef}
        style={armStyle}
        class={armClasses ? armClasses.join(" ") : style.arm}
      />
      */}
    </section>
  );
};

export default Progress;
