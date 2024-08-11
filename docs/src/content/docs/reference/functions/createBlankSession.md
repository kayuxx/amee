---
title: createBlankSession()
description: Simple and stateless library for managing sessions with JWT.
---

The `createBlankSession` function returns from [Amee](/reference/functions/amee), used to get the token, destroy or save the session.

### Syntax

```ts
createBlankSession();
```

### Parameters

**NONE**

### Returns

```ts
AmeeSessionCookie;
```

The Amee session cookie.

### Example Usage

```ts
const blankSession = createBlankSession();
```

### See Also

- [AmeeSessionCookie](/reference/types/ameesessioncookie)
