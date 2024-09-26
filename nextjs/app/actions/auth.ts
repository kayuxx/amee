"use server";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { createSession } from "@/auth/index";
import { getSession } from "./session";
import { generateMagicLink } from "../lib/magicLink";

type State = {
  message: string;
  token?: string;
};

// Just for test
const getUser = async (password: string | null, email: string) => ({
  name: email.split("@")[0],
  id: Math.round(Math.random() * 1000) * 2,
  email,
  password: await bcrypt.hash(password ?? "somepassword", 10)
});

export async function signWithCredentials(formData: FormData) {
  // USER CREDENTIALS
  const credentials = {
    email: formData.get("email") as string,
    password: formData.get("password") as string
  };
  const user = await getUser(credentials.password, credentials.email);
  const sessionCookie = await createSession((sessionToken) => {
    sessionToken.session.name = user.name;
    sessionToken.session.email = user.email;
    sessionToken.session.id = user.id;
    sessionToken.session.picture = null;
    return sessionToken;
  });
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.options);

  redirect("/");
}

export async function signWithMagicLink(prevState: State, formData: FormData) {
  // USER CREDENTIALS
  const credentials = {
    email: formData.get("email") as string
  };

  try {
    const user = await getUser(null, credentials.email);
    const sessionCookie = await createSession((sessionToken) => {
      sessionToken.session.name = user.name;
      sessionToken.session.email = user.email;
      sessionToken.session.id = user.id;
      sessionToken.session.picture = null;
      return sessionToken;
    });

    return {
      token: generateMagicLink(sessionCookie.value, 5), // expires in 5 minutes
      message: "Success"
    };
  } catch (err) {
    if (err instanceof Error) {
      return { message: err.message };
    }
    return { message: "something went wrong" };
  }
}

export async function signWith(provider: string) {
  redirect(`/oauth?provider=${provider}`);
}

export async function updateEmail(_prevState: State, formData: FormData) {
  const newEmail = formData.get("email") as string;
  const currentSession = (await getSession())?.user;
  if (!currentSession) return { message: "" };
  // UPDATE THE USER EMAIL ON THE DATABASE
  // LOGIC HERE
  // ...
  // THEN CREATE A SESSION
  const sessionCookie = await createSession((sessionToken) => {
    sessionToken.session.name = currentSession.name;
    sessionToken.session.email = newEmail;
    sessionToken.session.id = currentSession.id;
    sessionToken.session.picture = currentSession.picture ?? null;
    return sessionToken;
  });

  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.options);

  // revaliadate the cache
  // revalidatePath("/");
  return {
    message: "Email updated!"
  };
}

export async function authenticateWithMagicLink(token: string) {
  // revalidte the cache
  // revalidatePath("/");
  redirect(`/api/verify-magic-link?token=${token}`);
}
