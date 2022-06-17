import { h, Fragment } from "preact";
import { route } from "preact-router";
import { useEffect, useRef, useState } from "preact/hooks";
import QrScanner from "qr-scanner";

import ErrorMsg from "../../components/error";
import Modal from "../../components/modal";
import Spinner from "../../components/spinner";
import Logger from "../../logger";

import style from "./add.css";
import camera from "./camera.svg";

const log = new Logger(__filename);
const DEFAULT_HEADER = "/assets/img/bg-header.jpg";

interface ServerData {
  id: string;
  api: string;
  name: string;
  header: string;
}

const ServerAdd = () => {
  const ref = useRef<HTMLVideoElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [scanner, setScanner] = useState<QrScanner>();
  const [result, setResult] = useState<ServerData | null>();
  const [error, setError] = useState<string | null>();
  const backgroundImage = `url(${result?.header || DEFAULT_HEADER})`;

  useEffect(() => {
    const detected = (result: QrScanner.ScanResult) => {
      log.debug(`${result.data} (${typeof result.data})`);

      try {
        setResult(JSON.parse(result.data));
      } catch (e) {
        log.error(e);
        setError("Error decoding QR");
      }
    };

    if (ref.current) {
      setScanner(
        new QrScanner(ref.current, detected, { returnDetailedScanResult: true })
      );
    }
  }, [ref]);

  useEffect(() => {
    scanner?.start();

    return () => {
      scanner?.stop();
      ref.current?.pause();
    };
  }, [scanner]);

  useEffect(() => {
    if (result) {
      log.debug(`Scan result: ${JSON.stringify(result)}`);
      scanner?.stop();
      ref.current?.pause();
      setShowModal(true);
    }

    return () => setShowModal(false);
  }, [result]);

  useEffect(() => {
    if (!showModal && result) {
      setTimeout(() => route("/servers"), 250);
    }
  }, [showModal]);

  if (error) return <ErrorMsg error={error} />;

  return (
    <Fragment>
      <Modal visible={showModal} onDismiss={() => setShowModal(false)}>
        <div class={style.result}>
          <div class={style.heading}>
            <div class={style.header} style={{ backgroundImage }}>
              &nbsp;
            </div>
            <div class={style.name}>Add Server "{result?.name}"</div>
          </div>
          <div class={style.confirm}>
            <button>Confirm</button>
          </div>
          <div class={style.cancel}>
            <span class={style.cancel}>Cancel</span>
          </div>
        </div>
      </Modal>

      {result ? (
        <Spinner />
      ) : (
        <div class={style.scanner}>
          <div class={style.stream} style={{ backgroundImage: `url(${camera})` }}>
            <video ref={ref}></video>
          </div>
          <div class={style.instructions}>
            Scan the QR code under the "Servers" tab in your friend's app.
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default ServerAdd;
