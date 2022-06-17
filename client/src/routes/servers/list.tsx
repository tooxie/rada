import { h, Fragment } from "preact";
import { useEffect, useState } from "preact/hooks";

import config from "../../config.json";
import QrCode from "../../components/qrcode/cached";

import useListServers from "./hooks/uselist";
import style from "./style.css";
import Spinner from "../../components/spinner";
import ErrorMsg from "../../components/error";

const credentials = JSON.stringify({
  id: config.serverId,
  api: config.graphql.url,
  name: "Rada", // config.name,
  header: null, // config.header,
  idpUrl: "https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_MhH6ebMzD", // config.idp
});

const Servers = () => {
  const [token, setToken] = useState<string>();
  const { servers, loading, error } = useListServers();

  if (error) return <ErrorMsg error={error} />;
  if (loading) return <Spinner />;

  useEffect(() => {
    setToken(credentials);
  }, []);

  return (
    <Fragment>
      <div class={style.credentials}>{token && <QrCode value={token} />}</div>
      <div class={style.add}>
        <a href="/servers/add">+ Add Server</a>
      </div>

      <div class={style.servers}>
        {servers.map((server) => (
          <div class={style.server}>
            {server.name} <span class={style.id}>{server.id}</span>
          </div>
        ))}
      </div>
    </Fragment>
  );
};

export default Servers;
