import { h } from "preact";
import { useState, useEffect } from "preact/hooks";

import Spinner from "../spinner";

import style from "./style.css";

const Splash = () => {
  const [fontReady, setFontReady] = useState(false);
  const [bgReady, setBgReady] = useState(false);
  const [ready, setReady] = useState(false);
  const [destroy, setDestroy] = useState(false);

  useEffect(() => {
    setReady(fontReady && bgReady);
  }, [fontReady, bgReady]);

  useEffect(() => {
    if (ready) setTimeout(() => setDestroy(true), 250);
  }, [ready]);

  useEffect(() => {
    const bg = document.createElement("img");
    bg.src = "/assets/img/bg-header.jpg";
    bg.addEventListener("load", () => setBgReady(true));
    document.fonts.onloadingdone = () => setFontReady(true);
    document.fonts.ready.then(() => setFontReady(true));
  });

  const classes = [
    style.splash,
    ready ? style.hidden : "",
    destroy ? style.destroy : "",
  ].join(" ");

  return (
    <div class={classes}>
      <Spinner message=" " />
    </div>
  );
};

export default Splash;
