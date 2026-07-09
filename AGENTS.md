## Tech Stack
- TypeScript, React 18 (Vite), React Router v6
- TanStack Query
- Tailwind CSS, shadcn/ui, Radix UI
- Python FastAPI backend
- Vitest + Testing Library (jsdom)

## Project Structure
- `src/` React SPA entry, app shell, global styles
- `src/components/` feature UI (chat, planner, navigation, cards)
- `src/components/ui/` shared shadcn/Radix primitives
- `src/pages/` route pages (auth, profile, routine, preferences)
- `src/context/` localStorage-backed auth/profile/routine state
- `src/lib/` UI helpers (e.g., `cn()` class merge)
- `src/test/` Vitest setup/examples
- `backend/` FastAPI server for AI coaching, plans, meal suggestions, TTS

## How to Run Tests
`npm run test`

## Conventions
- Use function components with hooks; keep state in Context where applicable.
- Use Tailwind utility classes for styling; prefer shared UI primitives.
- Use `cn()` from `src/lib/utils.ts` for className composition.
- Follow React Router v6 patterns in `App.tsx`.
- Persist client state only via localStorage keys defined in docs.

## What NOT to Do
- Do not add server-side auth/accounts or databases (localStorage only).
- Do not commit `.env` or API keys; keep secrets in `backend/.env`.
- Do not introduce non-localhost CORS or external origins without approval.
- Do not change API contracts for `/agent/*` endpoints without updating frontend.
- Do not store sensitive data beyond existing localStorage keys.