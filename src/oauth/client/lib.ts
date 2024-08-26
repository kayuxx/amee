import crypto from "crypto";
import { decodeJwt, type JWTPayload } from "jose";

/*
 * Get the Web Crypto API if available
 * Or relie on Node.js crypto module
 */
function getWebCrypto(): Crypto | null {
  // Node
  if (typeof process !== "undefined" && crypto.webcrypto) {
    return crypto.webcrypto as Crypto;
  }

  // Browsers
  if (typeof window !== "undefined" && window.crypto) {
    return window.crypto;
  }

  // Web Workers
  if (typeof self !== "undefined" && self.crypto) {
    return self.crypto;
  }

  return null;
}

async function sha256(arrayBuffer: ArrayBuffer): Promise<ArrayBuffer> {
  const webcrypto = getWebCrypto();
  // Use the Web Crypto API if available
  if (webcrypto?.subtle) {
    return await webcrypto.subtle.digest("SHA-256", arrayBuffer);
  } else if (
    typeof crypto !== "undefined" &&
    typeof crypto.createHash == "function"
  ) {
    // Use Node.js crypto module if Web Crypto API is not available
    const hash = crypto.createHash("sha256");
    const buffer = hash.update(Buffer.from(arrayBuffer)).digest();
    const res = buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength
    );

    return res;
  }

  throw new Error("[Amee] No suitable cryptographic API available.");
}

function base64Url(buf: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function generateCodeChallange(
  codeVerifier: string,
  method: "S256" | "plain"
): Promise<string> {
  if (method === "S256") {
    const encodedCodeVerifier = new TextEncoder().encode(codeVerifier);
    const codeChallengeBuffer = await sha256(encodedCodeVerifier);

    return base64Url(codeChallengeBuffer);
  } else if (method === "plain") {
    return codeVerifier;
  }

  throw new Error(
    `[Amee]: "codeChallengeMethod" Missing, "${method}" is not a valid value.`
  );
}

/**
 * Generate a secure random string token
 */
export function generateRandomToken(): string {
  const webcrypto = getWebCrypto();
  if (webcrypto?.subtle) {
    const randomValues = new Uint8Array(32);
    webcrypto.getRandomValues(randomValues);
    return base64Url(randomValues);
  } else if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomBytes == "function"
  ) {
    const randomValues = crypto.randomBytes(32);
    return base64Url(randomValues);
  }
  throw new Error("[Amee] No suitable cryptographic API available.");
}

/**
 * Decode the given id_token
 * for the OpenID Connect protocol
 */
export function decodeIdToken(id_token: string): JWTPayload {
  try {
    return decodeJwt(id_token);
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(
        "[Amee]: Failed to decode the given id_token: " + err.message
      );
    } else {
      throw err;
    }
  }
}
