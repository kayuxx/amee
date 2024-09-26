import { Google, Github } from "amee/providers";

export const google = Google(
  process.env.AUTH_GOOGLE_CLIENT_ID!,
  process.env.AUTH_GOOGLE_CLIENT_SECRET!,
  {
    redirectUri: `${process.env.NEXT_BASE_URL}/oauth/callback/google`
  }
);

export const github = Github(
  process.env.AUTH_GITHUB_CLIENT_ID!,
  process.env.AUTH_GITHUB_CLIENT_SECRET!,
  {
    redirectUri: `${process.env.NEXT_BASE_URL}/oauth/callback/github`
  }
);
