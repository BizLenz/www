# Onboarding Guide

This guide will get you a running development environment.

## Prerequisites

You need **one** of the following setups:

### Option A: Nix (Recommended)

If you have [Nix](https://nixos.org/download/) installed with flakes enabled,
everything is provisioned automatically:

```bash
nix develop
```

This gives you Bun, Node.js, and a local PostgreSQL instance — no manual
installation needed.

The shell hook automatically initializes a project-local PostgreSQL data
directory (`.pg/`) and creates a `bizlenz` database.

### Option B: Manual Setup

Install the following manually:

- **Bun** (latest) —
  [bun.sh/docs/installation](https://bun.sh/docs/installation)
- **Node.js** (>= 20) — required by some tooling
- **PostgreSQL** (>= 15) —
  [postgresql.org/download](https://www.postgresql.org/download/)

Create a database for the project:

```bash
createdb bizlenz
```

## Install Dependencies

```bash
bun install
```

## Environment Configuration

Copy the example below into a `.env.local` file at the project root:

```env
# Better Auth
BETTER_AUTH_SECRET="your-random-secret-string"
BETTER_AUTH_URL="http://localhost:3000"

# Database
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/bizlenz"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Backend API
NEXT_PUBLIC_API_BASE_URL="http://localhost:8000"

# Optional
# FASTAPI_JWT_SECRET="shared-secret-with-backend"
```

All variables are validated at startup by [`src/env.js`](../src/env.js) using
Zod.

If a required variable is missing, the app will fail to start with a clear error
message. You can set `SKIP_ENV_VALIDATION=true` to bypass validation (useful for
build-only steps in CI).

### Generating `BETTER_AUTH_SECRET`

Use any random string generator:

```bash
openssl rand -base64 32
```

## Google OAuth Setup

1. Go to the
   [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project (or select an existing one)
3. Navigate to **APIs & Services > Credentials**
4. Click **Create Credentials > OAuth client ID**
5. Select **Web application** as the application type
6. Add the following:
   - **Authorized JavaScript origins**: `http://localhost:3000`
   - **Authorized redirect URIs**:
     `http://localhost:3000/api/auth/callback/google`
7. Copy the **Client ID** and **Client Secret** into your `.env.local`

## Running the Dev Server

```bash
bun dev
```

This starts Next.js in development mode with Turbopack. The app will be
available at [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command                | Description                               |
| ---------------------- | ----------------------------------------- |
| `bun dev`              | Start dev server (Turbopack)              |
| `bun run build`        | Production build                          |
| `bun start`            | Start production server                   |
| `bun run preview`      | Build + start (combined)                  |
| `bun test`             | Run tests (Bun test runner)               |
| `bun run lint`         | Lint with ESLint                          |
| `bun run lint:fix`     | Lint and auto-fix                         |
| `bun run format`       | Format with Prettier (write)              |
| `bun run format:check` | Check formatting without writing          |
| `bun run typecheck`    | TypeScript type checking (`tsc --noEmit`) |
| `bun run check`        | Lint + typecheck combined                 |

## Troubleshooting

### `env validation failed`

You're missing required environment variables. Check that your `.env.local` file
exists and contains all required variables listed above.

### PostgreSQL connection refused

- **Nix users**: Make sure you entered the shell with `nix develop`. The
  PostgreSQL server starts automatically. Check `pg_ctl status` and restart with
  `pg_ctl start -l .pg/postgresql.log` if needed.
- **Manual setup**: Ensure PostgreSQL is running and the `DATABASE_URL` in
  `.env.local` is correct.

### Google OAuth redirect error

Verify that your Google Cloud Console redirect URI matches exactly:
`http://localhost:3000/api/auth/callback/google`. Trailing slashes or mismatched
protocols will cause failures.

### Port 3000 already in use

Another process is using port 3000. Either stop it or run on a different port:

```bash
bun dev --port 3001
```

Remember to update `BETTER_AUTH_URL` accordingly.

### `bun install` fails with native module errors

Some dependencies (e.g. `better-sqlite3`) include native bindings. Ensure you
have a C/C++ toolchain installed. On Ubuntu/Debian:
`sudo apt install build-essential`. Nix users get this automatically.
