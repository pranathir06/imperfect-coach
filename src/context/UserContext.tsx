import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UserProfile {
  name: string;
  age: number;
  height: number; // in cm
  weight: number; // in kg
}

interface UserRoutine {
  wakeUpTime?: string; // e.g., "07:00"
  sleepingTime?: string; // e.g., "23:00"
  foodIntakeTimes?: string[]; // e.g., ["08:00", "13:00", "19:00"]
  dailyTasks?: string; // e.g., "work", "college", "other"
  dailyPassions?: string[]; // e.g., ["Reading", "Coding", "Music"]
}

interface UserPreferences {
  [key: string]: any; // Flexible preferences object
}

interface DailyFeeling {
  date: string; // YYYY-MM-DD format
  feeling: string; // e.g., "Determined", "Tired", "Inspired"
  emoji?: string; // Optional emoji
}

interface UserContextType {
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
  userRoutine: UserRoutine | null;
  userPreferences: UserPreferences | null;
  currentEmail: string | null;
  dailyFeeling: DailyFeeling | null;
  login: (email: string, password: string) => void;
  signup: (email: string, password: string) => void;
  setUserProfile: (profile: UserProfile) => void;
  setUserRoutine: (routine: UserRoutine) => void;
  setUserPreferences: (preferences: UserPreferences) => void;
  setDailyFeeling: (feeling: string, emoji?: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [currentEmail, setCurrentEmail] = useState<string | null>(() => {
    return localStorage.getItem("currentEmail");
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if user profile exists in localStorage
    const saved = localStorage.getItem("userProfile");
    return !!saved;
  });
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem("userProfile");
    return saved ? JSON.parse(saved) : null;
  });
  const [userRoutine, setUserRoutineState] = useState<UserRoutine | null>(() => {
    const saved = localStorage.getItem("userRoutine");
    return saved ? JSON.parse(saved) : null;
  });
  const [userPreferences, setUserPreferencesState] = useState<UserPreferences | null>(() => {
    const saved = localStorage.getItem("userPreferences");
    return saved ? JSON.parse(saved) : null;
  });

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const [dailyFeeling, setDailyFeelingState] = useState<DailyFeeling | null>(() => {
    const today = new Date().toISOString().split('T')[0];
    const saved = localStorage.getItem("dailyFeeling");
    if (saved) {
      const feeling = JSON.parse(saved);
      // Check if it's from today, if not return null
      if (feeling.date === today) {
        return feeling;
      }
    }
    return null;
  });

  const login = (email: string, password: string) => {
    // For now, simple authentication (in production, this would call an API)
    // Check if user exists in localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u: any) => u.email === email && u.password === password);
    
    if (user) {
      setIsAuthenticated(true);
      setCurrentEmail(email);
      localStorage.setItem("currentEmail", email);
      // Load user profile if exists
      const profile = localStorage.getItem(`profile_${email}`);
      if (profile) {
        const profileData = JSON.parse(profile);
        setUserProfileState(profileData);
        localStorage.setItem("userProfile", JSON.stringify(profileData));
      } else {
        // Check if there's a general userProfile (for backward compatibility)
        const generalProfile = localStorage.getItem("userProfile");
        if (generalProfile) {
          setUserProfileState(JSON.parse(generalProfile));
        }
      }
      // Load routine
      const routine = localStorage.getItem(`routine_${email}`) || localStorage.getItem("userRoutine");
      if (routine) {
        setUserRoutineState(JSON.parse(routine));
      }
      // Load preferences
      const preferences = localStorage.getItem(`preferences_${email}`) || localStorage.getItem("userPreferences");
      if (preferences) {
        setUserPreferencesState(JSON.parse(preferences));
      }
      // Load daily feeling
      const feeling = localStorage.getItem(`dailyFeeling_${email}`) || localStorage.getItem("dailyFeeling");
      if (feeling) {
        const feelingData = JSON.parse(feeling);
        // Only load if it's from today
        if (feelingData.date === getTodayDate()) {
          setDailyFeelingState(feelingData);
        }
      }
    } else {
      throw new Error("Invalid email or password");
    }
  };

  const signup = (email: string, password: string) => {
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.find((u: any) => u.email === email)) {
      throw new Error("User already exists");
    }
    
    // Add new user
    users.push({ email, password });
    localStorage.setItem("users", JSON.stringify(users));
    setIsAuthenticated(true);
    setCurrentEmail(email);
    localStorage.setItem("currentEmail", email);
  };

  const setUserProfile = (profile: UserProfile) => {
    setUserProfileState(profile);
    // Save to localStorage
    localStorage.setItem("userProfile", JSON.stringify(profile));
    // Also save with email if available
    if (currentEmail) {
      localStorage.setItem(`profile_${currentEmail}`, JSON.stringify(profile));
    }
  };

  const setUserRoutine = (routine: UserRoutine) => {
    setUserRoutineState(routine);
    localStorage.setItem("userRoutine", JSON.stringify(routine));
    if (currentEmail) {
      localStorage.setItem(`routine_${currentEmail}`, JSON.stringify(routine));
    }
  };

  const setUserPreferences = (preferences: UserPreferences) => {
    setUserPreferencesState(preferences);
    localStorage.setItem("userPreferences", JSON.stringify(preferences));
    if (currentEmail) {
      localStorage.setItem(`preferences_${currentEmail}`, JSON.stringify(preferences));
    }
  };

  const setDailyFeeling = (feeling: string, emoji?: string) => {
    const todayFeeling: DailyFeeling = {
      date: getTodayDate(),
      feeling,
      emoji,
    };
    setDailyFeelingState(todayFeeling);
    localStorage.setItem("dailyFeeling", JSON.stringify(todayFeeling));
    if (currentEmail) {
      localStorage.setItem(`dailyFeeling_${currentEmail}`, JSON.stringify(todayFeeling));
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserProfileState(null);
    setUserRoutineState(null);
    setUserPreferencesState(null);
    setDailyFeelingState(null);
    setCurrentEmail(null);
    localStorage.removeItem("userProfile");
    localStorage.removeItem("userRoutine");
    localStorage.removeItem("userPreferences");
    localStorage.removeItem("dailyFeeling");
    localStorage.removeItem("currentEmail");
    localStorage.removeItem("showMealPlan"); // Clear meal plan visibility on logout
  };

  return (
    <UserContext.Provider
      value={{
        isAuthenticated,
        userProfile,
        userRoutine,
        userPreferences,
        currentEmail,
        dailyFeeling,
        login,
        signup,
        setUserProfile,
        setUserRoutine,
        setUserPreferences,
        setDailyFeeling,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
