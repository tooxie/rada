import { createContext } from "preact";

import { Conf, ConfHook } from "./types";

const defaultConf = {
  searchEnabled: false,
};

export const getDefaultConf = (): Conf => {
  const persisted = localStorage.getItem("GawshiConf");
  if (persisted) return JSON.parse(persisted) as Conf;

  return defaultConf;
};

const ConfContext = createContext<ConfHook>({
  conf: defaultConf,
  setConf: () => {},
});

export default ConfContext;
