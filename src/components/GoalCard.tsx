import { useState, useEffect } from "react";
import { Moon, Salad, Music, Heart, Clock, Check, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";

type CardType = "sleep" | "fuel" | "passion";

interface GoalCardProps {
  type: CardType;
  className?: string;
  style?: React.CSSProperties;
}

const cardConfig = {
  sleep: {
    icon: Moon,
    title: "Sleep",
    emoji: "🌙",
    gradient: "card-sleep",
  },
  fuel: {
    icon: Salad,
    title: "Fuel",
    emoji: "🥗",
    gradient: "card-fuel",
  },
  passion: {
    icon: Music,
    title: "Passion",
    emoji: "💃",
    gradient: "card-passion",
  },
};

const SleepCard = () => {
  const { userRoutine } = useUser();
  const [bedtime, setBedtime] = useState("");
  const [wakeTime, setWakeTime] = useState("");
  const [saved, setSaved] = useState(false);

  // Load saved sleep data from localStorage
  useEffect(() => {
    const savedSleep = localStorage.getItem("lastNightSleep");
    if (savedSleep) {
      try {
        const parsed = JSON.parse(savedSleep);
        const today = new Date().toISOString().split("T")[0];
        // Only load if it's from today
        if (parsed.date === today) {
          setBedtime(parsed.bedtime || "");
          setWakeTime(parsed.wakeTime || "");
        }
      } catch (e) {
        console.error("Error loading sleep data:", e);
      }
    }
  }, []);

  const handleSave = () => {
    if (bedtime && wakeTime) {
      const today = new Date().toISOString().split("T")[0];
      localStorage.setItem("lastNightSleep", JSON.stringify({
        date: today,
        bedtime,
        wakeTime,
      }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        How did you sleep last night?
      </p>
      
      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="bedtime" className="text-xs">Bedtime</Label>
          <Input
            id="bedtime"
            type="time"
            value={bedtime}
            onChange={(e) => setBedtime(e.target.value)}
            className="rounded-xl"
            placeholder="e.g., 23:00"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="wakeTime" className="text-xs">Wake Time</Label>
          <Input
            id="wakeTime"
            type="time"
            value={wakeTime}
            onChange={(e) => setWakeTime(e.target.value)}
            className="rounded-xl"
            placeholder="e.g., 07:00"
          />
        </div>
      </div>

      {bedtime && wakeTime && (
        <div className="p-3 rounded-xl bg-card/50 border border-border/50">
          <p className="text-xs text-muted-foreground mb-1">Last night's sleep:</p>
          <p className="text-sm font-medium text-foreground">
            {bedtime} – {wakeTime}
          </p>
        </div>
      )}

      <Button
        onClick={handleSave}
        disabled={!bedtime || !wakeTime}
        className="w-full rounded-xl bg-primary/80 hover:bg-primary text-primary-foreground font-medium transition-all hover:scale-[1.02] disabled:opacity-50"
      >
        {saved ? (
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            Saved!
          </span>
        ) : (
          "Save Sleep Schedule"
        )}
      </Button>
    </div>
  );
};

interface MealSuggestion {
  name: string;
  description: string;
  calories: string;
}

interface MealSuggestions {
  meals: {
    breakfast: MealSuggestion;
    lunch: MealSuggestion;
    dinner: MealSuggestion;
  };
  snacks: MealSuggestion[];
  summary: string;
}

const FuelCard = () => {
  const { userProfile } = useUser();
  const [suggestions, setSuggestions] = useState<MealSuggestions | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [showMealPlan, setShowMealPlan] = useState(() => {
    // Load from localStorage - persists until logout
    return localStorage.getItem("showMealPlan") === "true";
  });

  const fetchMealSuggestions = async () => {
    if (!userProfile?.height || !userProfile?.weight) {
      setError("Please add your height and weight in Account Details to get personalized meal suggestions");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:8000/agent/meal-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          height: userProfile.height,
          weight: userProfile.weight,
          age: userProfile.age,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error("Error fetching meal suggestions:", err);
      setError("Failed to load meal suggestions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowMealPlan = () => {
    setShowMealPlan(true);
    localStorage.setItem("showMealPlan", "true");
    // Fetch suggestions when button is clicked
    if (!suggestions && userProfile?.height && userProfile?.weight) {
      fetchMealSuggestions();
    }
  };

  // Auto-fetch suggestions if meal plan is already shown (from localStorage) and we have profile data
  useEffect(() => {
    if (showMealPlan && userProfile?.height && userProfile?.weight && !suggestions && !isLoading && !error) {
      fetchMealSuggestions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMealPlan, userProfile?.height, userProfile?.weight]);

  return (
    <div className="space-y-4">
      {!userProfile?.height || !userProfile?.weight ? (
        <div className="p-3 rounded-xl bg-amber-soft/20 border border-amber-soft/30">
          <p className="text-xs text-muted-foreground">
            Add your height and weight in Account Details to get personalized meal suggestions
          </p>
        </div>
      ) : !showMealPlan ? (
        <Button
          onClick={handleShowMealPlan}
          className="w-full rounded-xl bg-primary/80 hover:bg-primary text-primary-foreground font-medium transition-all hover:scale-[1.02]"
        >
          Show Meal Plan
        </Button>
      ) : (
        <>
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="p-3 rounded-xl bg-rose-soft/20 border border-rose-soft/30">
              <p className="text-xs text-muted-foreground">{error}</p>
              <Button
                onClick={fetchMealSuggestions}
                variant="ghost"
                size="sm"
                className="mt-2 text-xs"
              >
                Try Again
              </Button>
            </div>
          ) : suggestions && suggestions.meals ? (
            <div className="space-y-3">
              {/* Meals */}
              <div className="space-y-2">
                {/* Breakfast */}
                {suggestions.meals.breakfast && (
                <div className="p-2 rounded-lg bg-emerald-soft/20 border border-emerald-soft/30">
                  <button
                    onClick={() => {
                      if (expandedItems.includes("breakfast")) {
                        setExpandedItems(expandedItems.filter(item => item !== "breakfast"));
                      } else {
                        setExpandedItems([...expandedItems, "breakfast"]);
                      }
                    }}
                    className="w-full flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-foreground">🍳 Breakfast</span>
                      <span className="text-xs text-muted-foreground">{suggestions.meals.breakfast.name || "Breakfast"}</span>
                    </div>
                    {expandedItems.includes("breakfast") ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                  {expandedItems.includes("breakfast") && (
                    <div className="mt-2 pt-2 border-t border-emerald-soft/30">
                      <p className="text-xs text-muted-foreground/70">{suggestions.meals.breakfast.description}</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">~{suggestions.meals.breakfast.calories} cal</p>
                    </div>
                  )}
                </div>
                )}
                
                {/* Lunch */}
                {suggestions.meals.lunch && (
                <div className="p-2 rounded-lg bg-amber-soft/20 border border-amber-soft/30">
                  <button
                    onClick={() => {
                      if (expandedItems.includes("lunch")) {
                        setExpandedItems(expandedItems.filter(item => item !== "lunch"));
                      } else {
                        setExpandedItems([...expandedItems, "lunch"]);
                      }
                    }}
                    className="w-full flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-foreground">🍽️ Lunch</span>
                      <span className="text-xs text-muted-foreground">{suggestions.meals.lunch.name || "Lunch"}</span>
                    </div>
                    {expandedItems.includes("lunch") ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                  {expandedItems.includes("lunch") && (
                    <div className="mt-2 pt-2 border-t border-amber-soft/30">
                      <p className="text-xs text-muted-foreground/70">{suggestions.meals.lunch.description}</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">~{suggestions.meals.lunch.calories} cal</p>
                    </div>
                  )}
                </div>
                )}
                
                {/* Dinner */}
                {suggestions.meals.dinner && (
                <div className="p-2 rounded-lg bg-blue-soft/20 border border-blue-soft/30">
                  <button
                    onClick={() => {
                      if (expandedItems.includes("dinner")) {
                        setExpandedItems(expandedItems.filter(item => item !== "dinner"));
                      } else {
                        setExpandedItems([...expandedItems, "dinner"]);
                      }
                    }}
                    className="w-full flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-foreground">🌙 Dinner</span>
                      <span className="text-xs text-muted-foreground">{suggestions.meals.dinner.name || "Dinner"}</span>
                    </div>
                    {expandedItems.includes("dinner") ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                  {expandedItems.includes("dinner") && (
                    <div className="mt-2 pt-2 border-t border-blue-soft/30">
                      <p className="text-xs text-muted-foreground/70">{suggestions.meals.dinner.description}</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">~{suggestions.meals.dinner.calories} cal</p>
                    </div>
                  )}
                </div>
                )}
              </div>

              {/* Snacks */}
              {suggestions.snacks && suggestions.snacks.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-foreground">🍎 Snacks</p>
                  {suggestions.snacks.map((snack, idx) => {
                    const snackKey = `snack-${idx}`;
                    return (
                      <div key={idx} className="p-2 rounded-lg bg-muted/30 border border-border/30">
                        <button
                          onClick={() => {
                            if (expandedItems.includes(snackKey)) {
                              setExpandedItems(expandedItems.filter(item => item !== snackKey));
                            } else {
                              setExpandedItems([...expandedItems, snackKey]);
                            }
                          }}
                          className="w-full flex items-center justify-between"
                        >
                          <span className="text-xs text-muted-foreground">{snack.name}</span>
                          {expandedItems.includes(snackKey) ? (
                            <ChevronUp className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          )}
                        </button>
                        {expandedItems.includes(snackKey) && (
                          <div className="mt-2 pt-2 border-t border-border/30">
                            <p className="text-xs text-muted-foreground/70">{snack.description}</p>
                            <p className="text-xs text-muted-foreground/60 mt-0.5">~{snack.calories} cal</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {suggestions.summary && (
                <p className="text-xs text-muted-foreground italic mt-2">{suggestions.summary}</p>
              )}

              <Button
                onClick={fetchMealSuggestions}
                variant="ghost"
                size="sm"
                className="w-full text-xs"
                disabled={isLoading}
              >
                Refresh Suggestions
              </Button>
            </div>
          ) : (
            <Button
              onClick={fetchMealSuggestions}
              className="w-full rounded-xl bg-primary/80 hover:bg-primary text-primary-foreground"
            >
              Get Meal Suggestions
            </Button>
          )}
        </>
      )}
    </div>
  );
};

const PassionCard = () => {
  const { userRoutine } = useUser();
  const [minutes, setMinutes] = useState(45);
  
  // Get activities from routine's dailyPassions
  const getActivities = () => {
    if (userRoutine?.dailyPassions && userRoutine.dailyPassions.length > 0) {
      // Use the passions from routine (up to 3)
      return userRoutine.dailyPassions.slice(0, 3);
    }
    // Default activities if no passions are set
    return ["Reading", "Exercise", "Hobby"];
  };

  const activities = getActivities();
  const [activeActivity, setActiveActivity] = useState(activities[0] || "Reading");

  // Update active activity when activities change
  useEffect(() => {
    if (activities.length > 0 && !activities.includes(activeActivity)) {
      setActiveActivity(activities[0]);
    }
  }, [userRoutine?.dailyPassions]);

  return (
    <div className="space-y-4">
      {!userRoutine?.dailyPassions || userRoutine.dailyPassions.length === 0 ? (
        <p className="text-xs text-muted-foreground mb-2">
          Add your daily passions in Routine settings to personalize this card
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {activities.map((activity) => (
          <button
            key={activity}
            onClick={() => setActiveActivity(activity)}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
              activeActivity === activity
                ? "bg-secondary text-secondary-foreground shadow-glow-rose"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {activity}
          </button>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-card/50 border border-border/50 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Time invested today</span>
          <span className="font-display text-2xl font-bold text-foreground">
            {minutes} <span className="text-base font-normal text-muted-foreground">min</span>
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-secondary to-rose-soft rounded-full transition-all duration-500"
            style={{ width: `${Math.min((minutes / 60) * 100, 100)}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">Goal: 60 min / day</p>
      </div>

      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMinutes((m) => Math.max(0, m - 15))}
          className="flex-1 rounded-xl bg-muted hover:bg-muted/80"
        >
          -15 min
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMinutes((m) => m + 15)}
          className="flex-1 rounded-xl bg-secondary/50 hover:bg-secondary/70 text-secondary-foreground"
        >
          +15 min
        </Button>
      </div>
    </div>
  );
};

const GoalCard = ({ type, className, style }: GoalCardProps) => {
  const config = cardConfig[type];
  const Icon = config.icon;

  const renderContent = () => {
    switch (type) {
      case "sleep":
        return <SleepCard />;
      case "fuel":
        return <FuelCard />;
      case "passion":
        return <PassionCard />;
    }
  };

  return (
    <div 
      className={cn(
        "rounded-3xl p-6 transition-all hover:scale-[1.02] hover:shadow-lg",
        config.gradient,
        className
      )}
      style={style}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-2xl bg-card/60 backdrop-blur-sm flex items-center justify-center">
          <span className="text-2xl">{config.emoji}</span>
        </div>
        <h3 className="font-display text-xl font-bold text-foreground">
          {config.title}
        </h3>
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
};

export default GoalCard;
