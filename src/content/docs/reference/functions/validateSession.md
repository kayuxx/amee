---
title: validateSession()
description: Simple and stateless library for managing sessions with JWT.
---

The `validateSession` function returns from [Amee](/reference/functions/amee), used to get the session and the token object from the given JWT Token.

### Syntax

```ts
validateSession(token);
```

### Parameters

```ts
token: string;
```

The JWT token

### Returns

```ts
Promise<AmeeSession<SessionData>>;
```

The Amee session object.

### Example Usage

```ts
const session = validateSession(token);
```

### See Also

- [SessionToken](/reference/types/sessioncookie)
- [Cookie Data Storage](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#data_storage)
