---
title: Amee()
description: Simple and stateless library for managing sessions with JWT.
---

The `Amee` function initializes session-related functionality by setting up and verifying necessary configurations. It ensures that all session parameters are correctly configured.

### Syntax

```ts
Amee<SessionData>(options);
```

### Parameters

```ts
options: AmeeOptions;
```

The Configuration options.

### Returns

- [createSession](/reference/functions/createSession)
- [createBlankSession](/reference/functions/createBlankSession)
- [validateSession](/reference/functions/validateSession)

### Example Usage

```ts
const amee = Amee<SessionData>(options);
// or
const { createSession, validateSession } = Amee<SessionData>(options);
```
