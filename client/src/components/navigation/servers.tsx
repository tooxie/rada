import { h, Fragment } from "preact";

import Options, { Title } from "../../components/options";
import Spinner from "../../components/spinner";
import ErrorMsg from "../../components/error";
import useListServers from "../../routes/servers/hooks/uselist";
import useConf from "../../conf/hooks/useconf";
import { Server } from "../../conf/defaults";

import icon from "./servers.svg";
import style from "./servers.css";
import folder from "./folder.svg";

const Servers = () => {
  const { loading, error, servers } = useListServers();
  const { conf, setConf } = useConf();
  const selectServer = (server: typeof Server) => {
    conf.currentServer = server;
    setConf(conf);
    window.location.href = `/server/${server.id}/artists`;
  };
  const resetServer = () => selectServer(Server);

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
            {servers.map((server) => (
              <div class={style.server} onClick={() => selectServer(server)}>
                <img src={folder} /> {server.name} ({server.id.split("-")[0]})
              </div>
            ))}
          </div>

          <div class={style.mine}>
            <button onClick={resetServer}>+ Go to my server</button>
          </div>
        </Fragment>
      ) : (
        "No servers"
      )}
    </Options>
  );
};

export default Servers;
