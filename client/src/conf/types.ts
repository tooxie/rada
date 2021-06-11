export interface Conf {
  searchEnabled: boolean;
  isAdmin?: boolean;
}

export interface ConfHook {
  conf: Conf;
  setConf: (c: Conf) => void;
}
