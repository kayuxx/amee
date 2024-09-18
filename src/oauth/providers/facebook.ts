import { OAuth2Client } from "oauth/client/client.ts";

export interface FacebookTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  id_token: string;
}

// Facebook does not provide a refresh token.
// It provides a long lived token to use it instead of short lived token as access_token.
// https://developers.facebook.com/docs/facebook-login/guides/access-tokens/get-long-lived/
export function Facebook(
  clientId: string,
  clientSecret: string,
  clientOptions: { redirectUri: string }
) {
  const client = new OAuth2Client({
    clientId,
    clientSecret,
    authorizationEndpoint: "https://www.facebook.com/v20.0/dialog/oauth",
    tokenEndpoint: "https://graph.facebook.com/v20.0/oauth/access_token"
  });

  async function getAuthorizationUri(
    state: string,
    codeVerifier: string,
    options?: {
      scopes?: string[];
      extraParams?: Record<string, string>;
    }
  ): Promise<string> {
    const defaultScopes = ["email"];
    const authorizationUri = await client.getAuthorizationUri({
      redirectUri: clientOptions.redirectUri,
      state: state,
      scopes: options?.scopes ?? defaultScopes,
      codeVerifier,
      extraParams: options?.extraParams
    });

    return authorizationUri;
  }

  async function verifyAuthorizationCode(
    code: string,
    codeVerifier: string
  ): Promise<FacebookTokenResponse> {
    const token = await client.verifyAuthorizationCode(
      code,
      clientOptions.redirectUri,
      { codeVerifier }
    );

    return token as FacebookTokenResponse;
  }

  return {
    getAuthorizationUri,
    verifyAuthorizationCode
  };
}
