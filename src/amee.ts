import { type CookieAttributesCore, initializeSession } from "./session.ts";
import { getOptions } from "./utils.ts";

export function Amee<SessionData>(options: AmeeOptions) {
  const derivedOptions = getOptions(options);
  const sessionUtils = initializeSession<SessionData>(derivedOptions);
  return sessionUtils;
}

export interface AmeeOptions {
  /**
   * The secret key should be specified in the options
   * Used in combination with `salt`, to derive the encryption secret for JWT.
   */
  secret: string;
  /**
   * Used in combination with `secret`, to derive the encryption secret for JWT.
   */
  salt?: string;
  /**
   * Specifies the `Max-Age` attribute in seconds to define the lifetime of the cookie and the issued JWT.
   * @default 30 * 24 * 60 * 60 // 30 DAYS
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#max-age
   */
  maxAge?: number;
  /**
   * The Cookie name that is used to get the session and the cookie options
   */
  cookieName: string;
  /**
   * cookie attributes as key value pair
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#attributes
   */
  cookie?: CookieAttributesCore;
}
