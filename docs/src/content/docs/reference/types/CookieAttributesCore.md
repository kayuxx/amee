---
title: CookieAttributesCore
description: Simple and stateless library for managing sessions with JWT.
---

Cookie attributes as key value pair.

## Properties

```ts
domain?: string
```

Specifies the `Domain` attribute to define the domain that the cookie belongs to.

```ts
path?: string
```

Specifies the `Path` attribute to define the path that must exist in the requested URL for the browser to send the cookie header.

```ts
secure?: string
```

Specifies the `Secure` attribute to indicate that the cookie should only be sent over HTTPS.

```ts
httpOnly?: string
```

Specifies the `HttpOnly` attribute to prevent JavaScript from accessing the cookie.

```ts
sameSite?: string
```

Specifies the `SameSite` attribute to control whether the cookie is sent with cross-site requests.

```ts
priority?: string
```

Specifies the `Priority` attribute to indicate the priority of the cookie.

## See Also

- [Cookie Attributes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#attributes)
