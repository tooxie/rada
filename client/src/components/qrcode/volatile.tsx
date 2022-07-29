import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import QRCode from "qrcode";

import Logger from "../../logger";
import Spinner from "../spinner";

const log = new Logger(__filename);

export interface QrProps {
  value: string;
  width?: number;
}

type Data = string;
type Value = string;
let cache: [Data | null, Value | null] = [null, null];

const VolatileQrCode = ({ value, width }: QrProps) => {
  log.debug(`QrCode([str:${value.length}bytes])`);
  const [data, setData] = useState<string>();
  const [error, setError] = useState<any>();

  const store = (value: string, data: string) => {
    cache = [value, data];
    setData(data);
  };
  const valueEquals = () => value && value === cache[0];
  const dataEquals = () => data && data === cache[1];
  const getData = () => cache[1] || undefined;

  useEffect(() => {
    if (!valueEquals()) {
      const options = { width };
      QRCode.toDataURL(value, options)
        .then((data) => {
          store(value, data);
        })
        .catch((error) => {
          log.error(error);
          setError(error.message);
        });
    }

    return () => {
      if (!valueEquals()) store("", "");
    };
  }, [value]);

  if (error) return <div>ERROR: {error}</div>;

  return dataEquals() ? <img src={getData()} /> : <Spinner />;
};

export default VolatileQrCode;
