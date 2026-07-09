---
language: typescript
package_manager: npm
test_runner: vitest
test_command: "npm run test"
test_file_pattern: "src/**/*.{test,spec}.{ts,tsx}"
require_tests: true
---
## Module Map
| Directory | Language | Purpose |
|---|---|---|
| backend/ | Python | FastAPI API server for AI coaching, plans, meal suggestions, TTS key test |
| src/ | TypeScript | React SPA entry, app shell, global styles |
| src/components/ | TypeScript | Feature UI components (chat, planner, navigation, cards) |
| src/components/ui/ | TypeScript | Shared shadcn/Radix UI primitives |
| src/context/ | TypeScript | Client auth/profile/routine state via localStorage |
| src/pages/ | TypeScript | Route pages (auth, profile, account, routine, preferences) |
| src/hooks/ | TypeScript | Shared hooks (mobile detection, toast) |
| src/lib/ | TypeScript | UI utility helpers |
| src/test/ | TypeScript | Vitest setup and example tests |

## Tech Stack
| Component | Technology | Notes |
|---|---|---|
| Frontend | React 18 + TypeScript | Vite app, React Router, TanStack Query |
| UI | Tailwind CSS, shadcn/ui, Radix UI | Tailwind + component primitives |
| Backend | FastAPI | Python API server |
| AI | Groq API | Llama 3.1 models via groq SDK |
| TTS | ElevenLabs API | TTS via HTTP requests |
| State | localStorage | Auth, profile, routine, preferences |
| Testing | Vitest + Testing Library | jsdom environment |

## System Architecture
| Flow | Description |
|---|---|
| Browser → FastAPI | React app calls http://localhost:8000/agent/* endpoints via fetch |
| FastAPI → Groq | Server uses Groq API key to generate coach/chat/plan/meal text |
| FastAPI → ElevenLabs | Server validates TTS key and generates audio (not shown in UI code) |
| Browser → localStorage | Client persists user profile, routine, preferences, auth |

## Key Interfaces & Contracts
| Interface | Method | Path | Payload/Notes |
|---|---|---|---|
| Health | GET | / | Returns status JSON |
| Models | GET | /models | Returns available Groq model list |
| TTS Key Test | GET | /test-tts-key | Tests ELEVENLABS_API_KEY |
| Coach | POST | /agent/coach | {message, feeling?, focus_areas?} → {reply} |
| Chatbot | POST | /agent/chatbot | {message, conversation_history?} → {reply} |
| Daily Plan | POST | /agent/daily-plan | {work_schedule, other_activities, routine?, user_profile?, feeling?} → JSON schedule |
| Meal Suggestions | POST | /agent/meal-suggestions | {height?, weight?, age?} → JSON meals/snacks |
| Storage Keys | N/A | localStorage | users, currentEmail, userProfile, userRoutine, userPreferences, dailyFeeling, lastNightSleep, showMealPlan |

## Coding Conventions
| Area | Convention | Evidence |
|---|---|---|
| Components | Function components + hooks | useState/useEffect across pages/components |
| Routing | React Router v6 | <Routes><Route/> in App.tsx |
| Styling | Tailwind utility classes | className strings across JSX |
| Utilities | cn() for class merge | src/lib/utils.ts |
| State | Context provider | UserContext provide