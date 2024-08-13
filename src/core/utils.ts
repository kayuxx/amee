import type { CookieAttributesCore } from "./session.ts";
import type { AmeeOptions } from "./amee.ts";

/**
 * The default options of the cookie attributes
 * @see https://developer.mozilla.org/en-US/docs/Web/Security/Practical_implementation_guides/Cookies
 */
const defaultCookieAttributes: Required<
  Pick<CookieAttributesCore, "httpOnly" | "secure" | "sameSite" | "path">
> = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production" || false,
  sameSite: "lax",
  path: "/",
};

export function getOptions(options: AmeeOptions): AmeeOptions {
  if (!options.secret) {
    throw new Error("[Amee] Usage Error: Missing Secret Key");
  }

  if (!options.cookieName) {
    throw new Error("[Amee] Usage Error: Missing Cookie Name");
  }

  if (!options.cookie) {
    options.cookie = defaultCookieAttributes;
    return options;
  }

  // Return only the specified attributes, and ensure no others are included.
  const { httpOnly, domain, path, secure, priority, sameSite } = options.cookie;

  options.cookie = {
    httpOnly: httpOnly ?? defaultCookieAttributes.httpOnly,
    path: path ?? defaultCookieAttributes.path,
    secure: secure ?? defaultCookieAttributes.secure,
    sameSite: sameSite ?? defaultCookieAttributes.sameSite,
    ...(domain && { domain }),
    ...(priority && { priority }),
  };

  return options;
}
