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
   * The provider base URL.
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
   * The method used to encode the `code_challenge` in the PKCE flow.
   * @default S256
   */
  codeChallengeMethod?: "S256" | "plain";
  /**
   * A hard-to-guess random string used to verify the code challenge in the PKCE flow.
   */
  readonly codeVerifier?: string;
  /**
   * The permissions or access levels requested.
   */
  readonly scopes?: string[];
  /**
   * The URI to which users are redirected after authentication.
   */
  readonly redirectUri: string;
  /**
   * Additional search parameters that are added to the `authorizationUri`.
   */
  readonly extraParams?: Record<string, string> | undefined;
}

/**
 * The standard OAuth2 token response.
 */
export interface OAuth2TokenResponse {
  /**
   * A token used to access protected resources on behalf of the user.
   */
  access_token: string;
  /**
   * The type of token issued. Typically "Bearer".
   */
  token_type: string | undefined;
  /**
   * The number of seconds until the access token expires.
   */
  expires_in: number | undefined;
  /**
   * The refresh token used to obtain a new access token.
   */
  refresh_token: string | undefined;
  /**
   * The permissions or access levels requested.
   */
  scope: string | undefined;
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
}

export class OAuth2Client {
  private settings: ClientSettings;

  constructor(gSettings: ClientSettings) {
    if (gSettings.tokenHost) {
      gSettings.tokenEndpoint = gSettings.tokenHost + gSettings.tokenEndpoint;
      gSettings.authorizationEndpoint =
        gSettings.tokenHost + gSettings.authorizationEndpoint;
    }

    this.settings = gSettings;
  }

  public async getAuthorizationUri(
    options: OAuth2WebFlowParams
  ): Promise<string> {
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
        options.codeChallengeMethod
      );
      authorizationUri.searchParams.set("code_challenge", codeChallenge);
      authorizationUri.searchParams.set(
        "code_challenge_method",
        options.codeChallengeMethod
      );
    }

    if (options.extraParams) {
      for (const name in options.extraParams) {
        const value = options.extraParams[name];
        if (value) {
          authorizationUri.searchParams.set(name, value);
        }
      }
    }

    return authorizationUri.toString();
  }

  public async verifyAuthorizationCode<
    TokenResponse extends OAuth2TokenResponse
  >(
    code: string,
    redirectUri: string,
    options?: Pick<OAuth2WebFlowParams, "codeVerifier">
  ): Promise<TokenResponse> {
    const body = new URLSearchParams();
    body.set("grant_type", "authorization_code");
    body.set("client_id", this.settings.clientId);
    body.set("client_secret", this.settings.clientSecret);
    body.set("code", code);
    body.set("redirect_uri", redirectUri);

    if (options?.codeVerifier) {
      body.set("code_verifier", options.codeVerifier);
    }
    return await this.request(body);
  }

  private async request<TokenResponse extends OAuth2TokenResponse>(
    body: URLSearchParams
  ): Promise<TokenResponse> {
    const headers = new Headers();
    headers.set("Content-Type", "application/x-www-form-urlencoded");
    headers.set("Accept", "application/json");

    const request = new Request(this.settings.tokenEndpoint, {
      method: "POST",
      headers,
      body
    });

    const response = await fetch(request);
    // The result could either be an error or the actual token response
    const responseBody: OAuth2ErrorResponse | TokenResponse =
      await response.json();

    // Whether the authorization server indicates that something is wrong with the request
    // typically a 400 (Bad Request) status.
    if (!response.ok) {
      if ("error" in responseBody) {
        throw new OAuth2RequestError(request, responseBody);
      }
      throw new OAuth2RequestError(request);
    } else if (!("access_token" in responseBody)) {
      throw new OAuth2RequestError(request, responseBody);
    }

    return responseBody;
  }

  public async refreshAccessToken<TokenResponse extends OAuth2TokenResponse>(
    refreshToken: string,
    options?: Pick<OAuth2WebFlowParams, "scopes">
  ): Promise<TokenResponse> {
    const body = new URLSearchParams();
    body.set("grant_type", "refresh_token");
    body.set("refresh_token", refreshToken);
    body.set("client_id", this.settings.clientId);
    body.set("client_secret", this.settings.clientSecret);

    if (options?.scopes) {
      body.set("scope", options.scopes.join(" "));
    }
    return await this.request(body);
  }
}

/**
 * This Error provides details about the request that was made.
 * @see https://www.ietf.org/archive/id/draft-parecki-oauth-first-party-apps-00.html#section-5.2.3
 */
export class OAuth2RequestError extends Error {
  public readonly error: string | null;
  public readonly error_uri?: string | null;
  public request: Request;
  constructor(request: Request, body?: OAuth2ErrorResponse) {
    super(body?.error_description ?? "");
    this.error = body?.error ?? null;
    this.error_uri = body?.error_uri ?? null;
    this.request = request;
  }
}
