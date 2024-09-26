import { createBlankSession } from "@/app/auth";
import { verifyMagicLink } from "@/app/lib/magicLink";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tokenParam = searchParams.get("token");
  if (!tokenParam)
    return Response.json({ message: "No Token Provided" }, { status: 400 });
  const cookieStore = cookies();
  const blankSession = createBlankSession();
  try {
    const token = verifyMagicLink(tokenParam);
    cookieStore.set(blankSession.name, token, blankSession.options);
    return Response.redirect(new URL("/", request.url));
  } catch (e) {
    if (e instanceof Error) {
      return Response.json({ message: e.message }, { status: 401 });
    }
    return Response.json({ message: "something went wrong" }, { status: 401 });
  }
}
