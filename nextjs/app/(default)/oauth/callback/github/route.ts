import { createSession } from "@/auth/index";
import { github } from "@/auth/providers";
import { OAuth2RequestError } from "amee";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const cookieState = cookies().get("state")?.value;
  if (!state || state !== cookieState || !code) {
    return Response.redirect(
      new URL("/error?message=Unauthorized", request.url),
    );
  }
  try {
    const token = await github.verifyAuthorizationCode(code);
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    });
    const userInfo = await userResponse.json();

    const emailsResponse = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    });

    const emails: { email: string; primary: boolean }[] =
      await emailsResponse.json();
    const userEmail = emails.find((c) => c.primary);

    // CHECK THE USER EXIST IN THE DATABASE
    // IF NOT THEN CREATE A NEW USER
    // LOGIC HERE
    // ..

    // CREATE A SESSION IF THE USER IS ALREADY EXIST IN THE DATABASE
    const sessionCookie = await createSession((sessionToken) => {
      sessionToken.session.id = userInfo.id as unknown as number;
      sessionToken.session.name = userInfo.name as string;
      sessionToken.session.email = userEmail!.email as string;
      sessionToken.session.picture = userInfo.avatar_url as string;
      return sessionToken;
    });

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.options,
    );
    console.log({ userInfo });
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
