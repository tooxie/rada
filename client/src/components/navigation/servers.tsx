import { h, Fragment } from "preact";
import { Link } from "preact-router/match";

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

  // FIXME: We used to `selectServer` by doing a full reload, calling
  // FIXME: `window.location.href`. This is obviously problematic but we did it
  // FIXME: for a reason: Once we call `setConf` the app won't re-render
  // FIXME: properly, the only way to force a render and update the app with
  // FIXME: the information of the new server was to reload the page. This is
  // FIXME: not ideal, mainly because playback will be affected and that's
  // FIXME: unacceptable. We need to fix that.
  const selectServer = (server: typeof Server) => {
    conf.currentServer = server;
    setConf(conf);
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
              <Link
                href={`/server/${server.id}/artists`}
                class={style.server}
                onClick={() => selectServer(server)}
              >
                <img src={folder} /> {server.name} ({server.id.split("-")[0]})
              </Link>
            ))}
          </div>

          <div class={style.mine}>
            <Link href="/" onClick={resetServer}>
              + Go to my server
            </Link>
          </div>
        </Fragment>
      ) : (
        "No servers"
      )}
    </Options>
  );
};

export default Servers;
