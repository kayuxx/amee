import { encode, decode } from "../core/jwt.ts";
import { expect, test } from "vitest";

const k1 = "secret_000";
const k2 = "secret_100";
const k3 = "secret_200";
const payload = {
  name: "John Doe"
};

test("should encode with the first secret from the secrets array", async () => {
  const jwtToken = await encode({ secret: [k1, k2], payload });
  const token = await decode({ secret: k1, jwtToken });

  expect(token?.name).toStrictEqual(payload.name);
});

test("should decode tokens that are encoded with different secrets", async () => {
  const jwtToken = await encode({ secret: k1, payload });
  const token = await decode({ secret: [k2, k1], jwtToken });

  expect(token?.name).toStrictEqual(payload.name);
});

test("should fail to decode if the decryption secret does not match the encryption secret", async () => {
  const jwtToken = await encode({ secret: k3, payload });
  const dc = () => decode({ secret: [k1, k2], jwtToken });

  await expect(dc).rejects.toThrowError(
    /The decryption key did not match the secret/
  );
});
