import { h, Fragment } from "preact";
import { useEffect, useState } from "preact/hooks";

import Shoulder from "../layout/shoulder";
import Header from "../header";
import {
  authenticate,
  Credentials,
  fetchCredentials,
  storeCredentials,
  storeAccessToken,
} from "../../utils/auth";

/* develblock:start */
import rootCredentials from "../../rootuser.json";
/* develblock:end */

import style from "./style.css";

interface AuthProps {
  onLogin?: (admin: boolean, token: string) => void;
  onFailedAuth?: () => void;
}

const Auth = ({ onLogin, onFailedAuth }: AuthProps) => {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [credentials, setCredentials] = useState<Credentials>();
  const [secret, setSecret] = useState<string>();

  useEffect(() => {
    try {
      setCredentials(fetchCredentials());
    } catch {
      setLoading(false);
    }
  }, []);

  /* develblock:start */
  const [rootUserInstalled, setRootUserInstalled] = useState(false);
  useEffect(() => {
    if (!rootUserInstalled) {
      console.log(window.btoa(JSON.stringify(rootCredentials) + "\n"));
      setCredentials(rootCredentials);
      console.log("[auth/index.tsx] Root user installed");
      setRootUserInstalled(true);
    }
  }, []);
  /* develblock:end */

  useEffect(() => {
    console.log("[auth/index.tsx] Secret updated");
    if (secret) {
      console.log("[auth/index.tsx] Setting credentials");
      setCredentials(JSON.parse(window.atob(secret.trim())));
    }
  }, [secret]);

  useEffect(() => {
    if (credentials) {
      console.log("[auth/index.tsx] Storing credentials");
      storeCredentials(credentials);
    }
  }, [credentials]);

  useEffect(() => {
    if (!credentials || authorized) return;

    console.log("[auth/index.tsx] Authenticating against cognito");
    setLoading(true);
    authenticate(credentials)
      .then((response) => {
        console.log("[auth/index.tsx] Logged in");
        storeAccessToken(response.token);
        const isAdmin = !!response.groups.find((group) =>
          group.startsWith("Gawshi-Admin-")
        );
        if (onLogin) onLogin(isAdmin, response.token);
        setAuthorized(true);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Unauthorized");
        console.error(error);
        if (onFailedAuth) onFailedAuth();
        setAuthorized(false);
        setLoading(false);
      });
  }, [credentials]);

  return (
    <Fragment>
      <Header hideControls={true} />
      <Shoulder>
        <section class={style.auth}>
          {loading
            ? "Loading..."
            : !authorized && (
                <Fragment>
                  <label for="secret">
                    If you have a <i>secret</i> paste it below:
                  </label>
                  <div>
                    <input
                      type="text"
                      id="secret"
                      onInput={(ev) => setSecret((ev.target as HTMLInputElement).value)}
                    />
                  </div>
                </Fragment>
              )}
        </section>
      </Shoulder>
    </Fragment>
  );
};

export default Auth;
