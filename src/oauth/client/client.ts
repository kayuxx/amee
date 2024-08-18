import { generateCodeChallange } from "./lib.ts";

interface ClientSettings {
  /**
   * The client ID you received from the provider.
   */
  readonly clientId: string;
  /**
   * The client secret you received from the provider.
   */
  readonly clientSecret: string;
  /**
   * The enterprise-specific domain of the provider.
   * If specified, it will be used in combination with the `authorizationEndpoint`
   * and `tokenEndpoint` to derive the full path.
   */
  readonly tokenHost?: string;
  /**
   * The endpoint for retrieving the authorization code.
   */
  authorizationEndpoint: string;
  /**
   * The endpoint for exchanging the authorization code for an access token.
   */
  tokenEndpoint: string;
}

interface OAuth2WebFlowParams {
  /**
   * A hard-to-guess random string used to maintain state and prevent CSRF.
   */
  readonly state?: string;
  /**
   * the method used to encode the `code_challenge` in the PKCE flow.
   * @default S256
   */
  codeChallengeMethod?: "S256" | "plain";
  /**
   * A hard-to-guess random string used to verify the code challenge in the PKCE flow.
   */
  readonly codeVerifier?: string;
  /*
   * The permissions or access levels requested.
   */
  readonly scopes?: string[];
  /**
   * The URI to which users are redirected after authentication.
   */
  readonly redirectUri: string;
}

export interface OAuth2TokenResponseBody {
  /*
   * A token used to access protected resources on behalf of the user.
   */
  access_token: string;
  // Additional fields in the response format returned by the authorization server
  [K: string]: unknown;
}

/**
 * The OAuth2 Error Response
 * For additional details
 * @see https://www.ietf.org/archive/id/draft-parecki-oauth-first-party-apps-00.html#section-5.2.3
 */
export interface OAuth2ErrorResponse {
  /**
   * Error code
   */
  error: string;
  /**
   * Additional information about the error that occured
   */
  error_description?: string;
  /**
   * A URI identifying a web page with information about the error
   */
  error_uri?: string;
  /**
   * Additional details about the user session
   */
  auth_session?: object;
}

export type AuthCodeOptions = Pick<
  OAuth2WebFlowParams,
  "codeVerifier" | "redirectUri"
>;

export type RefreshTokenOptions = Pick<OAuth2WebFlowParams, "scopes">;

export class OAuth2Client {
  private settings: ClientSettings;
  constructor(gSettings: ClientSettings) {
    if (gSettings.tokenHost) {
      gSettings.tokenEndpoint = gSettings.tokenHost + gSettings.tokenEndpoint;
      gSettings.authorizationEndpoint = gSettings.tokenHost +
        gSettings.authorizationEndpoint;
    }

    this.settings = gSettings;
  }

  public async getAuthorizationUri(options: OAuth2WebFlowParams) {
    options.codeChallengeMethod = options.codeChallengeMethod ?? "S256";
    const authorizationUri = new URL(this.settings.authorizationEndpoint);
    authorizationUri.searchParams.set("client_id", this.settings.clientId);
    authorizationUri.searchParams.set("response_type", "code");
    authorizationUri.searchParams.set("redirect_uri", options.redirectUri);

    if (options.scopes) {
      authorizationUri.searchParams.set("scope", options.scopes.join(" "));
    }
    if (options.state) {
      authorizationUri.searchParams.set("state", options.state);
    }
    if (options.codeVerifier) {
      const codeChallenge = await generateCodeChallange(
        options.codeVerifier,
        options.codeChallengeMethod,
      );
      authorizationUri.searchParams.set("code_challenge", codeChallenge);
      authorizationUri.searchParams.set(
        "code_challenge_method",
        options.codeChallengeMethod,
      );
    }
    return authorizationUri;
  }

  public async verifyAuthorizationCode(code: string, options: AuthCodeOptions) {
    const body = new URLSearchParams();
    body.set("grant_type", "authorization_code");
    body.set("client_id", this.settings.clientId);
    body.set("client_secret", this.settings.clientSecret);
    body.set("code", code);
    body.set("redirect_uri", options.redirectUri);

    if (options?.codeVerifier) {
      body.set("code_verifier", options.codeVerifier);
    }
    return await this.request(body);
  }

  private async request(
    body: URLSearchParams,
  ): Promise<OAuth2TokenResponseBody> {
    const headers = new Headers();
    headers.set("Content-Type", "application/x-www-form-urlencoded");
    headers.set("Accept", "application/json");

    const request = new Request(this.settings.tokenEndpoint, {
      method: "POST",
      headers,
      body,
    });

    const response = await fetch(request);
    // The result could either be an error or the actual token response
    const responseBody: OAuth2ErrorResponse | OAuth2TokenResponseBody =
      await response.json();
    if ("error" in responseBody && !("access_token" in responseBody)) {
      throw new OAuth2ResponseError(response, responseBody);
    } // Whether the authorization server responds with HTTP (400 BAD Request)
    else if (!response.ok) {
      console.warn();
      throw new Error("The Auth server is not okay", { cause: response });
      // throw new OAuth2ResponseError(response);
    }

    return responseBody;
  }

  public async refreshAccessToken(
    refreshToken: string,
    options?: RefreshTokenOptions,
  ): Promise<OAuth2TokenResponseBody> {
    if (!refreshToken) {
      throw new Error(
        `[Amee] "refreshToken" is required to refresh the "access_token"`,
      );
    }
    const body = new URLSearchParams();
    body.set("grant_type", "refresh_token");
    body.set("refresh_token", refreshToken);
    body.set("client_id", this.settings.clientId);
    if (options?.scopes) {
      body.set("scope", options.scopes.join(" "));
    }
    return await this.request(body);
  }
}

/**
 * This Error provides details about the HTTP response.
 * @see https://www.ietf.org/archive/id/draft-parecki-oauth-first-party-apps-00.html#section-5.2.3
 */
class OAuth2ResponseError extends Error {
  public readonly error: string | null;
  public readonly error_uri?: string | null;
  public readonly auth_session: object | null;
  public response: Response;
  constructor(response: Response, body?: OAuth2ErrorResponse) {
    super(body?.error_description ?? "");
    this.error = body?.error ?? null;
    this.error_uri = body?.error_uri ?? null;
    this.auth_session = body?.auth_session ?? null;
    this.response = response;
  }
}
