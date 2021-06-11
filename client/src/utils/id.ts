const urlize = (id?: string): string => {
  if (!id) return "";
  if (id.indexOf(":") < 0) {
    throw new Error(`Invalid ID "${id}"`);
  }

  return id.split(":")[1];
};

const toDbId = (entity: string, id: string): string => {
  const _entity = entity.toLowerCase();

  if (!id) throw new Error(`No ID provided for entity "${_entity}"`);
  if (id.includes(":") && !id.startsWith(`${_entity}:`)) {
    throw new Error(`Invalid ID ${id} for entity "${_entity}"`);
  }

  if (id.includes(":") && id.startsWith(`${_entity}:`)) return id;

  return `${_entity}:${id}`;
};

const getNilId = (entity: string) => `${entity}:00000000-0000-0000-0000-000000000000`;

export { toDbId, urlize, getNilId };
