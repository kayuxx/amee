/**
 * Amee uses JWE class from the JWT {@Link https://www.rfc-editor.org/rfc/rfc7516}
 * using A256CBC-HS512 encryption Algorithm for JWE {@link https://www.rfc-editor.org/rfc/rfc7518#section-5.2.6}
 * The secret key is obtained from the configuration..
 *
 * Amee relies on the `jose` library for JWTs.
 */

import {
  base64url,
  calculateJwkThumbprint,
  EncryptJWT,
  jwtDecrypt,
  type JWTPayload,
} from "jose";
import { hkdf } from "@panva/hkdf";
import type { AmeeOptions } from "./amee.ts";

const kty = "oct";
const enc = "A256CBC-HS512";
const alg = "dir";
// The default expiration value for cookie in seconds is 30 Days.
const THIRTEEN_DAYS = 30 * 24 * 60 * 60;
const now = () => Math.floor(Date.now() / 1000);
const cookieMaximumByte = 4096;

type Digest = Parameters<typeof calculateJwkThumbprint>[1];

// Encode The JWT, using A256CBC-HS512 Encryption
export async function Encode<P>(params: EncodeParams<P>) {
  const { secret, payload, salt = "", maxAge = THIRTEEN_DAYS } = params;
  const encryptionKey = await deriveEncryptionKey(enc, secret, salt);
  const JwkThumbprint = await calculateJwkThumbprint(
    { kty, k: base64url.encode(encryptionKey) },
    `sha${encryptionKey.byteLength << 3}` as Digest,
  );

  // Encrypt the payload
  const jwt = await new EncryptJWT(payload as JWTPayload) // accepts any object as payload
    .setProtectedHeader({ alg, enc, kid: JwkThumbprint })
    .setIssuedAt()
    .setExpirationTime(now() + maxAge)
    .setJti(crypto.randomUUID())
    .encrypt(encryptionKey);

  // Throws an error if the JWT token exceeds the maximum byte size allowed for cookies.
  if (jwt.length > cookieMaximumByte) {
    throw new Error(
      `[Amee]: JWT length is too large to be set by the browser (${jwt.length} bytes). Try to reduce the amount of data.`,
    );
  }

  return jwt as string;
}

// Decode The issued JWT
export async function Decode<Payload>(params: DecodeParams) {
  const { jwtToken, secret, salt = "" } = params;
  if (!jwtToken) return null; // missing jwtToken

  const { payload: jwtPayload } = await jwtDecrypt(
    jwtToken,
    async ({ kid, enc }) => {
      const encryptionKey = await deriveEncryptionKey(enc, secret, salt);
      if (kid === undefined) return encryptionKey;

      const Jwkthumbprint = await calculateJwkThumbprint(
        { kty, k: base64url.encode(encryptionKey) },
        `sha${encryptionKey.byteLength << 3}` as Digest,
      );

      if (kid === Jwkthumbprint) return encryptionKey;

      throw new Error("[Amee]: The decryption key did not match the secret.");
    },
    {
      contentEncryptionAlgorithms: [enc],
      keyManagementAlgorithms: [alg],
      clockTolerance: 15,
    },
  );
  return jwtPayload as JWTPayload & Payload;
}

/**
 * derive a cryptographically strong secret key using HKDF.
 * @see {@link https://www.rfc-editor.org/rfc/rfc5869}
 */
async function deriveEncryptionKey(
  enc: string,
  keyMaterial: Parameters<typeof hkdf>[1],
  salt: Parameters<typeof hkdf>[2],
) {
  // Handle unexpected encryption algorithm
  if (enc !== "A256CBC-HS512") {
    throw new Error("[Amee]: Unsupported JWT encryption algorithm");
  }

  return await hkdf(
    "sha256",
    keyMaterial,
    salt,
    `Amee Encryption Key Generated [${enc}, ${salt}, sha256]`,
    64,
  );
}

interface EncodeParams<CustomPayload>
  extends Pick<AmeeOptions, "secret" | "salt" | "maxAge"> {
  /** The JWT payload. */
  payload?: CustomPayload;
}

interface DecodeParams extends Pick<AmeeOptions, "secret" | "salt"> {
  /** JWT Token (The Compact JWE) */
  jwtToken: string | Uint8Array;
}
