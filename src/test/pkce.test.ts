import { expect, test } from "vitest";
import {
  generateCodeChallange,
  generateRandomToken
} from "../oauth/client/lib.ts";

test("should genereate a random 32-byte base64url token", () => {
  const token = generateRandomToken();

  expect(token).toMatch(/^[A-Za-z0-9-_]/);
  expect(token.length).toBe(43);
});

test("should genereate a code challenge", async () => {
  const codeVerifier = "code_verifier_000";
  const expectedCodeChallenge = "pBSydY_Px0fT6YU_J7MMvGUNtv_HfcVdFc7KW6L8Bj8";

  await expect(
    generateCodeChallange(codeVerifier, "S256")
  ).resolves.toStrictEqual(expectedCodeChallenge);

  await expect(
    generateCodeChallange(codeVerifier, "plain")
  ).resolves.toStrictEqual(codeVerifier);
});
