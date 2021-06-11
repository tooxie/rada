import { useState } from "preact/hooks";

import { Conf, ConfHook } from "../types";
import { getDefaultConf } from "../context";

const useConf = (): ConfHook => {
  const [conf, setConf] = useState<Conf>(getDefaultConf());
  const customSetter = (newConf: Conf) => {
    localStorage.setItem("GawshiConf", JSON.stringify(newConf));
    setConf({ ...newConf });
  };

  return { conf, setConf: customSetter };
};

export default useConf;
