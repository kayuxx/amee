import { github, google } from "@/auth/providers";
import { generateRandomToken } from "amee";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const provider = searchParams.get("provider");
  if (!provider)
    return Response.redirect(
      new URL("/error?message=Bad Request", req.url),
      400
    );
  const state = generateRandomToken();
  const codeVerifier = generateRandomToken();
  let authorizationUri: string;

  switch (provider) {
    case "google":
      authorizationUri = await google.getAuthorizationUri(state, codeVerifier);
      break;
    case "github":
      authorizationUri = await github.getAuthorizationUri(state);
      break;
    default:
      return Response.redirect(
        new URL("/error?message=Unsupported Provider", req.url),
        400
      );
  }

  const cookieOptions = {
    httpOnly: true,
    sameSite: true,
    maxAge: Math.floor(Date.now() / 1000) + 5 * 60 // 5 minutes
  };

  cookies().set("state", state, cookieOptions);
  cookies().set("code_verifier", codeVerifier, cookieOptions);

  return Response.redirect(authorizationUri);
}
