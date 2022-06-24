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

let cachedData: string;

const CachedQrCode = ({ value, width }: QrProps) => {
  log.debug(`QrCode("${value}")`);
  const [data, setData] = useState<string>();
  const [error, setError] = useState<any>();

  useEffect(() => {
    log.debug("QrCode.useEffect()");
    if (!cachedData) {
      const options = { width };
      QRCode.toDataURL(value, options)
        .then((data) => {
          setData(data);
        })
        .catch((error) => {
          log.error(error);
          setError(error.message);
        });
    }
  }, [value]);

  useEffect(() => {
    if (data) cachedData = data;
  }, [data]);

  if (error) return <div>ERROR: {error}</div>;

  const _data = cachedData || data;
  return _data ? <img src={_data} /> : <Spinner />;
};

export default CachedQrCode;
