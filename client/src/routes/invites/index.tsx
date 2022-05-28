import { h, Fragment } from "preact";
import { route } from "preact-router";

import QrCode from "../../components/qrcode";
import ErrorMsg from "../../components/error";
import Spinner from "../../components/spinner";
import useConf from "../../conf/hooks/useconf";

import useListInvites from "./hooks/uselist";
import useCreateInvite from "./hooks/usecreate";
import style from "./style.css";

const InviteList = () => {
  let validity: HTMLInputElement | null;
  let note: HTMLInputElement | null;

  const { conf } = useConf();
  const { loading, error, invites } = useListInvites();
  const [createInvite, { claimUrl, loading: creating }] = useCreateInvite();

  if (!conf.isAdmin) route("/404");

  if (error) return <ErrorMsg error={error} />;
  if (loading) <Spinner />;

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

  return (
    <Fragment>
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
        <h2 class={style.heading}>Create invitation</h2>
        <div class={`${style.input} ${style.admin}`}>
          <label for="invite-admin">
            <input type="checkbox" id="invite-admin" />
            Admin user?
          </label>
          <div class={style.details}>An admin user can invite other people too</div>
        </div>

        <div class={`${style.input} ${style.validity}`}>
          <label for="invite-validity">
            Valid for
            <input
              type="number"
              id="invite-validity"
              value="24"
              ref={(node) => (validity = node)}
            />
            hours
          </label>
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
            Add a note just for yourself, to keep a reference of who you sent invites to.
            Will not be seen by the user.
          </div>
        </div>
        {claimUrl ? (
          <Fragment>
            <div class={style.qrcode}>
              <QrCode value={`${window.location.origin}${claimUrl}`} />
            </div>
            <p class={style.url}>
              Note:
              <ul>
                <li>Do not lose this link nor open it yourself. It's a 1-time link.</li>
                <li>If you reload or navigate away you will lose the code.</li>
              </ul>
            </p>
          </Fragment>
        ) : (
          <button
            disabled={creating}
            onClick={() => {
              createInvite({
                note: note?.value || "",
                validity: parseInt(validity?.value || "") || null,
              });
            }}
          >
            {creating ? "Creating..." : "Create invitation"}
          </button>
        )}
      </section>
    </Fragment>
  );
};

export default InviteList;
