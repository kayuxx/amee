import { OAuth2Client } from "oauth/client/client.ts";
import { base64url } from "jose";

// Faceit includes the refresh token in the response without additional requirements
export interface FaceitTokenResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  id_token: string;
}

export function Faceit(
  clientId: string,
  clientSecret: string,
  clientOptions: { redirectUri: string }
) {
  const client = new OAuth2Client(
    {
      clientId,
      clientSecret,
      authorizationEndpoint: "https://accounts.faceit.com",
      tokenEndpoint: "https://api.faceit.com/auth/v1/oauth/token"
    },
    (request, clientSettings) => {
      request.headers.set(
        "Authorization",
        "Basic " +
          base64url.encode(
            `${clientSettings.clientId}:${clientSettings.clientSecret}`
          )
      );
      return request;
    }
  );

  async function getAuthorizationUri(
    state: string,
    codeVerifier: string,
    options?: {
      scopes?: string[];
      extraParams?: Record<string, string>;
    }
  ): Promise<string> {
    const defaultScopes = ["profile", "email"];
    const authorizationUri = await client.getAuthorizationUri({
      redirectUri: clientOptions.redirectUri,
      state: state,
      scopes: ["openid", ...(options?.scopes ?? defaultScopes)],
      codeVerifier,
      extraParams: { redirect_popup: "true", ...options?.extraParams }
    });

    return authorizationUri;
  }

  async function verifyAuthorizationCode(
    code: string,
    codeVerifier: string
  ): Promise<FaceitTokenResponse> {
    const token = await client.verifyAuthorizationCode(
      code,
      clientOptions.redirectUri,
      { codeVerifier }
    );

    return token as FaceitTokenResponse;
  }

  async function refreshAccessToken(
    refreshToken: string,
    options?: { scopes?: string[] }
  ): Promise<FaceitTokenResponse> {
    const token = await client.refreshAccessToken(refreshToken, options);

    return token as FaceitTokenResponse;
  }

  return {
    getAuthorizationUri,
    verifyAuthorizationCode,
    refreshAccessToken
  };
}
