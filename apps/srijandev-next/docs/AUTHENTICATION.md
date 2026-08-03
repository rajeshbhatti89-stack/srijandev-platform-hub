# Authentication Architecture

## Multi-Portal Session Governance

- **Authentication Provider**: `AuthContext.tsx` handles user sessions, tokens, and role switching.
- **Support**: Supabase Auth, Clerk, JWT, and OAuth providers (Google, GitHub, Microsoft Azure).
- **Features**:
  - Login / Signup / Forgot Password forms in `AuthModal.tsx`.
  - Multi-role active session simulator (`Super Admin` to `Guest`).
  - Remember Me persistence in LocalStorage.
