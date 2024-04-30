import { h, Fragment } from "preact";
import { useEffect, useState } from "preact/hooks";

import QrCode from "../../components/qrcode/volatile";
import ErrorMsg from "../../components/error";
import Spinner from "../../components/spinner";
import Modal from "../../components/modal";
import Logger from "../../logger";
import type { ListProps } from "../../components/layout/types";

import useListInvites from "./hooks/uselist";
import useCreateInvite from "./hooks/useinvite";
import style from "./style.css";

const log = new Logger(__filename);

const InviteList = ({ serverId }: ListProps) => {
  let note: HTMLInputElement | null;
  let adminCheck: HTMLInputElement | null;

  const [showModal, setShowModal] = useState(false);
  const list = useListInvites(serverId);
  const [createInvite, { claimUrl, loading, error }] = useCreateInvite();

  if (list.error) return <ErrorMsg error={list.error} />;
  if (list.loading) return <Spinner />;

  const stats = list.invites.reduce(
    (acc, invite) => {
      acc.claimed += Number(!!invite.visited);
      acc.installed += Number(!!invite.visited);
      acc.unsolicited += Number(!!invite.unsolicited);

      return acc;
    },
    {
      total: list.invites.length,
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
    } else {
      // Unset the QR code as soon as the modal disappears, otherwise the
      // spinner will show for a quarter of a second.
      setTimeout(() => setQrCode(null), 250);
    }
  }, [showModal]);

  const [qrCode, setQrCode] = useState<JSX.Element | null>(null);
  useEffect(() => {
    if (claimUrl) {
      log.debug(claimUrl);
      setQrCode(<QrCode value={claimUrl} width={238} />);
      list.refetch();
    }

    return () => setQrCode(null);
  }, [claimUrl]);

  return (
    <Fragment>
      <Modal title="Invitation" visible={showModal} onDismiss={dismissModal}>
        <div class={style.invitation}>
          {error ? (
            <ErrorMsg error={error} />
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
        <button disabled={loading} onClick={displayModal}>
          {loading ? "Creating..." : "Create invitation"}
        </button>
      </section>
    </Fragment>
  );
};

export default InviteList;
