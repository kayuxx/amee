import { Amee, type AmeeOptions } from "amee";

const options: AmeeOptions = {
  secret: process.env.AUTH_SECRET!,
  cookieName: "sessionId"
};

export type SessionData = {
  name: string;
  email: string;
  id: number;
  picture: string | null;
};

export const { createSession, createBlankSession, validateSession } =
  Amee<SessionData>(options);
