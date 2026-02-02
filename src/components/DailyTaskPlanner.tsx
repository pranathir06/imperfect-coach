import { useState } from "react";
import { Calendar, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useUser } from "@/context/UserContext";

interface DailyTaskPlannerProps {
  userName?: string;
}

interface TaskPlan {
  schedule: Array<{
    time: string;
    task: string;
    type: "work" | "food" | "exercise" | "water" | "other" | "break";
  }>;
  summary: string;
}

const DailyTaskPlanner = ({ userName = "friend" }: DailyTaskPlannerProps) => {
  const { userRoutine, userProfile, dailyFeeling } = useUser();
  const [workSchedule, setWorkSchedule] = useState("");
  const [otherActivities, setOtherActivities] = useState("");
  const [otherInsights, setOtherInsights] = useState("");
  const [taskPlan, setTaskPlan] = useState<TaskPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePlan = async () => {
    if (!workSchedule.trim() && !otherActivities.trim()) {
      return;
    }

    setIsGenerating(true);
    setTaskPlan(null);

    try {
      const res = await fetch("http://localhost:8000/agent/daily-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          work_schedule: workSchedule.trim(),
          other_activities: otherActivities.trim(),
          other_insights: otherInsights.trim() || undefined,
          routine: {
            wake_up_time: userRoutine?.wakeUpTime,
            sleeping_time: userRoutine?.sleepingTime,
            food_times: userRoutine?.foodIntakeTimes || [],
            daily_tasks: userRoutine?.dailyTasks,
          },
          user_profile: {
            name: userProfile?.name,
            age: userProfile?.age,
            height: userProfile?.height,
            weight: userProfile?.weight,
          },
          feeling: dailyFeeling?.feeling || "Unknown",
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server error: ${res.status} - ${errorText}`);
      }

      const data = await res.json();
      setTaskPlan(data);
    } catch (err) {
      console.error("Error generating plan:", err);
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      setTaskPlan({
        schedule: [],
        summary: `I'm having trouble creating your plan right now. ${errorMessage}. Please try again.`,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getTaskTypeColor = (type: string) => {
    switch (type) {
      case "work":
        return "bg-blue-soft/30 border-blue-soft/50";
      case "food":
        return "bg-amber-soft/30 border-amber-soft/50";
      case "exercise":
        return "bg-emerald-soft/30 border-emerald-soft/50";
      case "water":
        return "bg-cyan-soft/30 border-cyan-soft/50";
      case "break":
        return "bg-lavender-soft/30 border-lavender-soft/50";
      default:
        return "bg-muted/30 border-border/50";
    }
  };

  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case "work":
        return "💼";
      case "food":
        return "🍽️";
      case "exercise":
        return "💪";
      case "water":
        return "💧";
      case "break":
        return "☕";
      default:
        return "📝";
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/80 to-lavender-soft flex items-center justify-center shrink-0 glow-indigo">
          <Calendar className="w-6 h-6 text-primary-foreground" />
        </div>
        
        <div className="flex-1 space-y-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-foreground mb-1">
              Daily Task Planner
            </h2>
            <p className="text-sm text-muted-foreground">
              Tell me about your day, and I'll create a balanced schedule for you
            </p>
          </div>
          
          {/* Work Schedule Input */}
          <div className="space-y-2">
            <Label htmlFor="workSchedule">Work Schedule</Label>
            <Textarea
              id="workSchedule"
              value={workSchedule}
              onChange={(e) => setWorkSchedule(e.target.value)}
              placeholder="e.g., 9 AM - 5 PM office work, meetings at 10 AM and 2 PM"
              className="min-h-[60px] rounded-xl border-border/50 bg-muted/30 resize-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all placeholder:text-muted-foreground/60"
            />
          </div>

          {/* Other Activities Input */}
          <div className="space-y-2">
            <Label htmlFor="otherActivities">Other Activities & Plans</Label>
            <Textarea
              id="otherActivities"
              value={otherActivities}
              onChange={(e) => setOtherActivities(e.target.value)}
              placeholder="e.g., grocery shopping at 6 PM, call with friend at 7 PM, reading time"
              className="min-h-[60px] rounded-xl border-border/50 bg-muted/30 resize-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all placeholder:text-muted-foreground/60"
            />
          </div>

          {/* Other Insights Input */}
          <div className="space-y-2">
            <Label htmlFor="otherInsights">
              Other Insights <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
            </Label>
            <Textarea
              id="otherInsights"
              value={otherInsights}
              onChange={(e) => setOtherInsights(e.target.value)}
              placeholder="e.g., feeling tired today, need to focus on deep work, have a deadline, want to exercise more, feeling stressed about something..."
              className="min-h-[60px] rounded-xl border-border/50 bg-muted/30 resize-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all placeholder:text-muted-foreground/60"
            />
            <p className="text-xs text-muted-foreground">
              Share any additional context that might help create a better plan for your day
            </p>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGeneratePlan}
            disabled={isGenerating || (!workSchedule.trim() && !otherActivities.trim())}
            className="w-full rounded-xl bg-primary hover:bg-primary/90 shadow-glow-indigo h-12 text-lg disabled:opacity-50"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating your plan...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span>Generate Daily Plan</span>
              </span>
            )}
          </Button>

          {/* Task Plan Display */}
          {taskPlan && (
            <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-emerald-soft/20 to-accent/10 border border-accent/30 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <h3 className="font-display text-lg font-semibold text-foreground">
                  Your Daily Plan
                </h3>
              </div>

              {/* Schedule Timeline */}
              {taskPlan.schedule && taskPlan.schedule.length > 0 && (
                <div className="space-y-3 mb-4">
                  {taskPlan.schedule.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 p-3 rounded-xl border ${getTaskTypeColor(item.type)}`}
                    >
                      <div className="flex-shrink-0 w-16 text-sm font-medium text-foreground/80">
                        {item.time}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getTaskTypeIcon(item.type)}</span>
                          <p className="text-sm text-foreground/90 leading-relaxed">
                            {item.task}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Summary */}
              {taskPlan.summary && (
                <div className="p-4 rounded-xl bg-muted/30 border border-primary/20">
                  <p className="text-sm text-foreground/90 leading-relaxed italic">
                    {taskPlan.summary}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Info about routine integration */}
          {userRoutine && (userRoutine.wakeUpTime || userRoutine.foodIntakeTimes?.length) && (
            <p className="text-xs text-muted-foreground italic">
              💡 Using your routine settings: {userRoutine.wakeUpTime && `Wake up at ${userRoutine.wakeUpTime}`}
              {userRoutine.foodIntakeTimes && userRoutine.foodIntakeTimes.length > 0 && 
                `, ${userRoutine.foodIntakeTimes.length} meal time(s)`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyTaskPlanner;
