import { ComponentChildren, Fragment, h } from "preact";

import style from "./style.css";
import playIcon from "./play.svg";
import { useState } from "preact/hooks";

const Install = () => {
  return (
    <Fragment>
      <H1>Please install the app</H1>
      <P>Also known as "Add to Home Screen" in some browsers.</P>
      <H2>Instructions</H2>
      <P>How you achieve this will depend on which browser you are using:</P>

      <Collapsible title="Chrome">
        <ol>
          <li>
            <P>Click on the options button:</P>
            <img src="/assets/img/install/chrome-step-1.jpg" />
          </li>
          <li>
            <P>Select "Install app":</P>
            <img src="/assets/img/install/chrome-step-2.jpg" />
          </li>
          <li>
            <P>Finish the installation:</P>
            <img src="/assets/img/install/chrome-step-3.jpg" />
          </li>
        </ol>
      </Collapsible>
      <Collapsible title="Safari">
        <ol>
          <li>
            <P>Click on the options button:</P>
            <img src="/assets/img/install/safari-step-1.png" />
          </li>
          <li>
            <P>Select "Add to Home Screen":</P>
            <img src="/assets/img/install/safari-step-2.png" />
          </li>
          <li>
            <P>Finish the installation:</P>
            <img src="/assets/img/install/safari-step-3.png" />
          </li>
        </ol>
      </Collapsible>
      <H2>Done!</H2>
      <P>Now you will see the app installed next to all your other apps.</P>
    </Fragment>
  );
};

interface CollapsibleProps {
  title: string;
  children: ComponentChildren;
}

const Collapsible = ({ title, children }: CollapsibleProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div class={isOpen ? style.open : style.closed}>
      <div class={style.title} onClick={() => setIsOpen(!isOpen)}>
        <div class={style.icon}>
          <img src={playIcon} />
        </div>
        {title}
      </div>
      <div class={style.children}>{children}</div>
    </div>
  );
};

interface ElProps {
  children: string;
}

const P = ({ children }: ElProps) => <p class={style.p}>{children}</p>;

const H1 = ({ children }: ElProps) => <h1 class={style.h1}>{children}</h1>;

const H2 = ({ children }: ElProps) => <h2 class={style.h2}>{children}</h2>;

const H3 = ({ children }: ElProps) => <h3 class={style.h3}>{children}</h3>;

export const appInstalled = () => {
  /* develblock:start */
  return true;
  /* develblock:end */
  const mqStandalone = "(display-mode: standalone)";
  const isStandalone = navigator.standalone || window.matchMedia(mqStandalone).matches;

  return !!isStandalone;
};

export default Install;
