const urlize = (id?: string): string => {
  if (!id || id.indexOf(":") < 0) {
    throw new Error(`Invalid ID "${id}"`);
  }

  return id.split(":")[1];
};

const toDbId = (entity: string, id?: string): string => {
  if (!id || id.indexOf(":") > -1) {
    throw new Error(`Invalid ID "${id}" (entity was "${entity}")`);
  }

  return `${entity}:${id}`;
};

export { toDbId, urlize };
