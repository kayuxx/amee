import crypto from "crypto";
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
  } else if (crypto && crypto.createHash) {
    // Use Node.js crypto module if Web Crypto API is not available
    const hash = crypto.createHash("sha256");
    const buffer = hash.update(Buffer.from(arrayBuffer)).digest();
    const res = buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength,
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
  method: "S256" | "plain",
): Promise<string> {
  if (method === "S256") {
    const encodedCodeVerifier = new TextEncoder().encode(codeVerifier);
    const codeChallengeBuffer = await sha256(encodedCodeVerifier);

    return base64Url(codeChallengeBuffer);
  } else if (method === "plain") {
    return codeVerifier;
  }
  throw new Error(
    `[Amee]: "codeChallengeMethod" Missing, "${method}" is not a valid value.`,
  );
}

/**
 * Generate a secure random string token
 * Used to generate both the code verifier and the state.
 */
export function generateRandomToken(): string {
  const randomValues = new Uint8Array(32);
  const webcrypto = getWebCrypto();
  if (webcrypto?.subtle) {
    webcrypto.getRandomValues(randomValues);
    return base64Url(randomValues);
  }

  try {
    crypto.getRandomValues(randomValues);
    return base64Url(randomValues);
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(
        `[Amee] Failed to generate random string: ${err.message}`,
      );
    } else {
      // Unexpected error type
      throw new Error(
        "[Amee] An unknown error occurred while generating the random string.",
      );
    }
  }
}
