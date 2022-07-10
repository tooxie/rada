import { h, Fragment } from "preact";
import { useEffect, useState } from "preact/hooks";
import { route } from "preact-router";

import QrCode from "../../components/qrcode/volatile";
import ErrorMsg from "../../components/error";
import Spinner from "../../components/spinner";
import useAppState from "../../hooks/useappstate";
import Modal from "../../components/modal";
import Logger from "../../logger";

import useListInvites from "./hooks/uselist";
import useCreateInvite from "./hooks/usecreate";
import style from "./style.css";

const log = new Logger(__filename);

const InviteList = () => {
  let note: HTMLInputElement | null;
  let adminCheck: HTMLInputElement | null;

  const [showModal, setShowModal] = useState(false);
  const { appState } = useAppState();
  const { loading, error, invites } = useListInvites();
  const [createInvite, { claimUrl, loading: creating, error: errorCreating }] =
    useCreateInvite();

  if (!appState.isAdmin) route("/404");

  if (error) return <ErrorMsg error={error} />;
  if (loading) return <Spinner />;

  const stats = invites.reduce(
    (acc, invite) => {
      acc.claimed += Number(!!invite.visited);
      acc.installed += Number(!!invite.visited);
      acc.unsolicited += Number(!!invite.unsolicited);

      return acc;
    },
    {
      total: invites.length,
      claimed: 0,
      installed: 0,
      unsolicited: 0,
    }
  );
  const capitalize = (s: string) => s.substring(0, 1).toUpperCase() + s.substring(1);
  const displayModal = () => setShowModal(true);
  const dismissModal = () => setShowModal(false);

  useEffect(() => {
    if (showModal) {
      createInvite({
        note: note?.value || "",
        isAdmin: Boolean(adminCheck?.checked),
      });
    }
  }, [showModal]);

  const [qrCode, setQrCode] = useState<JSX.Element | null>(null);
  useEffect(() => {
    if (claimUrl) {
      log.debug(claimUrl);
      setQrCode(<QrCode value={claimUrl} width={238} />);
    }

    return () => setQrCode(null);
  }, [claimUrl]);

  return (
    <Fragment>
      <Modal title="Invitation" visible={showModal} onDismiss={dismissModal}>
        <div class={style.invitation}>
          {errorCreating ? (
            <ErrorMsg error={errorCreating} />
          ) : (
            <Fragment>
              <div class={style.qrcode}>{qrCode || <Spinner />}</div>
              <p class={style.disclaimer}>
                Remember: The owner of the AWS account will have to pay for all the
                resources consumed by each new friend invited to the app.
              </p>
            </Fragment>
          )}
        </div>
      </Modal>

      <h1 class={style.heading}>Invitations</h1>
      <section class={style.invites}>
        {Object.keys(stats).map((key) => {
          return (
            <div class={style.stat}>
              <div class={style.number}>{(stats as any)[key]}</div>
              <div class={style.name}>{capitalize(key)}</div>
            </div>
          );
        })}
      </section>
      <section class={style.create}>
        <h2 class={style.heading}>Invite a friend</h2>
        <div class={`${style.input} ${style.admin}`}>
          <label for="invite-admin">
            <input
              type="checkbox"
              id="invite-admin"
              ref={(node) => (adminCheck = node)}
            />
            Admin?
          </label>
          <div class={style.details}>An admin can invite other people too.</div>
        </div>

        <div class={`${style.input} ${style.note}`}>
          <label for="invite-note">
            <div class={style.note}>Note:</div>
            <input
              type="text"
              id="invite-note"
              class={style.text}
              ref={(node) => (note = node)}
            />
          </label>
          <div class={style.details}>
            Add a note for yourself about who is this for. It will be seen by other admins
            only, but nobody else.
          </div>
        </div>
        <button disabled={creating} onClick={displayModal}>
          {creating ? "Creating..." : "Create invitation"}
        </button>
      </section>
    </Fragment>
  );
};

export default InviteList;
