import type { Server as ServerType } from "../graphql/api";

import config from "../config.json";

export const Server: ServerType = {
  __typename: "Server",
  id: config.server.id,
  name: config.server.name,
  apiUrl: config.server.api,
  timestamp: 0, // Math.round(Number(new Date()) / 1000),
  userPoolId: "",
  clientId: "",
  region: "",
  idpUrl: "",
  identityPoolId: "",
};
