import { OAuth2Client } from "oauth/client/client.ts";

export interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string | undefined;
  scope: string;
  token_type: string;
}

export function Google(
  clientId: string,
  clientSecret: string,
  clientOptions: { redirectUri: string }
) {
  const client = new OAuth2Client({
    clientId,
    clientSecret,
    authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenEndpoint: "https://oauth2.googleapis.com/token"
  });

  async function getAuthorizationUri(
    state: string,
    codeVerifier: string,
    options?: { scopes?: string[]; extraParams?: Record<string, string> }
  ): Promise<string> {
    const defaultScope = ["openid", "profile", "email"];
    const authorizationUri = await client.getAuthorizationUri({
      redirectUri: clientOptions.redirectUri,
      state: state,
      scopes: options?.scopes ?? defaultScope,
      codeVerifier,
      extraParams: options?.extraParams
    });

    return authorizationUri;
  }

  async function verifyAuthorizationCode(
    code: string,
    codeVerifier: string
  ): Promise<GoogleTokenResponse> {
    const options = {
      codeVerifier
    };
    const token = await client.verifyAuthorizationCode(
      code,
      clientOptions.redirectUri,
      options
    );

    return token as GoogleTokenResponse;
  }

  async function refreshAccessToken(
    refreshToken: string,
    options?: { scopes?: string[] }
  ): Promise<GoogleTokenResponse> {
    const token = await client.refreshAccessToken(refreshToken, options);

    return token as GoogleTokenResponse;
  }

  return {
    getAuthorizationUri,
    verifyAuthorizationCode,
    refreshAccessToken
  };
}
