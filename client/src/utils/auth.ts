// import cognito from "@aws-cdk/aws-cognito";
import poolConfig from "../userpool.json";
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";
import * as AWS from "aws-sdk/global";

import Logger from "../logger";

const log = new Logger(__filename);

interface AuthResponse {
  token: string;
  groups: string[];
}

const authenticate = (credentials: Credentials): Promise<AuthResponse> => {
  log.debug(`Authenticating as ${credentials.username}`);
  const { username, password } = credentials;
  if (!username || !password) throw new Error("No user credentials provided");

  return new Promise((resolve, reject) => {
    const poolData = {
      UserPoolId: poolConfig.userPoolId,
      ClientId: poolConfig.clientId,
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
        const key = `cognito-idp.${poolConfig.region}.amazonaws.com/${poolConfig.userPoolId}`;
        (loginData as any)[key] = result.getIdToken().getJwtToken();
        AWS.config.update({ region: poolConfig.region });
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: poolConfig.identityPoolId,
          Logins: loginData,
        });
        (AWS.config.credentials as any).refresh((error: Error) => {
          if (error) {
            log.warn(error);
            reject(error);
          } else {
            log.debug("Resolving...");
            resolve({
              token: result.getAccessToken().getJwtToken(),
              groups: result.getIdToken().payload["cognito:groups"] || [],
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
  log.debug(`Storing username "${username}"`);
  localStorage.setItem("GawshiUsername", username);
  log.debug(`Storing password ${password}`);
  localStorage.setItem("GawshiPassword", password);
};

const fetchCredentials = (): Credentials => {
  const username = localStorage.getItem("GawshiUsername");
  const password = localStorage.getItem("GawshiPassword");

  if (!username || !password) throw new Error("Credentials not found");

  return { username, password };
};

const clearCredentials = () => {
  localStorage.removeItem("GawshiUsername");
  localStorage.removeItem("GawshiPassword");
};

export {
  Credentials,
  authenticate,
  getAccessToken,
  storeAccessToken,
  clearCredentials,
  fetchCredentials,
  storeCredentials,
};
