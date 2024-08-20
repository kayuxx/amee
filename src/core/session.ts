import { Decode, Encode } from "./jwt.ts";
import type { AmeeOptions } from "./amee.ts";
import type { JWTPayload } from "jose";

// The default expiration value for cookie in seconds is 30 Days.
const THIRTEEN_DAYS = 30 * 24 * 60 * 60;

export function initializeSession<SessionData>(
  options: AmeeOptions,
): initializeSessionResult<SessionData> {
  const cookieAttributes: CookieAttributes = {
    ...options.cookie,
    maxAge: options.maxAge ?? THIRTEEN_DAYS,
  };
  return {
    createBlankSession() {
      return {
        name: options.cookieName,
        value: "",
        options: cookieAttributes,
      };
    },
    async createSession(callback): Promise<AmeeSessionCookie> {
      // Pass an empty object to allow set these options.
      // The session property is of type `SessionData` (generic),
      // Expected to contain data. If it does not,
      // An error will be thrown indicating that the session must include data content.
      // If the token exceeds 4096 bytes, it means the session data is too large.
      // An error will be thrown to indicate this issue.
      // @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#data_storage}
      // The token property is of type `JWTClaimsMutable`, which allows modification, except for the `jti`, `exp`, and `iss` claims,
      // which are immutable as they are set when the data is encoded.
      const sessionData = callback({
        session: {} as SessionData,
        token: {} as JWTClaimsMutable,
      });

      if (Object.keys(sessionData.session!).length === 0) {
        throw new Error(
          "[Amee]: No session data was provided. Make sure the session contains data.",
        );
      }

      const params = {
        secret: options.secret,
        salt: options.salt!, // salt has a default value
        maxAge: options.maxAge!, // maxAge has a default value
        payload: { ...sessionData.session, ...sessionData.token },
      };

      const jweCompact = await Encode(params);
      return {
        value: jweCompact,
        name: options.cookieName,
        options: cookieAttributes,
      };
    },

    async validateSession(jwtToken) {
      const params = {
        secret: options.secret,
        salt: options.salt!, // salt has a default value
        jwtToken,
      };

      const JWTpayload = await Decode<SessionData>(params);
      if (!JWTpayload) return null;

      const { iat, iss, exp, aud, jti, nbf, sub, ...session } = JWTpayload;
      const ISOFormat = new Date(exp! * 1000).toISOString();
      return {
        session: {
          // user type exactly match the type that is provided
          user: session as SessionData,
          expires: ISOFormat,
        },
        // `jti`, `exp`, and `iat` are set and have values.
        // All other claims are either set to a value or `undefined`.
        // Claims with `undefined` values are not included in the token object.
        token: {
          iat: iat!,
          exp: exp!,
          jti: jti!,
          iss,
          aud,
          nbf,
          sub,
        },
      };
    },
  };
}

// Using `Pick` instead of `Omit` because it doesn't work as expected in this case.
// Additionally, `Pick` helps to eliminate the index signature from the type.
/**
 * Immutable JWT Claims, that cannot be modified.
 */
type JWTClaimsImmutable = Pick<JWTPayload, "jti" | "exp" | "iat">;
/**
 * Mutable JWT Claims, that can be modified.
 */
type JWTClaimsMutable = Pick<JWTPayload, "sub" | "nbf" | "iss" | "aud">;

// Merge JWT Claims types and make JWTClaimsImmutable readonly.
/**
 * Amee JWT Claims
 */
type AmeeJWTClaims =
  & Required<JWTClaimsImmutable>
  & {
    [K in keyof JWTClaimsMutable]: JWTClaimsMutable[K] | undefined;
  };

/**
 * the returned value from `createSession` and `createBlankSession`
 */
type AmeeSessionCookie = {
  name: string;
  value: string;
  options: CookieAttributes;
};

/**
 * `jti`, `exp`, and `isa` do indeed have values.
 * JWT mutable claims could be undefined.
 */

/**
 * the object that `validateSession` should return
 * @property session `{user: SessionData, expires: string}`
 * @property token `AmeeJWTClaims`
 */
type AmeeSession<SessionData> = Promise<
  {
    session: { user: SessionData; expires: string };
    token: AmeeJWTClaims;
  } | null
>;

/**
 * the `createSession` callback param type
 */
type SessionToken<S> = { session: S; token: JWTClaimsMutable };

export type CookieAttributesCore = Omit<CookieAttributes, "maxAge">;

/**
 * cookie attributes
 */
interface CookieAttributes {
  /**
   * Specifies the `Domain` attribute to define the domain that the cookie belongs to.
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#domain
   */
  domain?: string;

  /**
   * Specifies the `Path` attribute to define the path that must exist in the requested URL for the browser to send the cookie header.
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#path
   */
  path?: string;

  /**
   * Specifies the `Secure` attribute to indicate that the cookie should only be sent over HTTPS.
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#secure
   */
  secure?: boolean;

  /**
   * Specifies the `HttpOnly` attribute to prevent JavaScript from accessing the cookie.
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#httponly
   */
  httpOnly?: boolean;

  /**
   * Specifies the `Max-Age` attribute in seconds to define the lifetime of the cookie.
   * @default 30 * 24 * 60 * 60 // 30 DAYS
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#max-age
   */
  maxAge?: number;

  /**
   * Specifies the `SameSite` attribute to control whether the cookie is sent with cross-site requests.
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#samesite
   */
  sameSite?: "strict" | "lax" | "none";

  /**
   * Specifies the `Priority` attribute to indicate the priority of the cookie.
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#priority
   */
  priority?: "low" | "medium" | "high";
}

export interface initializeSessionResult<S> {
  /**
   * Get the Session and the Token Object from the given JWT Token
   * @param {string} jwtToken the JWT Token
   */
  validateSession: (jwtToken: string) => AmeeSession<S>;

  /**
   * Encode the payload and return the `AmeeSessionCookie`.
   * @param {(sessionToken: SessionToken<S>) => SessionToken<S>} callback Ensure it only returns the provided session data and avoid large token size.
   * @returns {}
   */
  createSession: (
    /**
     * The callback function used to
     * Return only the session data that is expected to be returned
     * Including unnecessary values in the session can increase the token size.
     * The browser has a limit on cookie size, which is typically 4096 bytes.
     * Data exceeding this length cannot be stored in cookies due to size limitations. @param {SessionToken<S>} sessionToken
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#data_storage}
     */
    callback: (sessionToken: SessionToken<S>) => SessionToken<S>,
  ) => Promise<AmeeSessionCookie>;
  createBlankSession: () => AmeeSessionCookie;
}
