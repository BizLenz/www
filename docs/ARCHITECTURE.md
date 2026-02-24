# Architecture

Technical reference for the BizLenz frontend codebase.

## High-Level Overview

BizLenz/www is a **Next.js 15 App Router** application that serves as the
frontend for an AI-powered business proposal analysis platform.

It communicates with a **[FastAPI backend](https://github.com/BizLenz/core)**
for file management, analysis processing, and result retrieval.

- **Next.js** handles SSR, routing, authentication, and serves as a BFF
  (backend-for-frontend)
- **FastAPI** handles file storage, AI model orchestration, and analysis
- **PostgreSQL** stores user sessions (Better Auth) and is shared with the
  backend

## Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout (font, BackendTokenProvider)
│   ├── page.tsx            # Landing page (/)
│   ├── (app)/              # Protected route group
│   │   ├── layout.tsx      # App shell (sidebar, breadcrumb)
│   │   ├── dashboard/      # Dashboard page
│   │   ├── files/          # File management page
│   │   └── results/[id]/   # Analysis results (overview + sub-pages)
│   ├── (auth)/             # Auth route group
│   │   └── login/          # Login page
│   └── api/                # API routes
│       ├── auth/[...all]/  # Better Auth catch-all handler
│       └── backend-token/  # Issues JWT for FastAPI communication
├── components/
│   ├── ui/                 # shadcn/ui primitives (button, card, dialog, etc.)
│   ├── common/             # Shared components (breadcrumb, error-boundary, feature-card)
│   ├── sidebar/            # App sidebar (nav-main, nav-reports, nav-user, team-switcher)
│   ├── analysis/           # Analysis workflow (settings steps, review, contest-type selector)
│   ├── dashboard/          # Dashboard widgets (recent-view, file-form)
│   ├── files/              # File table, upload button, columns
│   └── report/             # Report views (score-chart, risk, financial, market, technical)
├── config/
│   └── api.ts              # API_ENDPOINTS constant mapping
├── hooks/
│   └── use-mobile.ts       # Responsive breakpoint hook
├── lib/
│   ├── auth.ts             # Better Auth server config
│   ├── auth-client.ts      # Better Auth client instance
│   ├── auth-context.tsx     # BackendTokenProvider (React context)
│   ├── backend-token-context.ts  # BackendTokenContext definition
│   ├── api-client.ts       # authenticatedFetch / serverFetch helpers
│   ├── utils.ts            # General utilities (cn, getErrorMessage)
│   ├── format-date.ts      # Date formatting
│   ├── normalize-analysis.ts # Analysis data normalization
│   └── app-sidebar-items.ts # Sidebar navigation config
├── store/
│   ├── file-store.ts       # File list state (Zustand)
│   ├── analysis-store.ts   # Analysis settings per file (Zustand)
│   └── ai-model-store.ts   # AI model selection (Zustand)
├── styles/
│   └── globals.css         # Tailwind v4 imports, CSS custom properties, theme
└── types/
    ├── file.ts             # File schema & type (Zod-validated)
    ├── analysis-result.ts  # AnalysisResult, EvaluationCriterion schemas
    ├── analysis-detail-result.ts  # Detailed analysis types
    ├── api-responses.ts    # API response types
    └── auth.ts             # BackendTokenResponse schema
```

## Routing & Layouts

The app uses Next.js **route groups** to separate concerns:

### Route Groups

- **`(app)/`** — Protected pages that require authentication. Wrapped in
  `SidebarProvider` with a persistent sidebar and breadcrumb header.
- **`(auth)/`** — Authentication pages (currently only `/login`). No sidebar or
  app shell.

### Middleware

> `src/middleware.ts`

The middleware runs on every request except `/login`, `/api`, `/_next/*`, and
`/favicon.ico`:

1. **Authenticated user at `/`** → redirected to `/dashboard`
2. **Unauthenticated user at any protected route** → redirected to
   `/login?callbackUrl=...`
3. **Otherwise** → request passes through

### Pages

| Route                     | Description                               |
| ------------------------- | ----------------------------------------- |
| `/`                       | Landing page (redirects if authenticated) |
| `/login`                  | Google OAuth login                        |
| `/dashboard`              | Main dashboard with recent files          |
| `/files`                  | File management (upload, list, delete)    |
| `/results/[id]`           | Analysis result overview                  |
| `/results/[id]/financial` | Financial analysis detail                 |
| `/results/[id]/market`    | Market analysis detail                    |
| `/results/[id]/risk`      | Risk analysis detail                      |
| `/results/[id]/technical` | Technical analysis detail                 |

## Authentication

### Better Auth + Google OAuth

The authentication flow uses [Better Auth](https://www.better-auth.com/) with a
Google social provider:

1. **Server config** (`src/lib/auth.ts`): Configures Better Auth with a
   PostgreSQL connection pool and Google OAuth credentials. Uses the
   `nextCookies()` plugin for cookie-based sessions.
2. **Client** (`src/lib/auth-client.ts`): Creates a client-side auth instance
   with `createAuthClient()`.
3. **API route** (`src/app/api/auth/[...all]/route.ts`): Catch-all route that
   delegates to Better Auth's handler for all auth endpoints (sign-in, callback,
   session, etc.).

### Backend Token Lifecycle

The frontend needs a separate JWT to authenticate with the FastAPI backend:

1. After Better Auth login, the `BackendTokenProvider` (React context in the
   root layout) detects the session.
2. It fetches a backend token from `/api/backend-token`, which verifies the
   Better Auth session server-side and issues a JWT.
3. The token is stored in React context (`BackendTokenContext`) and passed to
   API calls via `authenticatedFetch()`.

### Session Flow

```
User → Google OAuth → Better Auth (session cookie) → BackendTokenProvider → FastAPI JWT
```

## State Management

Three Zustand stores manage client-side state:

### `file-store.ts`

- Stores the list of user files fetched from the backend
- Tracks loading/error state and provides computed values (total size, counts by
  status)
- Uses Zod validation on API responses

### `analysis-store.ts`

- Per-file analysis settings (contest type, analysis scope)
- Transient state used during the analysis workflow

### `ai-model-store.ts`

- Selected AI model (default: `gemini-2.5-flash`)
- Available model list (`gemini-2.5-flash`, `gemini-2.5-pro`)
- Validates model selection against the allowed list

### BackendTokenContext

- React context (not Zustand) providing the FastAPI JWT token
- Manages token lifecycle: fetch on login, clear on logout
- Exposes `fastApiToken`, loading state, error state, and
  `refreshFastApiToken()`

## API Communication

### Endpoint Configuration (`src/config/api.ts`)

All backend endpoints are centralized in `API_ENDPOINTS`:

- `files.search` / `files.upload` / `files.uploadMetadata` / `files.delete(id)`
- `evaluation.request` / `evaluation.results(id)` / `evaluation.financial(id)` /
  etc.

### Fetch Helpers (`src/lib/api-client.ts`)

Two helpers handle authenticated API calls:

- **`authenticatedFetch<T>()`** — Client-side. Returns `{ data, error }` without
  throwing. Attaches `Authorization: Bearer <token>` header.
- **`serverFetch<T>()`** — Server-side (RSC / API routes). Throws on error.

Both require a token (from `BackendTokenContext` or server-side session).

## Component Organization

### `ui/`

shadcn/ui primitive components generated via
`bunx shadcn@latest add <component>`. These should not be manually edited.
Includes: accordion, avatar, badge, button, card, checkbox, dialog,
dropdown-menu, form, input, label, popover, progress, select, separator, sheet,
skeleton, switch, table, tooltip, sidebar, and dropzone.

### `common/`

Reusable components shared across features: `ErrorBoundary`, `PathBreadcrumb`,
`DeleteConfirmationModal`, `FeatureCard`, `StatusBubble`.

### Feature Directories

- **`sidebar/`** — `AppSidebar`, `SafeAppSidebar`, `NavMain`, `NavReports`,
  `NavUser`, `TeamSwitcher`
- **`analysis/`** — Multi-step analysis workflow (settings, review, contest-type
  combo box)
- **`dashboard/`** — `DashboardRecentView`, `DashboardFileForm`
- **`files/`** — `FilesTable`, `FilesUploadButton`, `FilesTableColumns`
- **`report/`** — `ReportView`, `ScoreChart`, `RiskView`, `FinancialView`,
  `MarketView`, `TechnicalView`, `FeedbackCard`, `EvaluationCriteriaCard`,
  `CustomProgressBar`

## Data Models

### File (`src/types/file.ts`)

```typescript
{
  id: number
  file_name: string
  file_path: string
  mime_type?: string
  file_size?: number
  created_at?: string
  updated_at?: string
  latest_job_id?: number | null
  status?: "pending" | "processing" | "completed" | "failed"
}
```

### AnalysisResult (`src/types/analysis-result.ts`)

```typescript
{
  id: number
  analysis_job_id: number
  evaluation_type: string
  score: number
  summary: string
  details: {
    title: string
    strengths: string[]
    weaknesses: string[]
    improvement_suggestions: string[]
    evaluation_criteria: EvaluationCriterion[]
  }
  created_at: string
}
```

All types are defined with Zod schemas and inferred — providing both runtime
validation and static types.

## Styling

### Tailwind CSS v4

The project uses Tailwind CSS v4 with PostCSS. Configuration lives in
`globals.css` rather than a `tailwind.config.ts` file.

### Theme System

CSS custom properties define the color palette in `globals.css`:

- Light mode: `:root { ... }`
- Dark mode: `.dark { ... }` (the `dark` class is always applied on `<html>`)
- Variables follow shadcn/ui naming: `--background`, `--foreground`,
  `--primary`, `--card`, `--sidebar-*`, `--chart-*`, etc.
- Colors use the OKLCH color space

### shadcn/ui

- Style preset: **New York**
- Base color: **Zinc**
- CSS variables enabled
- Icon library: **Lucide React** (with additional icons from **Tabler Icons**)
- Component aliases configured in `components.json` with `@/*` path prefix
