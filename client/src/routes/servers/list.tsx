import { h, Fragment } from "preact";
import { useEffect, useState } from "preact/hooks";

import config from "../../config.json";
import QrCode from "../../components/qrcode/volatile";
import Modal from "../../components/modal";
import Spinner from "../../components/spinner";
import ErrorMsg from "../../components/error";

import useListInvites from "./hooks/uselist";
import useListServerInvites from "./hooks/uselistinvites";
import useCreateServerInvite from "./hooks/useinvite";
import style from "./style.css";
import Trash from "./trash";

const credentials = {
  id: config.server.id,
  name: config.server.name,
  apiUrl: config.server.api,
  headerUrl: null, // config.header,
  idpUrl: config.idp.url,
};

const Servers = () => {
  const [showModal, setShowModal] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const list = useListInvites();
  const pending = useListServerInvites();
  const [createServerInvite, { invite, loading, error }] = useCreateServerInvite();

  useEffect(() => {
    if (showModal && !loading) createServerInvite();
    refetchPending();
    refetchServers();
  }, [showModal]);

  useEffect(() => {
    if (invite) {
      setToken(JSON.stringify({ ...invite, ...credentials }));
      refetchPending();
    }
  }, [invite]);

  const displayModal = () => setShowModal(true);
  const dismissModal = () => setShowModal(false);
  const refetchPending = () => pending.refetch();
  const refetchServers = () => list.refetch();

  return (
    <Fragment>
      <Modal title="Server" visible={showModal} onDismiss={dismissModal}>
        <div class={style.qr}>
          {loading ? (
            <Spinner />
          ) : error ? (
            <ErrorMsg error={error} />
          ) : token ? (
            <Fragment>
              <div class={style.placeholder}>
                <QrCode value={token} width={238} />
              </div>
              <p>
                Ask your friend to go to the "Servers" tab, click "Scan invite" and scan
                this QR code.
              </p>
            </Fragment>
          ) : (
            // There is a tiny instant in which we finished loading, we set
            // the token but we have not yet re-rendered in which we fall in
            // this condition. To prevent a quick flash of emptyness we fill
            // the void with a spinner.
            <Spinner />
          )}
        </div>
      </Modal>

      <div class={style.add}>
        <a href="/servers/add">+ Scan invite</a>
        <button disabled={loading} onClick={displayModal}>
          + Create invite
        </button>
      </div>

      {list.loading || pending.loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <div class={style.servers}>
            {list.error ? (
              <ErrorMsg error={list.error} />
            ) : (
              list.servers.map((server) => (
                <div class={style.server}>
                  <div class={style.col}>
                    <span class={style.name}>{server.name}</span>
                    <span class={style.ts}>{tsToDate(server.timestamp)}</span>
                    <span class={style.id}>{cutId(server.id)}</span>
                  </div>
                  <div class={style.col}>
                    <Trash server={server} onDelete={refetchServers} />
                  </div>
                </div>
              ))
            )}
          </div>

          <div class={style.pending}>
            {pending.error ? (
              <ErrorMsg error={pending.error} />
            ) : (
              pending.invites.map((invite) => (
                <div class={style.server}>
                  <div class={style.col}>
                    <span>(Pending)</span>
                    <span class={style.ts}>{tsToDate(invite.timestamp)}</span>
                    <span class={style.id}>{cutId(invite.id)}</span>
                  </div>
                  <div class={style.col}>
                    <Trash invite={invite} onDelete={refetchPending} />
                  </div>
                </div>
              ))
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

const cutId = (id: string) => id.split("-")[0];
const tsToDate = (tsInSeconds: number) => {
  const d = new Date(tsInSeconds * 1000);
  const date = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  const time = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;

  return `${date} ${time}`;
};

export default Servers;
