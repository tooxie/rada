const nillId = "00000000-0000-0000-0000-000000000000";

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

export { toDbId, urlize, nillId, getNillId };
