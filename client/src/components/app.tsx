/* develblock:start */
import "preact/debug";
/* develblock:end */
import { h } from "preact";
import { useState } from "preact/hooks";

import Conf from "../conf/context";
import useConf from "../conf/hooks/useconf";
import Apollo from "../graphql/context";
import getClient, { Client } from "../graphql/client";

import Root from "./root";
import Auth from "./auth";

const App = () => {
  const { conf, setConf } = useConf();
  const [client, setClient] = useState<Client>();
  const [loggedIn, setLoggedIn] = useState(false);
  const onLogin = (admin: boolean) => {
    // TODO: This is ok her for now but this not a conf,
    // TODO: it should really go into a user context.
    conf.isAdmin = admin;
    setConf(conf);
    setLoggedIn(true);
  };

  getClient().then((c: Client) => setClient(c));

  console.log(
    `[app.tsx] ${
      loggedIn ? `Logged in ${conf.isAdmin ? "as admin" : ""}` : "Anonymous user"
    }`
  );

  return (
    <Conf.Provider value={{ conf, setConf }}>
      {loggedIn ? (
        <Apollo.Provider value={client}>
          <Root />
        </Apollo.Provider>
      ) : (
        <Auth onLogin={onLogin} />
      )}
    </Conf.Provider>
  );
};

export default App;
