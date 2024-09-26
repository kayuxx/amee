import { NextResponse, NextRequest } from "next/server";
import { getSession } from "@/app/actions/session";

const PROTECTED_ROUTES = ["/protected-route"];
const PUBLIC_ROUTES = ["/signin", "/magic-link"];

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const isAuthenticated = !!session?.user;

  // If the user is authenticated, continue as normal
  if (isAuthenticated) {
    // Redirect to the home page when accessing public routes
    if (PUBLIC_ROUTES.includes(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Redirect to the home page when accessing protected routes
  if (PROTECTED_ROUTES.includes(request.nextUrl.pathname)) {
    // Redirect to login page if not authenticated
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // otherwise continue as normal
  return NextResponse.next();
}

// The matcher from Clerck documentation
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)"
  ]
};
