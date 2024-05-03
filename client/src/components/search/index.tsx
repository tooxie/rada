import { h, FunctionComponent, Fragment } from "preact";
import { useEffect, useState } from "preact/hooks";

import useAppState from "../../state/hooks/useappstate";
import useConf from "../../hooks/useconf";
import Logger from "../../logger";

import style from "./style.css";
import closeIcon from "./close.svg";
import searchIcon from "./search.svg";

const log = new Logger(__filename);

interface Props {
  input: any[];
  class?: string;
  noResultsClass?: string;
  enabled: boolean;
  filter: (item: any, s: string) => boolean;
  children: (result: any[]) => JSX.Element | JSX.Element[] | string;
}

const Search: FunctionComponent<Props> = (props) => {
  log.debug(`Search.render()`);
  const { conf, setConf } = useConf();
  const { appState } = useAppState();
  const [value, setValue] = useState("");
  const clear = () => updateValue("");
  const change = (ev: Event) => updateValue((ev.target as HTMLInputElement).value);
  const updateValue = (newValue: string) => {
    if (newValue === value) return;

    const href = window.location.origin + window.location.pathname;
    const s = encodeURI(newValue.trim());
    const url = `${href}#s=${s}`;

    if (window.location.hash) {
      window.history.replaceState({}, "", url);
      setValue(newValue);
    } else {
      window.location.href = url;
    }
  };
  const filter = (items: any[]) => {
    const _value = value.trim();
    if (_value === "") return items;

    return items.filter((item) => props.filter(item, _value));
  };
  const scroll = () => {
    const shoulder = document.getElementById("shoulder");
    if (!shoulder) return;
    const shoulderY = shoulder.getBoundingClientRect()["y"];
    const bodyY = document.body.getBoundingClientRect()["y"];
    const annoyingBrowserOffset = appState.isSafari ? 6 : 0; // Sigh...
    const offset = Math.abs(shoulderY - bodyY) - annoyingBrowserOffset;

    if (offset !== window.pageYOffset - annoyingBrowserOffset) {
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  };
  const handleEnter = (ev: KeyboardEvent) => {
    const input = ev.target as HTMLInputElement;
    if (ev.key === "Enter" || ev.keyCode === 13) {
      input.blur();
    }
  };

  log.debug(`Got ${props.input.length} items`);

  const hashChange = () => {
    const searchString = location.hash.substring(3);
    console.log(`${location.hash} -> ${searchString}`);
    setValue(searchString);
  };

  useEffect(() => {
    window.addEventListener("hashchange", hashChange, false);
    return () => window.removeEventListener("hashchange", hashChange, false);
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.indexOf("#s=") !== 0) return;

    if (!conf.searchEnabled) {
      conf.searchEnabled = true;
      setConf(conf);
    }

    const s = hash.substring(3);
    setValue(decodeURI(s));
  }, []);

  if (!props.enabled) {
    return <div class={props.class}>{props.children(props.input)}</div>;
  }

  const results = filter(props.input);

  return (
    <Fragment>
      <div class={style.search}>
        <input
          type="text"
          class={style.input}
          style={{ backgroundImage: `url(${searchIcon})` }}
          value={value}
          onChange={change}
          onFocus={scroll}
          onKeyUp={handleEnter}
        />
        <img src={closeIcon} class={style.close} onClick={clear} />
      </div>

      {results.length === 0 ? (
        <div class={props.noResultsClass}>No results</div>
      ) : props.class ? (
        <div class={props.class}>{props.children(results)}</div>
      ) : (
        <Fragment>{props.children(results)}</Fragment>
      )}
    </Fragment>
  );
};

export default Search;
