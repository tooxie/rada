import { useState } from "preact/hooks";

import { Conf, ConfHook } from "../types";
import { getDefaultConf } from "../context";
import Logger from "../../logger";

const log = new Logger(__filename);

const useConf = (): ConfHook => {
  const [conf, setConf] = useState<Conf>(getDefaultConf());
  const customSetter = (newConf: Conf) => {
    const serializedConf = JSON.stringify(newConf);
    log.warn(`localStorage.setItem("GawshiConf", ${serializedConf})`);
    localStorage.setItem("GawshiConf", serializedConf);
    setConf({ ...newConf });
  };

  return { conf, setConf: customSetter };
};

export default useConf;
