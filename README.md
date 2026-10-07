# Principia

The Architecture:

```
Browser (Client)          Nuxt Server               Moleculer Backend
    │                         │                            │
    ├─ login() ──────────────>│                            │
    │                         ├─ call('v1.Auth.login') ───>│
    │                         │<── returns user data ──────┤
    │                         ├─ setCookie(tokenKey) ──────┤ (secure, httpOnly)
    │<── returns user data ───┤
    ├─ update Pinia store
    │
    ├─ Future requests ───────>│
    │                         ├─ reads cookie ─────────────┤ (auto-included)
    │                         ├─ moleculer.call() ─────────>│ (with tokenKey)
```
