import { expect, test } from "vitest";
import { OAuth2Client, OAuth2RequestError } from "../oauth/client/client.ts";
import { mockServer } from "./mock-server.ts";
import { decodeIdToken, generateCodeChallange } from "../oauth/client/lib.ts";
import { SignJWT } from "jose";

const createClient = (serverUrl: string) =>
  new OAuth2Client({
    clientId: "client_id_000",
    clientSecret: "client_secret_000",
    tokenHost: serverUrl,
    authorizationEndpoint: "/authorize",
    tokenEndpoint: "/token"
  });

test("should correctly generate the authorization URI", async () => {
  const server = mockServer();
  const client = createClient(server.url);
  const redirect_uri = server.url + "/callback";
  const params = new URLSearchParams({
    client_id: "client_id_000",
    response_type: "code",
    redirect_uri,
    scope: "a b",
    state: "state_000"
  });
  const authorizationUri = await client.getAuthorizationUri({
    state: "state_000",
    scopes: ["a", "b"],
    redirectUri: redirect_uri
  });
  const expectedUri = server.url + "/authorize?" + params;
  expect(authorizationUri).toStrictEqual(expectedUri);
});

test("should correctly generate the authorization URI using PKCE flow", async () => {
  const server = mockServer();
  const client = createClient(server.url);
  const redirect_uri = server.url + "/callback";
  const codeChallenge = await generateCodeChallange("codeverifier_000", "S256");
  const params = new URLSearchParams({
    client_id: "client_id_000",
    response_type: "code",
    redirect_uri,
    scope: "a b",
    state: "state_000",
    code_challenge: codeChallenge,
    code_challenge_method: "S256"
  });
  const authorizationUri = await client.getAuthorizationUri({
    state: "state_000",
    scopes: ["a", "b"],
    redirectUri: redirect_uri,
    codeVerifier: "codeverifier_000"
  });
  const expectedUri = server.url + "/authorize?" + params;
  const expectedCodeChallenge = new URLSearchParams(authorizationUri).get(
    "code_challenge"
  );

  expect(expectedCodeChallenge).toStrictEqual(codeChallenge);
  expect(authorizationUri).toStrictEqual(expectedUri);
});

test("should include the extra params in the authorization URI if specified", async () => {
  const server = mockServer();
  const client = createClient(server.url);
  const redirect_uri = server.url + "/callback";
  const params = new URLSearchParams({
    client_id: "client_id_000",
    response_type: "code",
    redirect_uri,
    scope: "a b",
    state: "state_000",
    access_type: "offline",
    prompt: "consent"
  });
  const authorizationUri = await client.getAuthorizationUri({
    state: "state_000",
    scopes: ["a", "b"],
    redirectUri: redirect_uri,
    extraParams: {
      access_type: "offline",
      prompt: "consent"
    }
  });
  const expectedUri = server.url + "/authorize?" + params;
  expect(authorizationUri).toStrictEqual(expectedUri);
});

test("should send requests to the token end point", async () => {
  const server = mockServer();
  const client = createClient(server.url);
  const redirect_uri = server.url + "/callback";
  const token = await client.verifyAuthorizationCode("code_000", redirect_uri);
  expect(token.access_token).toStrictEqual("access_token_000");
});

test("should throw an error when the request fails or the `access_token` is missing in the response", async () => {
  const server = mockServer();
  const client = createClient(server.url);
  const redirect_uri = server.url + "/callback";
  const verifyAuthorizationCode = () =>
    client.verifyAuthorizationCode("", redirect_uri);

  await expect(verifyAuthorizationCode).rejects.not.toHaveProperty(
    "access_token"
  );
  await expect(verifyAuthorizationCode).rejects.toThrowError();
  await expect(verifyAuthorizationCode).rejects.toBeInstanceOf(
    OAuth2RequestError
  );
  await expect(verifyAuthorizationCode).rejects.toHaveProperty(
    "error",
    "invalid_request"
  );

  await expect(verifyAuthorizationCode).rejects.toHaveProperty("error_uri");
  await expect(verifyAuthorizationCode).rejects.toEqual(
    expect.objectContaining({
      request: expect.any(Request)
    })
  );
});

test("should send a refresh token request to refresh the `access_token`", async () => {
  const server = mockServer();
  const client = createClient(server.url);
  const token = await client.refreshAccessToken("access_token_000");
  expect(token.access_token).toStrictEqual("access_token_000");
});

test("should decode the id token", async () => {
  const payload = {
    name: "John Doe",
    email: "johndoe@example.com"
  };

  // Assuming that this is the actual ID token
  const id_token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .sign(Buffer.from("somesecret"));
  const token = decodeIdToken(id_token);

  expect(token).toEqual(payload);
});

test("should throw error when the token is invalid", () => {
  // Assuming that this is the actual ID token
  const id_token = "invalid-token";

  expect(() => decodeIdToken(id_token)).toThrow(
    /Failed to decode the given id_token/
  );
});

test("should modify the request", async () => {
  const server = mockServer();
  const client = new OAuth2Client(
    {
      clientId: "client_id_000",
      clientSecret: "client_secret_000",
      tokenHost: server.url,
      authorizationEndpoint: "/authorize",
      tokenEndpoint: "/token"
    },
    (request, clientSettings) => {
      request.headers.set("Accept", "application/xml");
      request.headers.set("X-Some-Header", clientSettings.clientId);
      return request;
    }
  );
  // send a request
  await client.verifyAuthorizationCode("code_000", server.url + "/callback");

  expect(server.lastRequest().headers["accept"]).toStrictEqual(
    "application/xml"
  );
  expect(server.lastRequest().headers["x-some-header"]).toStrictEqual(
    "client_id_000"
  );
});
