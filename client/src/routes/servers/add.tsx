import { h, Fragment } from "preact";
import { route } from "preact-router";
import { useEffect, useRef, useState } from "preact/hooks";
import QrScanner from "qr-scanner";

import type { RegisterServerInput } from "../../graphql/api";

import ErrorMsg from "../../components/error";
import Modal from "../../components/modal";
import Spinner from "../../components/spinner";
import Logger from "../../logger";

import useRegisterServer from "./hooks/useregisterserver";
import style from "./add.css";
import camera from "./camera.svg";

const log = new Logger(__filename);
const DEFAULT_HEADER = "/assets/img/bg-header.jpg";

const ServerAdd = () => {
  const ref = useRef<HTMLVideoElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [scanner, setScanner] = useState<QrScanner>();
  const [result, setResult] = useState<RegisterServerInput | null>();
  const [qrError, setQrError] = useState<string | null>();
  const [registerServer, _] = useRegisterServer();
  const backgroundImage = `url(${result?.server.headerUrl || DEFAULT_HEADER})`;

  useEffect(() => {
    console.log("V2");
    const detected = (result: QrScanner.ScanResult) => {
      log.debug(`${result.data} (${typeof result.data})`);

      try {
        setResult(JSON.parse(result.data));
      } catch (e) {
        log.error(e);
        setQrError("Error decoding QR");
      }
    };

    if (ref.current) {
      setScanner(
        new QrScanner(ref.current, detected, {
          returnDetailedScanResult: true,
          preferredCamera: "environment",
          highlightScanRegion: true,
          highlightCodeOutline: true,
          maxScansPerSecond: 5,
          calculateScanRegion: (video: HTMLVideoElement) => {
            const smallestDimension = Math.min(video.videoWidth, video.videoHeight);
            const scanRegionSize = Math.round(smallestDimension * 0.6);

            return {
              x: Math.round((video.videoWidth - scanRegionSize) / 2),
              y: Math.round((video.videoHeight - scanRegionSize) / 2),
              width: scanRegionSize,
              height: scanRegionSize,
            };
          },
          constraints: {
            video: {
              facingMode: "environment",
              focusMode: "continuous",
              advanced: [{ focusMode: "continuous" }]
            }
          }
        } as any)
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
      log.debug("Scan result:", result);
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

  if (qrError) return <ErrorMsg error={qrError} />;

  const confirmServer = () => registerServer({ input: result });

  return (
    <Fragment>
      <Modal visible={showModal} onDismiss={() => setShowModal(false)}>
        <div class={style.result}>
          <div class={style.heading}>
            <div class={style.header} style={{ backgroundImage }}>
              &nbsp;
            </div>
            <div class={style.name}>Add Server "{result?.server.name}"</div>
          </div>
          <div class={style.confirm}>
            <button onClick={confirmServer}>Confirm</button>
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
