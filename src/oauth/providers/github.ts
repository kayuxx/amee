import { OAuth2Client } from "oauth/client/client.ts";

export interface GithubTokenResponse {
  access_token: string;
  scope: string;
  token_type: string;
}

export function Github(
  clientId: string,
  clientSecret: string,
  clientOptions: { redirectUri: string }
) {
  const client = new OAuth2Client({
    clientId,
    clientSecret,
    tokenHost: "https://github.com",
    authorizationEndpoint: "/login/oauth/authorize",
    tokenEndpoint: "/login/oauth/access_token"
  });

  // GitHub doesn't support the PKCE flow.
  // https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps
  async function getAuthorizationUri(
    state: string,
    options?: { scopes: string[]; extraParams: Record<string, string> }
  ): Promise<string> {
    const defaultScope = ["read:user", "user:email"];
    const authorizationUri = await client.getAuthorizationUri({
      redirectUri: clientOptions.redirectUri,
      state: state,
      scopes: options?.scopes ?? defaultScope,
      extraParams: options?.extraParams
    });

    return authorizationUri;
  }

  async function verifyAuthorizationCode(
    code: string,
    codeVerifier: string
  ): Promise<GithubTokenResponse> {
    const options = {
      codeVerifier
    };
    const token = await client.verifyAuthorizationCode(
      code,
      clientOptions.redirectUri,
      options
    );

    return token as GithubTokenResponse;
  }

  async function refreshAccessToken(
    refreshToken: string,
    options?: { scopes?: string[] }
  ): Promise<GithubTokenResponse> {
    const token = await client.refreshAccessToken(refreshToken, options);
    return token as GithubTokenResponse;
  }

  return {
    getAuthorizationUri,
    verifyAuthorizationCode,
    refreshAccessToken
  };
}
