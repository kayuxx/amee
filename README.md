# Amee

Amee is a TypeScript library designed for managing sessions with JWTs. It simplifies user authentication with a secure and easy-to-use approach.

## Features

- Easy to implement
- Fully typed
- Works in any runtime (Node.js, Deno, Bun, Couldflare Workers)

## Installation

| npm                    | bun                       | yarn                       | pnpm                       |
| ---------------------- | ------------------------- | -------------------------- | -------------------------- |
| <pre>`npm i amee</pre> | <pre>`bun add amee`</pre> | <pre>`yarn add amee`</pre> | <pre>`pnpm add amee`</pre> |

## Usage

```ts
const options: AmeeOptions = {
  secret: process.env.AUTH_SECRET,
  cookieName: "sessionId"
};

type SessionData = {
  name: string;
  email: string;
};

export const amee = Amee<SessionData>(options);
```

## Resources

- **[JWT](https://jwt.io)**
- **[OAuth](https://www.oauth.com)**
- **[Documentation](https://amee-auth.vercel.app)**
