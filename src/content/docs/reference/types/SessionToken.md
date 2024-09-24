---
title: SessionToken
description: Simple and stateless library for managing sessions with JWT.
---

The session token type for the [createSession](/reference/functions/createsession) callback.

## Properties

```ts
session?: SessionData;
```

The type that should be passed to [Amee](/reference/functions/amee) as generic.

```ts
token?: JWTClaimsMutable;
```

Mutable JWT claims that can be modified.

## See Also

- [JWTClaimsMutable](/reference/types/jwtcliamsmutable)
