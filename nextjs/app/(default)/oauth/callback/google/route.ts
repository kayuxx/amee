import { createSession } from "@/auth/index";
import { google } from "@/auth/providers";
import { decodeIdToken } from "amee";
import { OAuth2RequestError } from "amee";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const cookieState = cookies().get("state")?.value;
  const codeVerifier = cookies().get("code_verifier")?.value;
  if (!state || state !== cookieState || !codeVerifier || !code) {
    return Response.redirect(
      new URL("/error?message=Unauthorized", request.url),
    );
  }
  try {
    const token = await google.verifyAuthorizationCode(code, codeVerifier);
    // make sure that userInfo custom claims are actually exists
    // when decoding the id_token
    const userInfo = decodeIdToken(token.id_token);

    const sessionCookie = await createSession((sessionToken) => {
      sessionToken.session.id = userInfo.sub as unknown as number;
      sessionToken.session.name = userInfo.name as string;
      sessionToken.session.email = userInfo.email as string;
      sessionToken.session.picture = userInfo.picture as string;
      return sessionToken;
    });
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.options,
    );
    return Response.redirect(new URL("/", request.url));
  } catch (err) {
    if (err instanceof OAuth2RequestError) {
      return Response.redirect(
        new URL("/error?message=Bad Request", request.url),
        400,
      );
    }
    return Response.redirect(
      new URL("/error?message=Something went wrong", request.url),
      500,
    );
  }
}
