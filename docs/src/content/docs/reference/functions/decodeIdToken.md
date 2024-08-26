---
title: decodeIdToken()
description: Simple and stateless library for managing sessions with JWT.
---

Decode the `id_token` to extract its payload and claims.

### Syntax

```ts
decodeIdToken(id_token);
```

### Parameters

```ts
id_token: string;
```

### Returns

```ts
JWTPayload;
```

### Example Usage

Extract the payload from the token and use it to create a session.

```ts
const token = await google.verifyAuthorizationCode(code, codeVerifier);
const userInfo = decodeIdToken(token.id_token);
// create a session
const sessionCookie = await createSession((sessionToken) => {
  // Ensure the fields you want to set are present.
  // Google’s payload includes these custom claims.
  sessionToken.session.name = userInfo.name as string;
  sessionToken.session.email = userInfo.email as string;
  return sessionToken;
});

// set the sessionId to the cookie
cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.options);
```

### See Also

- [createSession](/reference/functions/createblanksession)
- [Google Provider](/not_implemented_yet/)
