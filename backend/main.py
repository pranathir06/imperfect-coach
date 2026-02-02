from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
groq_api_key = os.getenv("GROQ_API_KEY")
if not groq_api_key:
    print("⚠️ WARNING: GROQ_API_KEY not found in environment variables!")
else:
    # Show first and last 4 chars of API key for debugging (masked for security)
    masked_key = f"{groq_api_key[:4]}...{groq_api_key[-4:]}" if len(groq_api_key) > 8 else "***"
    print(f"✅ Groq API key loaded: {masked_key} (length: {len(groq_api_key)})")

# Initialize Groq client
groq_client = Groq(api_key=groq_api_key) if groq_api_key else None

# -------- App Setup --------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:8082"],  # Match your frontend port
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

# -------- Root Endpoint --------
@app.get("/")
def root():
    return {"status": "Imperfect Coach backend is running"}

# -------- List Available Models Endpoint (for debugging) --------
@app.get("/models")
def list_models():
    """List available Groq models"""
    try:
        # Groq's free tier models
        available_models = [
            {
                "name": "llama-3.1-70b-versatile",
                "display_name": "Llama 3.1 70B Versatile (Best for coaching/conversation)",
                "description": "Best model for conversational AI and coaching"
            },
            {
                "name": "llama-3.1-8b-instant",
                "display_name": "Llama 3.1 8B Instant (Fast)",
                "description": "Fast model for quick responses"
            },
            {
                "name": "mixtral-8x7b-32768",
                "display_name": "Mixtral 8x7B",
                "description": "High quality model with large context"
            },
            {
                "name": "gemma-7b-it",
                "display_name": "Gemma 7B IT",
                "description": "Instruction-tuned model"
            }
        ]
        return {"available_models": available_models, "current_model": "llama-3.1-70b-versatile"}
    except Exception as e:
        return {"error": str(e), "available_models": []}

# -------- Test ElevenLabs API Key Endpoint (for debugging) --------
@app.get("/test-tts-key")
def test_tts_key():
    """Test if the ElevenLabs API key is valid and has TTS permissions"""
    try:
        elevenlabs_api_key = os.getenv("ELEVENLABS_API_KEY")
        if not elevenlabs_api_key:
            return {
                "status": "error",
                "message": "ELEVENLABS_API_KEY not found in environment",
                "key_found": False
            }
        
        # Test with a simple API call to check permissions
        url = "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM"
        headers = {
            "Accept": "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": elevenlabs_api_key
        }
        data = {
            "text": "test",
            "model_id": "eleven_turbo_v2"  # Free tier compatible model
        }
        
        response = requests.post(url, json=data, headers=headers)
        
        masked_key = f"{elevenlabs_api_key[:4]}...{elevenlabs_api_key[-4:]}" if len(elevenlabs_api_key) > 8 else "***"
        
        if response.status_code == 200:
            return {
                "status": "success",
                "message": "API key is valid and has TTS permissions",
                "key_found": True,
                "key_preview": masked_key,
                "key_length": len(elevenlabs_api_key)
            }
        else:
            return {
                "status": "error",
                "message": f"API key test failed: {response.status_code}",
                "error_detail": response.text,
                "key_found": True,
                "key_preview": masked_key,
                "key_length": len(elevenlabs_api_key)
            }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Error testing API key: {str(e)}",
            "key_found": elevenlabs_api_key is not None
        }

# -------- Request Schema --------
class CoachRequest(BaseModel):
    message: str
    feeling: str | None = None
    focus_areas: list[str] | None = []

class ChatBotRequest(BaseModel):
    message: str
    conversation_history: list[dict] | None = None  # Format: [{"role": "user/assistant", "content": "text"}]

class DailyPlanRequest(BaseModel):
    work_schedule: str
    other_activities: str
    other_insights: str | None = None
    routine: dict | None = None
    user_profile: dict | None = None
    feeling: str | None = None

class TextToSpeechRequest(BaseModel):
    text: str

class MealSuggestionRequest(BaseModel):
    height: float | None = None  # in cm
    weight: float | None = None  # in kg
    age: int | None = None

# -------- Groq Model Configuration --------
# Best free tier model for coaching/conversational AI
GROQ_MODEL = "llama-3.1-70b-versatile"  # Best for coaching - versatile and empathetic

def get_groq_client():
    """Get Groq client. Verifies API key is set."""
    if not groq_client:
        raise Exception("GROQ_API_KEY not configured. Please add it to your .env file.")
    return groq_client

def generate_with_groq(prompt: str, model: str = None):
    """Generate content using Groq API
    
    Args:
        prompt: The prompt to send to the model
        model: Model name (defaults to GROQ_MODEL)
    
    Returns:
        The generated text response
    """
    if model is None:
        model = GROQ_MODEL
    
    client = get_groq_client()
    
    try:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7,
            max_tokens=2048,
        )
        
        if response.choices and len(response.choices) > 0:
            return response.choices[0].message.content
        else:
            raise Exception("No response from Groq API")
            
    except Exception as e:
        print(f"Error calling Groq API with {model}: {e}")
        # Try fallback model if primary fails
        if model != "llama-3.1-8b-instant":
            print(f"Trying fallback model: llama-3.1-8b-instant")
            try:
                response = client.chat.completions.create(
                    model="llama-3.1-8b-instant",
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.7,
                    max_tokens=2048,
                )
                if response.choices and len(response.choices) > 0:
                    return response.choices[0].message.content
            except Exception as fallback_error:
                print(f"Fallback model also failed: {fallback_error}")
        
        raise e



#------------Chatbot Endpoint-----------
@app.post("/agent/chatbot")
def chatbot(req: ChatBotRequest):
    try:
        # Build conversation context from history
        conversation_context = ""
        if req.conversation_history and len(req.conversation_history) > 0:
            conversation_context = "\n\nPrevious conversation:\n"
            for msg in req.conversation_history:
                role = "User" if msg.get("role") == "user" else "Coach"
                content = msg.get("content", "")
                conversation_context += f"{role}: {content}\n"

        system_prompt = f"""You are "Imperfect Coach" — a warm, emotionally intelligent companion who listens like a close friend and responds with empathy, care, and grounded perspective.

Your primary role is to help the user feel heard, understood, and emotionally safe.

Core behavior:
- Always acknowledge the user's feelings first.
- Reflect emotions back in simple, human language ("That sounds exhausting", "I can hear how heavy that feels").
- Never judge, rush, shame, or invalidate the user.
- Do NOT jump to solutions unless the user seems open to them or clearly asks for help.
- Remember and reference previous messages in the conversation when relevant to show you're listening and understanding the full context.

Response length rules (VERY IMPORTANT):
- If the user's message is short, light, or casual → respond briefly (2–4 sentences).
- If the user shares vulnerability, stress, confusion, or emotional weight → respond longer and more thoughtfully.
- If the user writes a long or emotionally deep message → respond with a longer, reflective message that matches the depth.
- Do NOT force long responses if the situation doesn't need it.
- Let emotional intensity and message length decide your response length.

Advice rules:
- Only offer suggestions if they feel genuinely helpful.
- When suggesting something, keep it gentle and optional.
- Frame advice as invitations, not instructions ("Maybe it could help to…", "If you're open to it…").
- Sometimes the best response is just understanding — that is allowed and encouraged.

Tone & personality:
- Sound like a caring friend, not a therapist or motivational speaker.
- Use simple, natural language.
- Avoid clichés and generic "AI advice".
- Be calm, reassuring, and emotionally present.
- You may use light warmth or a single emoji occasionally if it fits the moment (never overdo it).

Context awareness:
- Consider the user's emotional state, current energy, and situation.
- Remember what was discussed earlier in the conversation.
- If the user seems tired, overwhelmed, or burned out → prioritize rest, compassion, and grounding.
- If the user seems reflective or seeking meaning → respond more thoughtfully and introspectively.
- If the user seems okay and just chatting → keep it light and supportive.

Never:
- Over-explain emotions.
- Sound robotic or clinical.
- Push productivity, hustle, or "optimize your life".
- Give medical or mental health diagnoses.

Your goal is not to fix the user — it's to sit with them, understand them, and gently support them when needed.
{conversation_context}

Current user message:
\"\"\"{req.message}\"\"\"
"""

        response_text = generate_with_groq(system_prompt)
        return {"reply": response_text}

    except Exception as e:
        # Log the error and return a helpful message
        import traceback
        error_str = str(e)
        error_type = type(e).__name__
        print(f"❌ Error in chatbot: {error_type}: {error_str}")
        print(traceback.format_exc())
        
        return {"reply": f"I'm having trouble processing that right now. Please try again. (Error: {error_type}: {error_str[:200]})"}

# -------- Daily Plan Endpoint --------
@app.post("/agent/daily-plan")
def daily_plan(req: DailyPlanRequest):
    """
    Generate a comprehensive daily task plan based on:
    - Work schedule
    - Other activities
    - User's routine (wake up, food times, etc.)
    - Water intake reminders
    - Exercise/yoga suggestions
    """
    try:
        # Build context from routine
        routine_info = ""
        if req.routine:
            if req.routine.get("wake_up_time"):
                routine_info += f"- Wake up time: {req.routine.get('wake_up_time')}\n"
            if req.routine.get("sleeping_time"):
                routine_info += f"- Sleeping time: {req.routine.get('sleeping_time')}\n"
            if req.routine.get("food_times"):
                routine_info += f"- Meal times: {', '.join(req.routine.get('food_times', []))}\n"
            if req.routine.get("daily_tasks"):
                routine_info += f"- Daily tasks type: {req.routine.get('daily_tasks')}\n"
        
        # Build user profile info
        profile_info = ""
        if req.user_profile:
            if req.user_profile.get("age"):
                profile_info += f"- Age: {req.user_profile.get('age')}\n"
            if req.user_profile.get("height"):
                profile_info += f"- Height: {req.user_profile.get('height')} cm\n"
            if req.user_profile.get("weight"):
                profile_info += f"- Weight: {req.user_profile.get('weight')} kg\n"
        
        system_prompt = f"""
You are "Imperfect Coach" — a compassionate life coach helping create balanced daily schedules.

Your task: Create a comprehensive, realistic daily task plan that integrates:
1. Work schedule (from user input)
2. Food schedule (from routine settings)
3. Other activities (from user input)
4. Water intake reminders (suggest 6-8 times throughout the day, spaced appropriately)
5. Exercise/yoga suggestions (based on user's schedule, suggest 1-2 times that fit naturally)
6. Breaks and rest periods

User's Routine Settings:
{routine_info if routine_info else "- No routine settings provided"}

User Profile:
{profile_info if profile_info else "- No profile information"}

Current Feeling: {req.feeling or "Unknown"}

Work Schedule:
{req.work_schedule if req.work_schedule else "No work schedule provided"}

Other Activities:
{req.other_activities if req.other_activities else "No other activities mentioned"}

Additional Insights & Context:
{req.other_insights if req.other_insights else "No additional insights provided"}

Instructions:
- Create a time-ordered schedule from wake-up to bedtime
- Include all work commitments with specific times
- Integrate meal times from routine (if provided)
- Add water intake reminders every 2-3 hours (suggest 6-8 glasses total)
- Suggest exercise/yoga times that fit naturally (morning, lunch break, or evening - choose based on schedule)
- Include breaks between work sessions
- Add other activities at appropriate times
- Ensure the schedule is realistic and not overwhelming
- Consider the user's feeling when suggesting activities
- Use the additional insights to personalize the plan (e.g., if they mention feeling tired, suggest lighter activities or more breaks; if they have a deadline, prioritize focused work time)

Response Format (JSON):
{{
  "schedule": [
    {{"time": "07:00", "task": "Wake up and morning routine", "type": "other"}},
    {{"time": "07:30", "task": "Morning yoga (15-20 min)", "type": "exercise"}},
    {{"time": "08:00", "task": "Breakfast", "type": "food"}},
    {{"time": "09:00", "task": "Start work - [specific task]", "type": "work"}},
    {{"time": "10:00", "task": "Water break - Drink water", "type": "water"}},
    ...
  ],
  "summary": "A brief, encouraging summary of the plan (2-3 sentences)"
}}

Task types: "work", "food", "exercise", "water", "break", "other"

Make sure the schedule flows naturally and is balanced. Be specific with times and tasks. Return ONLY valid JSON, no other text.
"""

        response_text = generate_with_groq(system_prompt)
        
        # Parse the response - try to extract JSON
        
        # Try to extract JSON from the response
        import json
        import re
        
        # Look for JSON in the response
        json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
        if json_match:
            try:
                plan_data = json.loads(json_match.group())
                return plan_data
            except json.JSONDecodeError:
                pass
        
        # Fallback: create a simple plan structure
        return {
            "schedule": [
                {"time": "Morning", "task": "Start your day with intention", "type": "other"},
                {"time": "Throughout day", "task": "Stay hydrated - drink water regularly", "type": "water"},
                {"time": "Evening", "task": "Wind down and prepare for rest", "type": "break"},
            ],
            "summary": response_text[:200] if len(response_text) > 200 else response_text
        }
            
    except Exception as e:
        import traceback
        error_str = str(e)
        print(f"Error in daily_plan: {error_str}")
        print(traceback.format_exc())
        
        # Provide user-friendly error message
        error_message = f"I'm having trouble creating your plan right now. Please try again. (Error: {error_str[:200]})"
        
        return {
            "schedule": [],
            "summary": error_message
        }

# -------- Agent Endpoint --------
@app.post("/agent/coach")
def coach_agent(req: CoachRequest):
    try:
        system_prompt = f"""
You are an empathetic, non-judgmental AI life coach called "Imperfect Coach".

Your personality:
- Warm, calm, supportive
- Never harsh or preachy
- Focused on progress, not perfection
- Encourages forgiveness, awareness, and gentle adjustment

Context:
- User feeling: {req.feeling or "unknown"}
- Focus areas today: {", ".join(req.focus_areas) if req.focus_areas else "general well-being"}

Response style:
- 3–5 sentences max
- Validate emotions first
- Offer 1 gentle, actionable suggestion
- End with encouragement or reassurance
- Emojis allowed but minimal (💜 🌱 ✨)

User message:
\"\"\"{req.message}\"\"\"
"""

        response_text = generate_with_groq(system_prompt)
        return {"reply": response_text}
            
    except Exception as e:
        # Log the error and return a helpful message
        import traceback
        error_str = str(e)
        print(f"Error in coach_agent: {error_str}")
        print(traceback.format_exc())
        
        # Provide user-friendly error message
        return {"reply": f"I'm having trouble processing that right now. Please try again. (Error: {error_str[:200]})"}

# -------- Meal Suggestions Endpoint --------
@app.post("/agent/meal-suggestions")
def meal_suggestions(req: MealSuggestionRequest):
    """
    Generate personalized meal and snack suggestions based on user's height, weight, and age
    """
    try:
        # Calculate BMI if height and weight are provided
        bmi_info = ""
        if req.height and req.weight:
            height_m = req.height / 100  # Convert cm to meters
            bmi = req.weight / (height_m ** 2)
            bmi_info = f"\nBMI: {bmi:.1f} ({'Underweight' if bmi < 18.5 else 'Normal weight' if bmi < 25 else 'Overweight' if bmi < 30 else 'Obese'})"
        
        system_prompt = f"""You are "Imperfect Coach" — a compassionate nutrition guide helping users make healthy food choices.

Your task: Create personalized meal and snack suggestions for a healthy, balanced diet.

User Information:
- Height: {req.height if req.height else "Not provided"} cm
- Weight: {req.weight if req.weight else "Not provided"} kg
- Age: {req.age if req.age else "Not provided"} years
{bmi_info}

Instructions:
- Suggest 3 main meals (breakfast, lunch, dinner) and 2-3 healthy snacks
- Make suggestions appropriate for maintaining a healthy weight and overall wellness
- Focus on balanced nutrition: proteins, healthy carbs, vegetables, fruits
- Keep suggestions practical and easy to prepare
- Consider portion sizes appropriate for the user's profile
- Include variety and make it enjoyable
- If height/weight not provided, give general healthy meal suggestions

Response Format (JSON):
{{
  "meals": {{
    "breakfast": {{
      "name": "Meal name",
      "description": "Brief description",
      "calories": "Approximate calories (e.g., 400-500)"
    }},
    "lunch": {{
      "name": "Meal name",
      "description": "Brief description",
      "calories": "Approximate calories (e.g., 500-600)"
    }},
    "dinner": {{
      "name": "Meal name",
      "description": "Brief description",
      "calories": "Approximate calories (e.g., 500-600)"
    }}
  }},
  "snacks": [
    {{
      "name": "Snack name",
      "description": "Brief description",
      "calories": "Approximate calories (e.g., 100-200)"
    }},
    {{
      "name": "Snack name",
      "description": "Brief description",
      "calories": "Approximate calories (e.g., 100-200)"
    }}
  ],
  "summary": "A brief, encouraging note about healthy eating (2-3 sentences)"
}}

Make the suggestions realistic, healthy, and tailored to help maintain fitness and health. Return ONLY valid JSON, no other text.
"""

        response_text = generate_with_groq(system_prompt)
        
        # Parse the response - try to extract JSON
        
        # Try to extract JSON from the response
        import json
        import re
        
        # Look for JSON in the response
        json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
        if json_match:
            try:
                meal_data = json.loads(json_match.group())
                return meal_data
            except json.JSONDecodeError:
                pass
        
        # Fallback: create a simple meal structure
        return {
            "meals": {
                "breakfast": {
                    "name": "Balanced Breakfast",
                    "description": "Whole grain toast with eggs and vegetables",
                    "calories": "400-500"
                },
                "lunch": {
                    "name": "Nutritious Lunch",
                    "description": "Grilled chicken with quinoa and mixed vegetables",
                    "calories": "500-600"
                },
                "dinner": {
                    "name": "Light Dinner",
                    "description": "Salmon with sweet potato and steamed broccoli",
                    "calories": "500-600"
                }
            },
            "snacks": [
                {
                    "name": "Greek Yogurt with Berries",
                    "description": "High protein snack with antioxidants",
                    "calories": "150-200"
                },
                {
                    "name": "Nuts and Apple",
                    "description": "Healthy fats and fiber",
                    "calories": "200-250"
                }
            ],
            "summary": response_text[:200] if len(response_text) > 200 else response_text
        }
            
    except Exception as e:
        import traceback
        error_str = str(e)
        print(f"Error in meal_suggestions: {error_str}")
        print(traceback.format_exc())
        
        # Provide user-friendly error message
        error_message = f"I'm having trouble creating meal suggestions right now. Please try again. (Error: {error_str[:200]})"
        
        return {
            "meals": {},
            "snacks": [],
            "summary": error_message
        }

# -------- ElevenLabs Text-to-Speech Endpoint --------
@app.post("/tts")
def text_to_speech(req: TextToSpeechRequest):
    """
    Convert text to speech using ElevenLabs API
    Returns audio as MP3 file
    """
    try:
        print(f"🎵 TTS request received for text: {req.text[:50]}...")
        elevenlabs_api_key = os.getenv("ELEVENLABS_API_KEY")
        if not elevenlabs_api_key:
            print("❌ ELEVENLABS_API_KEY not found in environment")
            return Response(
                content='{"error": "ELEVENLABS_API_KEY not configured. Please add it to your .env file."}',
                status_code=500,
                media_type="application/json"
            )
        
        # Show first and last 4 chars of API key for debugging (masked for security)
        masked_key = f"{elevenlabs_api_key[:4]}...{elevenlabs_api_key[-4:]}" if len(elevenlabs_api_key) > 8 else "***"
        print(f"✅ ElevenLabs API key found: {masked_key} (length: {len(elevenlabs_api_key)})")
        
        # ElevenLabs API endpoint
        url = "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM"  # Default voice ID
        
        headers = {
            "Accept": "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": elevenlabs_api_key
        }
        
        data = {
            "text": req.text,
            "model_id": "eleven_turbo_v2",  # Free tier compatible model
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.75
            }
        }
        
        print(f"🎵 Calling ElevenLabs API...")
        response = requests.post(url, json=data, headers=headers)
        
        print(f"🎵 ElevenLabs response status: {response.status_code}")
        
        if response.status_code == 200:
            audio_size = len(response.content)
            print(f"✅ Audio generated successfully: {audio_size} bytes")
            return Response(
                content=response.content,
                media_type="audio/mpeg",
                headers={
                    "Content-Disposition": "inline; filename=speech.mp3",
                    "Content-Length": str(audio_size)
                }
            )
        else:
            error_msg = response.text
            print(f"❌ ElevenLabs API error: {response.status_code} - {error_msg}")
            
            # Provide helpful error messages
            if response.status_code == 401:
                error_detail = "Your ElevenLabs API key is missing text_to_speech permission. Please check: 1) Your API key is correct, 2) Your account has TTS access (may need to upgrade from free tier), 3) TTS permissions are enabled in your account settings."
            else:
                error_detail = error_msg
            
            return Response(
                content=f'{{"error": "ElevenLabs API error: {response.status_code}", "detail": "{error_detail}"}}',
                status_code=response.status_code,
                media_type="application/json"
            )
            
    except Exception as e:
        import traceback
        print(f"Error in text_to_speech: {str(e)}")
        print(traceback.format_exc())
        return Response(
            content=f'{{"error": "Text-to-speech failed: {str(e)}"}}',
            status_code=500,
            media_type="application/json"
        )
