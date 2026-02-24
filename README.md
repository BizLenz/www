<p align="center">
  <picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/BizLenz/.github/refs/heads/main/assets/logo/logo_dark.svg">
  <img src="https://raw.githubusercontent.com/BizLenz/.github/refs/heads/main/assets/logo/logo_light.svg" width="130" alt="Logo for BizLenz">
</picture>
</p>

<h1 align="center">
  BizLenz
</h1>

<p align="center">
  AI-powered business proposal analysis tool for the web
</p>

<p align="center">
  <a href="https://github.com/BizLenz/www/actions/workflows/ci.yml">
    <img src="https://github.com/BizLenz/www/actions/workflows/ci.yml/badge.svg" alt="CI Pipeline" />
  </a>
</p>

> BizLenz는 과학기술정보통신부 대학디지털교육역량강화사업의 지원을 통해 수행한
> 한이음 드림업 프로젝트 결과물입니다.

## www

Frontend for BizLenz.

### Tech Stack

| Category     | Technology                                                 |
| ------------ | ---------------------------------------------------------- |
| Framework    | [Next.js 15](https://nextjs.org/) (App Router)             |
| UI Library   | [React 19](https://react.dev/)                             |
| Auth         | [Better Auth](https://www.better-auth.com/) + Google OAuth |
| State        | [Zustand](https://zustand.docs.pmnd.rs/)                   |
| Components   | [shadcn/ui](https://ui.shadcn.com/) (New York)             |
| Styling      | [Tailwind CSS v4](https://tailwindcss.com/)                |
| Runtime / PM | [Bun](https://bun.sh/)                                     |
| Database     | [PostgreSQL](https://www.postgresql.org/)                  |
| Validation   | [Zod](https://zod.dev/)                                    |

### Project Structure

```
www/
├── .github/workflows/   # CI pipeline (lint, format, test, build)
├── docs/                # Project documentation
├── public/              # Static assets
├── src/
│   ├── app/             # Next.js App Router pages & API routes
│   │   ├── (app)/       # Protected app routes (dashboard, files, results)
│   │   ├── (auth)/      # Auth routes (login)
│   │   └── api/         # API routes (auth, backend-token)
│   ├── components/
│   │   ├── ui/          # shadcn/ui primitives
│   │   ├── common/      # Shared components (breadcrumb, error boundary)
│   │   ├── sidebar/     # App sidebar navigation
│   │   ├── analysis/    # Analysis workflow components
│   │   ├── dashboard/   # Dashboard-specific components
│   │   ├── files/       # File management components
│   │   └── report/      # Report & chart components
│   ├── config/          # API endpoint configuration
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities, auth, API client
│   ├── store/           # Zustand stores
│   ├── styles/          # Global CSS (Tailwind)
│   └── types/           # TypeScript type definitions
├── flake.nix            # Nix devshell
├── next.config.js       # Next.js configuration
├── package.json
└── tsconfig.json
```

### Environment Variables

All environment variables are validated at startup via
[`src/env.js`](src/env.js) using `@t3-oss/env-nextjs` and Zod. Create a
`.env.local` file at the project root:

| Variable                   | Required | Description                                                    |
| -------------------------- | -------- | -------------------------------------------------------------- |
| `BETTER_AUTH_SECRET`       | Yes      | Secret key for Better Auth sessions                            |
| `BETTER_AUTH_URL`          | Yes      | Base URL of the app (e.g. `http://localhost:3000`)             |
| `DATABASE_URL`             | Yes      | PostgreSQL connection string                                   |
| `GOOGLE_CLIENT_ID`         | Yes      | Google OAuth client ID                                         |
| `GOOGLE_CLIENT_SECRET`     | Yes      | Google OAuth client secret                                     |
| `NEXT_PUBLIC_API_BASE_URL` | Yes      | FastAPI backend base URL                                       |
| `FASTAPI_JWT_SECRET`       | No       | Shared secret for backend JWT tokens                           |
| `NODE_ENV`                 | No       | `development` / `test` / `production` (default: `development`) |

> See [docs/ONBOARDING.md](docs/ONBOARDING.md) for detailed setup instructions.

### Usage

`bun` is expected to run this app. See [here](https://bun.sh/docs/installation)
for installation.

```bash
bun dev       # Run the app in development mode
bun start     # Run the app in production mode
bun run build # Build the app
bun test      # Run tests
bun run lint  # Lint with ESLint
```

> `flake.nix` is provided for Nix users. Use `nix develop` to enter the
> development shell.

### System Architecture

<img src="https://raw.githubusercontent.com/BizLenz/.github/refs/heads/main/assets/architecture/www_architecture.svg" alt="www_architecture" width="600"/>

The frontend was developed using the Next.js framework as it enables server‑side
rendering, optimized performance, and efficient integration of dynamic AI‑driven
content.

It heavily utilizes the [shadcn/ui](https://ui.shadcn.com/) component library,
allowing rapid interface development and maintaining consistent design
efficiency even with a single developer on the FE side.

### Documentation

- [Onboarding Guide](docs/ONBOARDING.md) — getting started for new developers
- [Architecture](docs/ARCHITECTURE.md) — technical deep-dive into the codebase
