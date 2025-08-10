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
import Spinner from "../spinner";
import ErrorMsg from "../error";
import Install, { appInstalled } from "../install";
import useConf from "../../conf/hooks/useconf";
import config from "../../config.json";

/* develblock:start */
/* We inject the root credentials into localStorage for local development. The
 * build pipeline will remove all the code between the "develblock:" markers.
 */
import rootCredentials from "../../rootuser.json";
/* develblock:end */

import InputSecret from "./secret";
import style from "./style.css";

const log = new Logger(__filename);

interface AuthProps {
  onLogin?: (admin: boolean, token: string) => void;
  onFailedAuth?: () => void;
}

const Auth = ({ onLogin, onFailedAuth }: AuthProps) => {
  const { conf } = useConf();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [credentials, setCredentials] = useState<Credentials>();
  const [secret, setSecret] = useState<string>();
  const [online, setOnline] = useState(true);
  const [retries, setRetries] = useState(1);
  const [error, setError] = useState<Error>();

  const onlineHandler = () => setOnline(true);
  const offlineHandler = () => setOnline(false);
  useEffect(() => {
    window.addEventListener("online", onlineHandler);
    window.addEventListener("offline", offlineHandler);

    return () => {
      if (authorized) {
        window.removeEventListener("online", onlineHandler);
        window.removeEventListener("offline", offlineHandler);
      }
    };
  }, [online]);

  setOnline(window.navigator.onLine);

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
    if (!conf || !credentials || authorized) return;
    if (retries > 3) {
      setLoading(false);
      if (onFailedAuth) onFailedAuth();
      return;
    }

    log.debug("Authenticating against cognito");
    setLoading(true);
    authenticate(credentials)
      .then((response) => {
        log.debug("Logged in");
        storeAccessToken(response.token);
        const isAdmin = !!response.groups.find(
          (group) => group === config.idp.adminGroupName
        );
        if (onLogin) {
          if (appInstalled()) onLogin(isAdmin, response.token);
        }
        setAuthorized(true);
        setLoading(false);
      })
      .catch((error) => {
        log.error(error);
        if (error.name.includes("NotAuthorizedException")) {
          setAuthorized(false);
          setRetries(retries + 1);
          if (retries === 3) setError(error);
        } else {
          setError(error);
          setLoading(false);
        }
      });
  }, [conf, credentials, retries]);

  return (
    <Fragment>
      <Header hideControls={true} />
      <Shoulder>
        <section class={style.auth}>
          {
            // Is the app running in standalone mode?
            appInstalled() ? (
              // Are you online?
              online ? (
                // Are we still loading?
                loading ? (
                  <Spinner message="Authenticating..." />
                ) : // Was there an error?
                error ? (
                  <ErrorMsg error={error ? error.message : "Unknown error"} />
                ) : // Are you authorized to see this?
                authorized ? /* Null is good :) */ null : (
                  // I'm going to need to see your ID
                  <InputSecret onInput={(secret) => setSecret(secret)} />
                )
              ) : (
                <div>You are offline.</div>
              )
            ) : (
              <Install />
            )
          }
        </section>
      </Shoulder>
    </Fragment>
  );
};

export default Auth;
