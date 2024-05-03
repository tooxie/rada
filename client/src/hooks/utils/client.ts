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
  client?: Client;
}

const log = new Logger(__filename);
let clientMap: { [key: string]: ClientMapEntry } = {};

const getClientForServer = (serverId: ServerId): Client => {
  log.debug(`getClientForServer("${serverId}");`);
  if (!(serverId in clientMap)) {
    throw Error(`Unrecognized server "${serverId}"`);
  }

  const server = clientMap[serverId];
  if (server.client) {
    return server.client;
  }

  return buildClient(server.uri, server.name);
};

const getClient = async (serverId?: ServerId): Promise<Client> => {
  log.debug(`getClient(serverId="${serverId}")`);
  const server = clientMap[serverId || home.id];
  if (server && server.client) {
    log.debug("Client found in cache, resolving...");
    return server.client;
  }

  log.debug("No client found, creating...");
  await buildServerMap();
  log.debug(`Resolving client for "${serverId || home.id}"...`);
  const client = getClientForServer(serverId || home.id);
  log.debug(serverId, client);
  return client;
};

const buildServerMap = async (): Promise<void> => {
  const client = buildClient(home.api, home.name);
  log.debug(`Saving default client: ${home.id} -> ${home.api}`);
  clientMap[home.id] = {
    client,
    name: home.name,
    uri: home.api,
  };

  log.debug("Fetching list of servers...");
  const { data } = await client.query({ query: listServers });
  const servers = (data as ListServersQuery).listServers?.items || [];
  log.debug(`Got ${servers.length} servers:`, servers);
  if (servers.length) {
    log.debug("Saving servers...");
    servers.map((server) => {
      log.debug(`Saving server: ${server.id} -> ${server.apiUrl}`);
      clientMap[server.id] = {
        uri: server.apiUrl,
        name: server.name,
        client: buildClient(server.apiUrl, server.name),
      };
    });
    log.debug("Done building server map");
    log.debug(clientMap);
  }
};

export default getClient;
