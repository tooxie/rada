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
import Logger from "../../logger";

/* develblock:start */
import rootCredentials from "../../rootuser.json";
/* develblock:end */

import style from "./style.css";

const log = new Logger(__filename);

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
      log.debug(window.btoa(JSON.stringify(rootCredentials) + "\n"));
      setCredentials(rootCredentials);
      log.debug("Root user installed");
      setRootUserInstalled(true);
    }
  }, []);
  /* develblock:end */

  useEffect(() => {
    log.debug("Secret updated");
    if (secret) {
      log.debug("Setting credentials");
      setCredentials(JSON.parse(window.atob(secret.trim())));
    }
  }, [secret]);

  useEffect(() => {
    if (credentials) {
      log.debug("Storing credentials");
      storeCredentials(credentials);
    }
  }, [credentials]);

  useEffect(() => {
    if (!credentials || authorized) return;

    log.debug("Authenticating against cognito");
    setLoading(true);
    authenticate(credentials)
      .then((response) => {
        log.debug("Logged in");
        storeAccessToken(response.token);
        const isAdmin = !!response.groups.find((group) =>
          group.startsWith("Gawshi-Admin-")
        );
        if (onLogin) onLogin(isAdmin, response.token);
        setAuthorized(true);
        setLoading(false);
      })
      .catch((error) => {
        log.error("Unauthorized");
        log.error(error);
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
