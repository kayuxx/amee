---
title: generateRandomToken()
description: Simple and stateless library for managing sessions with JWT.
---

Generate a secure random token. This token is used to create random strings for the state and code_verifier parameters in the OAuth2 Authorization Code flow.

### Syntax

```ts
generateRandomToken();
```

### Parameters

**NONE**

### Returns

```ts
string;
```

### Example Usage

```ts
const blankSession = createBlankSession();
const state = generateRandomToken();

cookies().set("google_oauth_state", state, blankSession.options);
```

### See Also

- [createBlankSession](/reference/functions/createblanksession)
