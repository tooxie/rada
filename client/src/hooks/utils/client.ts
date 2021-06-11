import type { ListServersQuery } from "../../graphql/api";
import type { Client } from "../../graphql/client";
import type { ServerId } from "../../types";

import { server as home } from "../../config.json";
import buildClient from "../../graphql/client";
import { listServers } from "../../graphql/queries";
import Logger from "../../logger";

interface ClientMapEntry {
  uri: string;
  name: string;
  id: string;
  client?: Client;
}

const log = new Logger(__filename);

let serverMap: { [key: string]: ClientMapEntry } = {};
let client: Client | null = null;
let currentServerId: ServerId | null = null;

// Initialize home server in the map
serverMap[home.id] = {
  name: home.name,
  uri: home.api,
  id: home.id,
};

// const clients: { [key: string]: Client } = {};
// const getClient = async (serverId?: ServerId): Promise<Client> => {
//   // The variable `serverId` is optional because mutations cannot be applied
//   // to any server except the home one. So in case it's not provided we use
//   // the home server.
//   if (!serverId) {
//     serverId = home.id;
//   }
//   if (!clients[serverId]) {
//     log.warn(`Building client for server ${serverId}`);
//     clients[serverId] = buildClient(home.api, home.name, home.id);
//   }
//   return clients[serverId];
// };

const getClient = async (serverId?: ServerId): Promise<Client> => {
  // Always use home server if no serverId provided
  if (!serverId) {
    log.debug("No serverId, using home client");
    currentServerId = home.id;
    client = buildClient(home.api, home.name, home.id);
    return client;
  }

  // If server changed, we need a new client
  if (serverId !== currentServerId) {
    log.debug(`Server changed from ${currentServerId} to ${serverId}, creating new client`);

    // Build server map if we don't have this server yet
    if (!(serverId in serverMap)) {
      const homeClient = buildClient(home.api, home.name, home.id);
      await buildServerMap(homeClient);
    }

    const server = serverMap[serverId];
    if (!server) {
      throw Error(`Server "${serverId}" not found in server map`);
    }

    currentServerId = serverId;
    // Always create a new client for different servers
    client = buildClient(server.uri, server.name, server.id);
  }

  if (!client) {
    throw Error(`No client found for server "${currentServerId}"`);
  }

  return client;
};

const buildServerMap = async (client: Client): Promise<void> => {
  log.debug("Fetching list of servers...");
  const { data } = await client.query({ query: listServers });
  const servers = (data as ListServersQuery).listServers?.items || [];
  log.debug(`Got ${servers.length} servers:`, servers);
  if (servers.length) {
    log.debug("Saving servers...");
    servers.map((server) => {
      log.debug(`Saving server: ${server.id} -> ${server.apiUrl}`);
      serverMap[server.id] = {
        uri: server.apiUrl,
        name: server.name,
        id: server.id,
      };
    });
    log.debug("Done building server map");
    log.debug(serverMap);
  }
};

export { getClientForServer, buildServerMap };
export default getClient;
