import type { ListServersQuery } from "../../graphql/api";
import type { Client } from "../../graphql/client";
import type { ServerId } from "../../types";

import { server } from "../../config.json";
import getActualClient from "../../graphql/client";
import { listServers } from "../../graphql/queries";
import Logger from "../../logger";

interface ClientMapEntry {
  uri: string;
  name: string;
  client?: Client;
}

const log = new Logger(__filename);
let clientMap: { [key: string]: ClientMapEntry } = {};

const getClientForServer = async (serverId: ServerId): Promise<Client> => {
  if (!(serverId in clientMap)) throw Error(`Unrecognized server "${serverId}"`);

  let client = clientMap[serverId].client;
  if (client) return client;

  return getActualClient(clientMap[serverId].uri, clientMap[serverId].name);
};

const getClient = async (serverId?: ServerId): Promise<Client> => {
  log.debug(`getClient(serverId: ${serverId})`);
  const defaultClient = clientMap[server.id];
  if (!defaultClient) {
    log.debug("No default client found, creating...");
    const client = await getActualClient(server.api, server.name);
    log.debug(`Saving default client: ${server.id} -> ${server.api}`);
    clientMap[server.id] = {
      client,
      name: server.name,
      uri: server.api,
    };
    await buildServerMap(client);
  }

  log.debug(`Getting client for serverId "${serverId || server.id}"...`);
  return getClientForServer(serverId || server.id);
};

const buildServerMap = async (client: Client) => {
  log.debug("Fetching list of servers...");
  const { data } = await client.query({ query: listServers });
  const servers = (data as ListServersQuery).listServers?.items || [];
  if (servers.length) {
    log.debug("Saving servers...");
    servers.map((server) => {
      log.debug(`Saving server: ${server.id} -> ${server.apiUrl}`);
      clientMap[server.id] = { uri: server.apiUrl, name: server.name };
    });
    log.debug("Done building server map");
  }
};

export default getClient;
