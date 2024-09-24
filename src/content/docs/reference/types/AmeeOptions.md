---
title: AmeeOptions
description: Simple and stateless library for managing sessions with JWT.
---

The Configuration options to initialize [Amee](/reference/functions/amee)

## Properties

```ts
secret: string | string[]
```

Used in combination with `salt`, to derive the encryption secret for JWT.

```ts
cookieName: string;
```

The Cookie name that is used to get the session and the cookie options.

```ts

salt?: string
```

Used in combination with `secret`, to derive the encryption secret for JWT.

```ts

maxAge?: number
```

Specifies the `Max-Age` attribute in seconds to define the lifetime of the cookie and the issued JWT.

- @default `30 * 24 * 60 * 60` // 30 DAYS

```ts
cookie?: CookieAttributesCore
```

Cookie attributes as key value pair.

## See Also

- [CookieAttributesCore](/reference/types/cookieattributescore)
- [maxAge Attribute](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#max-age)
- [Cookie Attributes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#attributes)
