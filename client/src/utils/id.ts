import { Album, Artist, Track } from "../graphql/api";

const nillId = "00000000-0000-0000-0000-000000000000";

const toHref = (entity?: Album | Artist | Track | null) => {
  if (!entity) return "";

  const serverId = entity.serverId;
  const name = entity.__typename.toLowerCase();
  const id = urlize(entity.id);

  let path: string;
  if (name === "track") {
    const track = entity as Track;
    const albumId = urlize(track.album?.id);
    const trackId = urlize(track.id);

    path = `/album/${albumId}/track/${trackId}`;
  } else {
    path = `/${name}/${id}`;
  }

  return `/server/${serverId}${path}`;
};

const urlize = (id?: string): string => {
  if (!id) return "";
  if (id.indexOf(":") < 0) {
    throw new Error(`Invalid ID "${id}"`);
  }

  return id.split(":")[1];
};

const toDbId = (entity: string, id?: string): string => {
  const _entity = entity.toLowerCase();

  if (id) {
    if (id.includes(":") && !id.startsWith(`${_entity}:`)) {
      throw new Error(`Invalid ID ${id} for entity "${_entity}"`);
    }
    if (id.startsWith(`${_entity}:`)) {
      return id;
    }
  }

  return `${_entity}:${id || nillId}`;
};

const getNillId = (entity: string) => `${entity}:${nillId}`;

export { toDbId, urlize, nillId, getNillId, toHref };
