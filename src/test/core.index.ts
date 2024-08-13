import { Amee, type AmeeOptions } from "core/amee.ts";
import { expect, test } from "vitest";

const ameeOptions: AmeeOptions = {
  salt: "salt",
  secret: "secret",
  cookieName: "cookieName",
  cookie: {
    httpOnly: true,
    secure: false,
  },
};

function generateRandomData(count: number): { [key: string]: unknown } {
  const data: { [key: string]: unknown } = {};
  for (let i = 0; i < count; i++) {
    const key = `key${i}`;
    data[key] = i;
  }
  return data;
}

type SessionData = {
  name: string;
};

const largeData = generateRandomData(235);

test("should throw an error if secret is missing", async () => {
  function initializeAmeeSession() {
    return Amee<SessionData>({
      cookieName: ameeOptions.cookieName,
    } as AmeeOptions);
  }

  expect(() => initializeAmeeSession()).toThrowError(/Missing Secret Key/);
});

test("should throw an error if cookie name is missing", () => {
  function initializeAmeeSession() {
    return Amee<SessionData>({ secret: ameeOptions.secret } as AmeeOptions);
  }

  expect(() => initializeAmeeSession()).toThrowError(/Missing Cookie Name/);
});

test("should not throw an error if secret and cookieName is present", () => {
  function initializeAmeeSession() {
    return Amee<SessionData>(ameeOptions as AmeeOptions);
  }
  expect(() => initializeAmeeSession()).does.not.toThrowError();
});

test("should return the default cookie if no cookie options is provided", async () => {
  const ameeCookie = {};

  function createUserSession() {
    const { createSession } = Amee<SessionData>({
      ...ameeOptions,
      cookie: ameeCookie,
    } as AmeeOptions);

    return createSession((session) => {
      session.session.name = "John Doe";
      return session;
    });
  }
  const cookieOptions = await createUserSession();

  expect(cookieOptions.options).not.toEqual(ameeCookie);
});

test("should throws an error if there's no session data", async () => {
  function createUserSession() {
    const { createSession } = Amee<SessionData>(ameeOptions as AmeeOptions);
    return createSession((sessionToken) => sessionToken);
  }
  await expect(() => createUserSession()).rejects.toThrowError(
    /No session data was provided/,
  );
});

test("should throws an error if token exceeded 4096 bytes", async () => {
  function createUserSession() {
    const { createSession } = Amee<{ data: object }>(
      ameeOptions as AmeeOptions,
    );
    return createSession((sessionToken) => {
      sessionToken.session.data = largeData;
      return sessionToken;
    });
  }

  await expect(() => createUserSession()).rejects.toThrowError(
    /JWT length is too large/,
  );
});

test("should return the correct session cookie object", async () => {
  async function createUserSession() {
    const { createSession } = Amee<SessionData>(ameeOptions as AmeeOptions);

    return await createSession((sessionToken) => {
      sessionToken.session.name = "John Doe";
      return sessionToken;
    });
  }

  const cookieOptions = await createUserSession();
  expect(cookieOptions).toHaveProperty("name", ameeOptions.cookieName);
  expect(cookieOptions).toHaveProperty("value");
  expect(cookieOptions).toHaveProperty("options");

  const expectedCookieOptions = {
    ...ameeOptions.cookie,
    // Default to 30 days if no maxAge option is provided
    maxAge: cookieOptions.options.maxAge,
  };

  expect(cookieOptions.options).toEqual(expectedCookieOptions);
});

test("should return null if no jwt token is provided", async () => {
  const { validateSession } = Amee<SessionData>(ameeOptions as AmeeOptions);

  await expect(validateSession("")).resolves.toBeNull();
});

test("should return the correct sessionToken object", async () => {
  async function validateUserSession() {
    const { validateSession, createSession } = Amee<SessionData>(
      ameeOptions as AmeeOptions,
    );
    const sessionCookie = await createSession((sessionToken) => {
      sessionToken.session.name = "John Doe";
      return sessionToken;
    });
    const jwe = sessionCookie.value;
    return validateSession(jwe);
  }

  const sessionToken = await validateUserSession();
  expect(sessionToken).toHaveProperty("session");
  expect(sessionToken).toHaveProperty("token");

  const ISOStringRegex =
    /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(\.[0-9]+)?(Z|[+-](?:2[0-3]|[01][0-9]):[0-5][0-9])?$/;

  expect(sessionToken?.session.expires).toMatch(ISOStringRegex);
  expect(sessionToken?.token.exp).not.toBeFalsy();
  expect(sessionToken?.token.iat).not.toBeFalsy();
  expect(sessionToken?.token.jti).not.toBeFalsy();
});
