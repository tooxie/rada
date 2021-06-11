import * as AWS from "aws-sdk/global";
import { S3RequestPresigner } from "@aws-sdk/s3-request-presigner";
import { parseUrl } from "@aws-sdk/url-parser";
import { formatUrl } from "@aws-sdk/util-format-url";
import { Sha256 } from "@aws-crypto/sha256-browser";
import { HttpRequest } from "@aws-sdk/protocol-http";

import { Track } from "../graphql/api";
import config from "../config.json";

export const getSignedUrl = async (track: Track, retry = 0): Promise<string> => {
  if (!AWS.config.credentials) {
    throw new Error("Unauthorized");
  }

  const presigner = new S3RequestPresigner({
    credentials: AWS.config.credentials,
    region: config.region,
    sha256: Sha256,
  });
  const trackUrl = parseUrl(track.url);
  const httpRequest = new HttpRequest(trackUrl);

  try {
    return formatUrl(await presigner.presign(httpRequest));
  } catch (e) {
    console.error(e);
    if (retry < 3) {
      return getSignedUrl(track, ++retry);
    } else {
      throw e;
    }
  }
};
