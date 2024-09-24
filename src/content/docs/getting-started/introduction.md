---
title: Introduction
description: A Basic intro to Amee.
---

Amee is a TypeScript library designed for managing sessions with JWTs. It simplifies user authentication with a secure and easy-to-use approach.

- Easy to implement
- Fully typed
- Works in any runtime (Node.js, Deno, Bun, Couldflare Workers)

```ts
const options: AmeeOptions = {
  secret: process.env.AUTH_SECRET,
  cookieName: "sessionId",
};

type SessionData = {
  name: string;
  email: string;
};

export const amee = Amee<SessionData>(options);
```

> Version 1.0.0 has just been released.
