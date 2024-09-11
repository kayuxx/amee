import { OAuth2Client } from "oauth/client/client.ts";

export interface MicrosoftEntraIDTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string | undefined;
  scope: string;
  token_type: string;
  id_token: string;
  ext_expires_in: number;
}

export function MicrosoftEntraID(
  clientId: string,
  clientSecret: string,
  clientOptions: {
    redirectUri: string;
    tenant?: "common" | "organizations" | "consumers";
  }
) {
  clientOptions.tenant = clientOptions.tenant ?? "common";
  const client = new OAuth2Client({
    clientId,
    clientSecret,
    tokenHost: `https://login.microsoftonline.com/${clientOptions.tenant}`,
    authorizationEndpoint: "/oauth2/v2.0/authorize",
    tokenEndpoint: "/oauth2/v2.0/token"
  });

  async function getAuthorizationUri(
    state: string,
    codeVerifier: string,
    options?: {
      scopes?: string[];
      getRefreshToken?: boolean;
      extraParams?: Record<string, string>;
    }
  ): Promise<string> {
    const defaultScopes = ["profile", "email"];
    const authorizationUri = await client.getAuthorizationUri({
      redirectUri: clientOptions.redirectUri,
      state: state,
      scopes: [
        "openid",
        ...(options?.scopes ?? defaultScopes),
        ...(options?.getRefreshToken ? ["offline_access"] : [])
      ],
      codeVerifier,
      extraParams: options?.extraParams
    });

    return authorizationUri;
  }

  async function verifyAuthorizationCode(
    code: string,
    codeVerifier: string
  ): Promise<MicrosoftEntraIDTokenResponse> {
    const token = await client.verifyAuthorizationCode(
      code,
      clientOptions.redirectUri,
      { codeVerifier }
    );

    return token as MicrosoftEntraIDTokenResponse;
  }

  async function refreshAccessToken(
    refreshToken: string,
    options?: { scopes?: string[] }
  ): Promise<MicrosoftEntraIDTokenResponse> {
    const token = await client.refreshAccessToken(refreshToken, options);
    return token as MicrosoftEntraIDTokenResponse;
  }

  return {
    getAuthorizationUri,
    verifyAuthorizationCode,
    refreshAccessToken
  };
}
