import { h, Fragment } from "preact";
import { useEffect, useState } from "preact/hooks";

import useConf from "../../hooks/useconf";
import Logger from "../../logger";

import style from "./style.css";
import closeIcon from "./close.svg";
import searchIcon from "./search.svg";

const log = new Logger(__filename);

interface SearchProps {
  input: any[];
  class?: string;
  noResultsClass?: string;
  enabled: boolean;
  filter: (item: any, s: string) => boolean;
  children: (result: any[]) => JSX.Element | JSX.Element[] | string;
}

const Search = (props: SearchProps) => {
  log.debug(`Search.render()`);
  const { conf, setConf } = useConf();
  const [value, setValue] = useState("");
  const clear = () => updateValue("");
  const change = (ev: Event) => updateValue((ev.target as HTMLInputElement).value);
  const updateValue = (newValue: string) => {
    if (newValue === value) return;

    const href = window.location.href.split("#")[0];
    const s = encodeURI(newValue.trim());

    window.location.href = s ? `${href}#s=${s}` : `${href}#`;
    setValue(newValue);
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
    var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const annoyingBrowserOffset = isSafari ? 6 : 0; // Sigh...
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
