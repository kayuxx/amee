# Amee

Amee is a TypeScript library designed for managing sessions with JWTs. It simplifies user authentication with a secure and easy-to-use approach.

## Features

- Easy to implement
- Fully typed
- Works in any runtime (Node.js, Deno, Bun, Couldflare Workers)

## Installation

```cmd
npm i amee
bun add amee
yarn add amee
pnpmm add amee
```

## Usage

```ts
const options: AmeeOptions = {
  secret: process.env.AUTH_SECRET,
  cookieName: "sessionId",
};

type SessionData = {
  name: string;
  email: string;
};

export const { createSession, validateSession, createBlankSession } =
  Amee<SessionData>(options);
```

## Resources

- **[JWT](https://jwt.io)**
- **[Documentation](https://github.com/kayuxx/amee)**(soon)

## Contribution

- We welcome contributions from everyone! Whether you're fixing a bug, adding a feature, or improving documentation, your help is appreciated.
