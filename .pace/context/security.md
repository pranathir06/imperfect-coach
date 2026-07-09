## Sensitive Data
| Data | Where Stored | Protection |
|---|---|---|
| User credentials (email/password) | localStorage key: users | None (plain storage) |
| User profile (name/age/height/weight) | localStorage key: userProfile / profile_<email> | Browser storage only |
| Routine & preferences | localStorage keys: userRoutine, userPreferences | Browser storage only |
| Daily feeling & sleep | localStorage keys: dailyFeeling, lastNightSleep | Browser storage only |
| GROQ_API_KEY | backend/.env | .env gitignored |
| ELEVENLABS_API_KEY | backend/.env | .env gitignored |

## Trust Boundaries
| Caller | Callee | Auth Method |
|---|---|---|
| Browser app | FastAPI /agent/* endpoints | None (no auth) |
| Browser app | FastAPI /tts (frontend fetch) | None (no auth) |
| FastAPI | Groq API | GROQ_API_KEY env var |
| FastAPI | ElevenLabs API | ELEVENLABS_API_KEY env var |

## Security Requirements
- Store GROQ_API_KEY and ELEVENLABS_API_KEY in backend/.env
- Do not commit .env files (gitignored)
- Limit CORS to localhost origins as configured
- Treat localStorage data as non-secure; no sensitive guarantees

## Security Checklist
Env secrets in .env: Pass
.env ignored by git: Pass
API authentication enforced: Fail
Client password hashing: Fail
HTTPS enforced: Fail
