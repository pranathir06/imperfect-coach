# Imperfect Coach - AI Life Coach Application

A compassionate AI-powered life coaching web application that provides empathetic guidance, personalized daily planning, meal suggestions, and voice-enabled support to help users navigate their wellness journey with kindness and self-compassion.

## 🌟 Features

### Core Features
- **AI-Powered Coaching**: Get personalized, empathetic life coaching responses using Groq's Llama 3.1 70B model
- **Conversational Chatbot**: Have meaningful conversations with your AI coach that remembers context within sessions
- **Voice-Enabled Support**: Text-to-speech functionality using ElevenLabs - listen to coach responses with a click
- **Daily Task Planner**: Create personalized daily schedules based on work, activities, routine, and insights
- **Personalized Meal Suggestions**: Get AI-generated meal and snack recommendations based on your height, weight, and age
- **Focus Areas Tracking**: 
  - **Sleep**: Track your last night's sleep schedule (bedtime and wake time)
  - **Fuel**: View personalized meal suggestions with expandable details
  - **Passion**: Track time spent on your personalized daily passions

### User Management
- **Authentication**: Secure signup and login system
- **Profile Management**: Store personal details (name, age, height, weight)
- **Routine Settings**: Configure wake-up time, sleeping time, food intake times, daily tasks, and daily passions
- **Preferences**: Customize notifications, voice notifications, and more
- **Daily Feeling Selection**: Select and track your daily emotional state

### Smart Features
- **Fast AI Responses**: Powered by Groq's ultra-fast inference API
- **Context-Aware Conversations**: Chatbot remembers conversation history for better responses
- **Personalized Experience**: All features adapt to your profile, routine, and preferences

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **React Router** - Client-side routing with protected routes
- **Lucide React** - Icon library
- **LocalStorage** - Client-side data persistence

### Backend
- **FastAPI** - Modern Python web framework
- **Groq API** - AI model for coaching responses (Llama 3.1 70B Versatile)
- **ElevenLabs API** - Text-to-speech service
- **Uvicorn** - ASGI server
- **Python-dotenv** - Environment variable management
- **Requests** - HTTP library for API calls

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.12 or higher) - [Download](https://www.python.org/downloads/)
- **npm** or **yarn** (comes with Node.js)
- **pip** (Python package manager)

### API Keys Required

You'll need API keys from the following services:

1. **Groq API** - [Get API Key](https://console.groq.com/)
   - Free tier available with generous rate limits
   - Used for AI coaching responses, meal suggestions, and daily planning
   - Powered by Llama 3.1 70B Versatile model for best conversational AI experience

2. **ElevenLabs API** - [Get API Key](https://elevenlabs.io/app/settings/api-keys)
   - Free tier available with limited credits
   - Used for text-to-speech functionality
   - Model: `eleven_turbo_v2` (free-tier compatible)

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd imperfect-coach
```

### 2. Backend Setup

#### Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

#### Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cd backend
touch .env
```

Add your API keys to the `.env` file:

```env
GROQ_API_KEY=your_groq_api_key_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

**Important**: Never commit your `.env` file to version control!

#### Start the Backend Server

```bash
# Option 1: Using the start script
chmod +x start.sh
./start.sh

# Option 2: Using uvicorn directly
uvicorn main:app --reload --port 8000
```

The backend server will run on `http://localhost:8000`

### 3. Frontend Setup

#### Install Dependencies

```bash
# From the project root directory
npm install
```

#### Start the Development Server

```bash
npm run dev
```

The frontend will run on `http://localhost:8080` (or the port shown in the terminal)

## 🏗️ Project Structure

```
imperfect-coach/
├── backend/
│   ├── main.py              # FastAPI backend server
│   ├── requirements.txt     # Python dependencies
│   ├── start.sh            # Backend startup script
│   └── .env                # Environment variables (create this)
├── src/
│   ├── components/
│   │   ├── DailyTaskPlanner.tsx    # Daily task planner component
│   │   ├── CoachCorner.tsx       # Chatbot with TTS support
│   │   ├── GoalCard.tsx          # Focus areas cards (Sleep, Fuel, Passion)
│   │   ├── FeelingSelector.tsx   # Daily feeling selection dialog
│   │   ├── Navigation.tsx        # Top navigation with profile dropdown
│   │   ├── ProtectedRoute.tsx    # Route protection component
│   │   └── ui/                   # shadcn/ui components
│   ├── pages/
│   │   ├── Index.tsx             # Main dashboard
│   │   ├── Auth.tsx              # Login/Signup page
│   │   ├── ProfileSetup.tsx      # Initial profile setup
│   │   ├── Account.tsx           # Account details page
│   │   ├── Routine.tsx           # Routine settings page
│   │   ├── Preferences.tsx       # User preferences
│   │   └── NotFound.tsx           # 404 page
│   ├── context/
│   │   └── UserContext.tsx        # Global user state management
│   └── ...
├── package.json            # Frontend dependencies
└── README.md              # This file
```

## 🔧 How It Works

### Architecture Overview

1. **Frontend (React)**: User interacts with the web interface
2. **Backend (FastAPI)**: Handles API requests and integrates with AI services
3. **AI Services**: 
   - Groq's Llama 3.1 70B model for generating coaching responses, meal suggestions, and daily plans
   - ElevenLabs for converting text to speech
4. **LocalStorage**: Client-side persistence for user data, authentication, and preferences

### User Flow

1. **Authentication**: User signs up or logs in
2. **Profile Setup**: New users provide personal details (name, age, height, weight)
3. **Routine Configuration**: Users set up their daily routine (optional)
4. **Daily Interaction**:
   - Select daily feeling
   - Use Daily Task Planner to create personalized schedules
   - Chat with AI coach in Coach's Corner
   - Track focus areas (Sleep, Fuel, Passion)
5. **Voice Support**: Click volume icon on coach messages to hear audio responses

## 💻 Usage

### Starting the Application

1. **Start Backend** (Terminal 1):
   ```bash
   cd backend
   ./start.sh
   # or
   uvicorn main:app --reload --port 8000
   ```

2. **Start Frontend** (Terminal 2):
   ```bash
   npm run dev
   ```

3. **Open Browser**:
   - Navigate to `http://localhost:8080`
   - Sign up or log in
   - Complete profile setup (if new user)
   - Start using Imperfect Coach!

### Using the Application

1. **Daily Feeling**: Click the feeling badge in navigation to select your daily emotional state
2. **Daily Task Planner**: Enter your work schedule, activities, and insights to get a personalized daily plan
3. **Chat with Coach**: Use Coach's Corner to have conversations with your AI coach
4. **Listen to Responses**: Click the volume icon next to coach messages to hear audio
5. **Track Focus Areas**:
   - **Sleep**: Log your last night's bedtime and wake time
   - **Fuel**: View personalized meal suggestions (requires height/weight in profile)
   - **Passion**: Track time spent on your daily passions (set in Routine)
6. **Manage Settings**: 
   - **Account**: Update personal details
   - **Routine**: Configure daily schedule and passions
   - **Preferences**: Customize notifications and voice settings

## 🐛 Troubleshooting

### Backend Issues

**Problem**: `ELEVENLABS_API_KEY not configured`
- **Solution**: Make sure your `.env` file exists in the `backend` directory and contains the API key

**Problem**: `401 Unauthorized` from ElevenLabs
- **Solution**: 
  - Verify your API key is correct
  - Ensure your ElevenLabs account has TTS permissions
  - Check that you're using a free-tier compatible model (`eleven_turbo_v2`)

**Problem**: `429 Rate Limit Exceeded` from Groq
- **Solution**: 
  - Groq free tier has generous limits but may throttle at high usage
  - Wait a moment and try again
  - Check your usage at [Groq Console](https://console.groq.com/)

**Problem**: API key errors
- **Solution**: Verify your `GROQ_API_KEY` is correct in the `.env` file and restart the backend server

### Frontend Issues

**Problem**: CORS errors
- **Solution**: Ensure backend CORS is configured for your frontend port (default: 8080 or 8082)

**Problem**: Audio not playing
- **Solution**: 
  - Check browser console for errors
  - Verify backend is running
  - Check that ElevenLabs API key is valid
  - Click the volume icon to trigger audio (browser autoplay policies may block automatic playback)

**Problem**: Data not persisting
- **Solution**: 
  - Check browser localStorage is enabled
  - Clear localStorage and try again if data seems corrupted
  - Check browser console for errors

### General Issues

**Problem**: Changes not reflecting
- **Solution**: 
  - Restart both frontend and backend servers
  - Clear browser cache
  - Check that you're editing the correct files

## 🔐 Security Notes

- **Never commit `.env` files** to version control
- Keep your API keys secure and private
- Use environment variables for all sensitive data
- The `.env` file is already in `.gitignore`
- User data is stored in browser localStorage (client-side only)

## 📝 Environment Variables

### Backend `.env` File

```env
# Required: Groq API Key
GROQ_API_KEY=your_groq_api_key_here

# Required: ElevenLabs API Key (for text-to-speech)
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

## 🧪 Testing

### Test Backend Endpoints

```bash
# Health check
curl http://localhost:8000/

# Test TTS key
curl http://localhost:8000/test-tts-key

# Test coach endpoint
curl -X POST http://localhost:8000/agent/coach \
  -H "Content-Type: application/json" \
  -d '{"message": "I feel tired today", "feeling": "Tired", "focus_areas": []}'

# Test chatbot endpoint
curl -X POST http://localhost:8000/agent/chatbot \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "conversation_history": []}'

# Test meal suggestions
curl -X POST http://localhost:8000/agent/meal-suggestions \
  -H "Content-Type: application/json" \
  -d '{"height": 170, "weight": 70, "age": 25}'
```

## 🚢 Deployment

### Frontend Deployment

Build for production:
```bash
npm run build
```

The `dist` folder contains the production build.

### Backend Deployment

Ensure all environment variables are set in your production environment.

## 📄 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please open an issue in the repository.

## 📖 Project Story

For a detailed description of our inspiration, challenges, accomplishments, and future plans, see [PROJECT_DESCRIPTION.md](./PROJECT_DESCRIPTION.md).

### Quick Summary

- **Inspiration**: Creating a compassionate AI companion that embraces imperfection and validates emotions
- **What it does**: Provides empathetic AI coaching with personalized daily planning, meal suggestions, and voice-enabled support
- **How we built it**: React frontend with FastAPI backend, integrating Groq's Llama 3.1 70B model and ElevenLabs TTS
- **Challenges**: API integration, CORS configuration, browser autoplay policies, state management
- **Accomplishments**: Fast AI responses with Groq, beautiful UI/UX, robust error handling, personalized features, voice-enabled support
- **What we learned**: API integration best practices, modern web development, user-centered design, state management
- **What's next**: Enhanced personalization, mobile apps, voice input, mood tracking, and more

---

**Built with ❤️ for mindful living and self-compassion**

*Progress over perfection. You've got this. 💜*
