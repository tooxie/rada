import { useState, useCallback } from "preact/hooks";

import type { Conf, ConfHook } from "../types";

import Logger from "../../logger";

import { getDefaultConf } from "../context";

const log = new Logger(__filename);

const useConf = (): ConfHook => {
  const [conf, setConf] = useState<Conf>(getDefaultConf());
  const customSetter = useCallback(
    (newConf: Conf) => {
      const serializedConf = JSON.stringify(newConf);
      log.warn(`localStorage.setItem("GawshiConf", ${serializedConf})`);
      localStorage.setItem("GawshiConf", serializedConf);
      setConf({ ...newConf });
    },
    []
  );

  return { conf, setConf: customSetter };
};

export default useConf;
