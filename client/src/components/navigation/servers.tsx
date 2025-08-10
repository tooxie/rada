import { h, Fragment } from "preact";
import { route } from "preact-router";

import Options, { Title } from "../../components/options";
import Spinner from "../../components/spinner";
import ErrorMsg from "../../components/error";
import useListServers from "../../routes/servers/hooks/uselist";
import useConf from "../../hooks/useconf";
import { Server as defaultServer } from "../../conf/defaults";
import Logger from "../../logger";
import config from "../../config.json";

import icon from "./servers.svg";
import style from "./servers.css";
import folder from "./folder.svg";
import home from "./home.svg";

const log = new Logger(__filename);

const Servers = () => {
  const { loading, error, servers } = useListServers();
  const { conf, setConf } = useConf();

  const selectServer = (server?: typeof defaultServer) => {
    conf.currentServer = server || defaultServer;
    log.debug(`Switching to server: ${conf.currentServer.name} (${conf.currentServer.id})`);
    setConf(conf);
  };

  const getPath = () => {
    const parts = window.location.pathname.split("/");
    return parts[parts.length - 1];
  };

  // Little hack to ensure we refresh only if we are on one of the main tabs.
  // If we are looking, for example, at an artist, we don't want to refresh
  // the page or navigate the user away.
  const routeIfNeeded = (server?: typeof defaultServer) => {
    const serverId = server?.id || defaultServer.id;
    const path = getPath();
    if (["artists", "albums", "tracks"].includes(path)) {
      log.debug(`routeIfNeeded: routing to -> "/server/${serverId}/${path}"`);
      route(`/server/${serverId}/${path}`);
    } else if (["friends", "servers"].includes(path)) {
      log.debug(`routeIfNeeded: routing to -> "/server/${serverId}/artists"`);
      route(`/server/${serverId}/artists`);
    }
  };

  return (
    <Options icon={icon}>
      <Title class={style.title}>Servers</Title>
      {loading ? (
        <Spinner />
      ) : error ? (
        <ErrorMsg error={error} />
      ) : servers.length > 0 ? (
        <Fragment>
          <div>
            <div
              role="button"
              tabIndex={0}
              class={style.server}
              onClick={(e) => {
                selectServer();  // reset to default server
                routeIfNeeded();
              }}
            >
              <img src={home} /> {config.server.name} ({config.server.id.split("-")[0].split(":")[1]})
            </div>
          </div>
          <div>
            {servers.map((server) => (
              <div
                role="button"
                tabIndex={0}
                class={style.server}
                onClick={(e) => {
                  selectServer(server);
                  routeIfNeeded(server);
                }}
              >
                <img src={folder} /> {server.name} ({server.id.split("-")[0].split(":")[1]})
              </div>
            ))}
          </div>
        </Fragment>
      ) : (
        "No servers"
      )}
    </Options>
  );
};

export default Servers;
