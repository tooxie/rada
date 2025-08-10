// import cognito from "@aws-cdk/aws-cognito";
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoRefreshToken,
} from "amazon-cognito-identity-js";
import * as AWS from "aws-sdk/global";

import Logger from "../logger";
import config from "../config.json";

const log = new Logger(__filename);

interface AuthResponse {
  token: string;
  groups: string[];
  refreshToken?: string;
}

const storeRefreshToken = (token: string) => {
  return sessionStorage.setItem("awsRefreshToken", token);
};

const getRefreshToken = (): string | null => {
  return sessionStorage.getItem("awsRefreshToken");
};

const authenticate = (
  credentials: Credentials
): Promise<AuthResponse> => {
  log.debug(`Authenticating as ${credentials.username}`);

  const { username, password } = credentials;
  if (!username || !password) throw new Error("No user credentials provided");

  return new Promise((resolve, reject) => {
    const poolData = {
      UserPoolId: config.idp.userPoolId,
      ClientId: config.idp.clientId,
    };
    const pool = new CognitoUserPool(poolData);
    const authData = {
      Username: username,
      Password: password,
    };
    const userData = {
      Username: username,
      Pool: pool,
    };
    const auth = new AuthenticationDetails(authData);
    const user = new CognitoUser(userData);
    log.debug("Querying cognito...");
    user.setAuthenticationFlowType("USER_PASSWORD_AUTH");
    user.authenticateUser(auth, {
      onSuccess: (result) => {
        log.debug("Authentication successful");
        const loginData = {};
        const key = config.idp.url;
        const idToken = result.getIdToken().getJwtToken();
        const refreshToken = result.getRefreshToken().getToken();
        (loginData as any)[key] = idToken;
        AWS.config.update({ region: config.region });
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: config.idp.identityPoolId,
          Logins: loginData,
        });
        (AWS.config.credentials as any).refresh((error: Error) => {
          if (error) {
            log.warn(error);
            reject(error);
          } else {
            log.debug("Resolving...");
            resolve({
              token: idToken,
              groups: result.getIdToken().payload["cognito:groups"] || [],
              refreshToken,
            });
          }
        });
      },
      onFailure: (err) => {
        log.warn(err);
        reject(err);
      },
    });
  });
};

const storeAccessToken = (token: string) => {
  return sessionStorage.setItem("awsAccessToken", token);
};

const getAccessToken = (): string => {
  const token = sessionStorage.getItem("awsAccessToken");
  if (!token) throw new Error("Unauthorized");
  return token;
};

interface Credentials {
  username: string;
  password: string;
}

const storeCredentials = (credentials: Credentials) => {
  const { username, password } = credentials;
  if (!username || !password) throw new Error("Must provide both username and password");
  log.warn(`localStorage.setItem("GawshiUsername", "${username}")`);
  localStorage.setItem("GawshiUsername", username);
  log.warn(`localStorage.setItem("GawshiPassword", "***********")`);
  localStorage.setItem("GawshiPassword", password);
};

const fetchCredentials = (): Credentials => {
  log.warn(`localStorage.getItem("GawshiUsername")`);
  const username = localStorage.getItem("GawshiUsername");
  log.warn(`localStorage.getItem("GawshiPassword")`);
  const password = localStorage.getItem("GawshiPassword");

  if (!username || !password) throw new Error("Credentials not found");

  return { username, password };
};

const clearCredentials = () => {
  log.warn(`localStorage.removeItem("GawshiUsername")`);
  localStorage.removeItem("GawshiUsername");
  log.warn(`localStorage.removeItem("GawshiPassword")`);
  localStorage.removeItem("GawshiPassword");
};

const refreshToken = async (): Promise<string> => {
  log.debug("Refreshing token");
  const refreshTokenStr = getRefreshToken();
  if (!refreshTokenStr) {
    // If no refresh token, fall back to full re-auth
    const credentials = fetchCredentials();
    const response = await authenticate(credentials);
    storeRefreshToken(response.refreshToken!);
    storeAccessToken(response.token);
    return response.token;
  }

  return new Promise((resolve, reject) => {
    const poolData = {
      UserPoolId: config.idp.userPoolId,
      ClientId: config.idp.clientId,
    };
    const pool = new CognitoUserPool(poolData);
    const userData = {
      Username: "dummy", // Required by the SDK but not used
      Pool: pool,
    };
    const user = new CognitoUser(userData);
    const refreshToken = new CognitoRefreshToken({ RefreshToken: refreshTokenStr });

    user.refreshSession(refreshToken, (err, session) => {
      if (err) {
        log.error("Failed to refresh token:", err);
        reject(err);
        return;
      }

      const idToken = session.getIdToken().getJwtToken();
      const newRefreshToken = session.getRefreshToken().getToken();
      storeRefreshToken(newRefreshToken);
      storeAccessToken(idToken);
      resolve(idToken);
    });
  });
};

export {
  Credentials,
  authenticate,
  getAccessToken,
  storeAccessToken,
  clearCredentials,
  fetchCredentials,
  storeCredentials,
  refreshToken,
};
