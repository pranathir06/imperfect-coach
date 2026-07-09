## CI/CD
| Trigger | Workflow | Jobs |
|---|---|---|
| None | None | None |

## Environment Variables
| Name | Required | Purpose |
|---|---|---|
| GROQ_API_KEY | Yes | Groq Llama model access |
| ELEVENLABS_API_KEY | Yes | ElevenLabs TTS access |

## Local Dev
1. npm install
2. npm run dev
3. cd backend && pip install -r requirements.txt
4. cd backend && ./start.sh

## Deployment
Deploy: Frontend build with npm run build; backend run uvicorn main:app --port 8000
