---
title: createSession()
description: Simple and stateless library for managing sessions with JWT.
---

The `createSession` function returns from [Amee](/reference/functions/amee), used to create the user session.

### Syntax

```ts
createSession((sessionToken) => sessionToken);
```

### Parameters

```ts
callback: (sessionToken: SessionToken) => SessionToken;
```

The callback function is designed to return only the session data that is expected. Including unnecessary values in the session can increase the token size. If the session data is empty and not set, an error will be thrown.

Browsers have a cookie size limit, typically 4096 bytes. Data exceeding this limit cannot be stored in cookies. If the data exceeds this size, an error will be thrown indicating this issue.

### Returns

```ts
Promise<AmeeSessionCookie>;
```

The Amee session cookie.

### Example Usage

You can set the session data as needed for your application.

```ts
const sessionCookie = createSession((sessionToken) => {
  sessionToken.session.name = "John Doe";
  return sessionToken;
});
```

Along with the session, you can also set the JWT claims using the `token` field.

```ts
const sessionCookie = createSession((sessionToken) => {
  sessionToken.token.iss = "Amee";
  return sessionToken;
});
```

### See Also

- [SessionToken](/reference/types/sessiontoken)
- [Cookie Data Storage](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#data_storage)
