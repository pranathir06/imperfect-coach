## Vision
Purpose: Compassionate AI life coach for daily planning, meal guidance, and supportive chat
Users: Individuals using a web app for wellness guidance and routine support

## Target Personas
| Persona | Pain Point | Goal |
|---|---|---|
| Wellness seeker | Needs empathetic guidance without judgment | Receive supportive AI coaching |
| Busy planner | Struggles to structure the day | Generate balanced daily schedules |
| Nutrition-aware user | Unsure what to eat for wellness | Get personalized meal suggestions |
| Voice-preference user | Prefers listening over reading | Play TTS responses from coach |

## MVP Scope
In Scope:
- AI chat coaching with conversation context
- Daily task planner with schedule JSON output
- Meal suggestions based on profile data
- Profile, routine, preferences, feeling selection
- Voice playback via backend TTS endpoint
- LocalStorage-based authentication/data
Out of Scope:
- Server-side user accounts or database
- Mobile native apps
- Payments or subscriptions
- Medical/clinical diagnosis features

## Strategic Constraints
| Constraint | Reason |
|---|---|
| Groq API key required | Backend uses Groq Llama models for responses |
| ElevenLabs API key required | TTS functionality depends on ElevenLabs |
| localStorage persistence only | Client state stored locally per README and UserContext |
| CORS limited to localhost | Backend allows origins 8080/8082 only |
