import { h, Fragment } from "preact";
import { useEffect, useState } from "preact/hooks";

import type { RegisterServerInput, RegisterServerServerInput } from "../../graphql/api";

import config from "../../config.json";
import QrCode from "../../components/qrcode/volatile";
import Modal from "../../components/modal";
import Spinner from "../../components/spinner";
import ErrorMsg from "../../components/error";
import Logger from "../../logger";

import useListInvites from "./hooks/uselist";
import useListServerInvites from "./hooks/uselistinvites";
import useCreateServerInvite from "./hooks/useinvite";
import style from "./style.css";
import Trash from "./trash";
import { cutId, tsToDate, is_invite_expired, inviteCmp } from "./utils";

const log = new Logger(__filename);

const server: RegisterServerServerInput = {
  id: config.server.id,
  name: config.server.name,
  apiUrl: config.server.api,
  idpUrl: `https://${config.idp.url}`,
  headerUrl: null, // config.header,
};

const Servers = () => {
  const [showModal, setShowModal] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const list = useListInvites();
  const pending = useListServerInvites();
  const [createServerInvite, { invite, loading, error }] = useCreateServerInvite();

  useEffect(() => {
    log.debug("Servers.useEffect([showModal])");
    if (showModal && !loading) createServerInvite();
    refetchPending();
  }, [showModal]);

  useEffect(() => {
    log.debug("Servers.useEffect([invite])");
    if (invite) {
      log.debug(invite);
      const input: RegisterServerInput = { invite, server };
      setToken(JSON.stringify(input));
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
                    {/*
                     * FIXME: If I'm currently in the server that it's being
                     * FIXME: deleted, we have to first switch back to our
                     * FIXME: default server and then do the deletion.
                     */}
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
              [...pending.invites].sort(inviteCmp).map((invite) => (
                <div class={style.server}>
                  <div class={style.col}>
                    <span>{is_invite_expired(invite) ? "Expired" : "Pending"}</span>
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

export default Servers;
