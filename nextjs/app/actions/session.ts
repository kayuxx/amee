"use server";

import { cookies } from "next/headers";
import { createBlankSession, validateSession } from "@/auth/index";

const blankSession = createBlankSession();

export async function getToken(): Promise<string> {
  const cookieName = blankSession.name;
  return cookies().get(cookieName)?.value ?? "";
}

export async function getSession() {
  const token = await getToken();
  const session = await validateSession(token);
  return session?.session ?? null;
}

// We should infer the type of `getSession`
// since we're going to use it to get the session on our Application
export type AmeeSession = Awaited<ReturnType<typeof getSession>>;

export async function logout() {
  const cookieName = blankSession.name;
  cookies().delete(cookieName);
}
