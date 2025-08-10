import type { ServerInvite } from "../../graphql/api";

export const is_invite_expired = (invite: ServerInvite) => {
  const now = new Date();
  const then = new Date(invite.timestamp * 1000);
  const diff_in_seconds = Math.round((now.getTime() - then.getTime()) / 1000);
  const ONE_HOUR_IN_SECONDS = 60 * 60;

  return diff_in_seconds > ONE_HOUR_IN_SECONDS;
};

export const cutId = (id: string): string => id.split("-")[0];
export const tsToDate = (tsInSeconds: number) => {
  const d = new Date(tsInSeconds * 1000);
  const date = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  const time = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;

  return `${date} ${time}`;
};

export const inviteCmp = (i1: ServerInvite, i2: ServerInvite): -1 | 0 | 1 => {
  if (i1.timestamp < i2.timestamp) return 1;
  if (i1.timestamp > i2.timestamp) return -1;

  return 0;
};
