# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (http://localhost:5173)
npm run build      # Production build → dist/
npm run build:dev  # Development build
npm run lint       # ESLint
npm run preview    # Preview production build
```

No test suite is configured.

## Architecture

**Caydence** is a mobile-first sports coaching platform (React + Vite + TypeScript) with two primary user roles: **Athlete** and **Coach**.

### Routing (`src/App.tsx`)

All routes are defined in a flat `<Routes>` block. Route groups:
- `/` `/auth` `/sport-selection` `/skill-mode` — onboarding/auth flow
- `/dashboard` `/profile` `/marketplace` `/community` — shared athlete views
- `/coach-swipe` `/coach/:id` `/video-upload` `/motion-analysis` `/compare-view` `/session-booking` `/ai-insights` — athlete features
- `/coach/*` — coach-only pages (home, offers, calendar, sessions, masterclasses, leaderboard, analytics, messages, revenue, onboarding)
- `/athlete/*` — athlete-specific pages (reports, skill-map, playlists, challenges)
- `/fitness/drills/:drillKey` — drill upload & AI analysis (valid keys: `pushup`, `bicep`, `squat`)
- `/fitness/drills/:drillKey/live` — live webcam drill analysis via WebSocket
- `/fitness/drills/:drillKey/report/:reportId` — drill report view

### Dual-Role System

Users can hold both athlete and coach roles simultaneously. Current active role is stored in `localStorage`. `src/hooks/useUserRole.ts` reads from `user_roles` Supabase table. `src/components/RoleSwitch.tsx` and `src/components/AddRoleDialog.tsx` manage switching/adding roles.

### Backend Connections

**Supabase** (primary backend):
- Client: `src/integrations/supabase/client.ts`
- Types: `src/integrations/supabase/types.ts` (auto-generated, do not edit manually)
- Auth: email/password via Supabase Auth; `onAuthStateChange` for session management
- RLS enforced on all tables via `has_role()` DB function

**Fitness CV Backend** (separate Python service):
- REST: `VITE_BACKEND_API_URL` (default `http://localhost:8001/api`) — used in `DrillCapture.tsx` for video upload
- WebSocket: `VITE_BACKEND_WS_URL` (default `ws://localhost:8001`) — used in `LiveDrillSession.tsx` for real-time frame analysis at ~12.5 fps

### State Management

- Server state: TanStack React Query (`useQuery`, `useMutation`)
- Local/form state: React hooks + React Hook Form + Zod
- Auth state: Supabase `onAuthStateChange`

### Styling Conventions

- Tailwind utility classes only; **use semantic color tokens** (`background`, `foreground`, `primary`, `secondary`, etc.) defined in `src/index.css` — avoid raw color classes like `text-white` or `bg-blue-500`
- Component library: shadcn/ui (`src/components/ui/`) — use these primitives before building custom ones
- Mobile-first responsive design

### Key Utility Files

- `src/utils/drillReportTemplate.ts` — `DrillReport` interface, `getDrillDisplayName()`, `generateDraftReport()` for fitness drill fallback reports
- `src/utils/authCleanup.ts` — `clearAllAuthCaches()` / `signOutAndClearAll()` for clearing stale auth state
- `/dev-cleanup` route — browser-side tool to clear localStorage, sessionStorage, IndexedDB, and Supabase auth

### Environment Variables

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_SUPABASE_PROJECT_ID=
VITE_BACKEND_API_URL=   # Python CV REST API (default: http://localhost:8001/api)
VITE_BACKEND_WS_URL=    # Python CV WebSocket (default: ws://localhost:8001)
```
