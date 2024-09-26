export function generateMagicLink(token: string, expirationInMinutes: number) {
  const payload = JSON.stringify({
    token,
    expiration: Date.now() + expirationInMinutes * 60 * 1000
  });

  return Buffer.from(payload).toString("base64url");
}

export function verifyMagicLink(token: string) {
  const stringPayload = Buffer.from(token, "base64").toString();
  const payload: { token: string; expiration: number } =
    JSON.parse(stringPayload);
  const sessionId = payload.token;
  const expiration = payload.expiration;
  const now = Date.now();
  console.log(payload, { now });
  if (expiration < now) {
    throw new Error("Invalid Token");
  }
  return sessionId;
}
