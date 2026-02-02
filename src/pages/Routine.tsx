import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Plus, X, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Routine = () => {
  const { userRoutine, setUserRoutine } = useUser();
  const navigate = useNavigate();
  const [wakeUpTime, setWakeUpTime] = useState("");
  const [sleepingTime, setSleepingTime] = useState("");
  const [foodTimes, setFoodTimes] = useState<string[]>([]);
  const [newFoodTime, setNewFoodTime] = useState("");
  const [dailyTasks, setDailyTasks] = useState("");
  const [passions, setPassions] = useState<string[]>([]);
  const [newPassion, setNewPassion] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (userRoutine) {
      setWakeUpTime(userRoutine.wakeUpTime || "");
      setSleepingTime(userRoutine.sleepingTime || "");
      setFoodTimes(userRoutine.foodIntakeTimes || []);
      setDailyTasks(userRoutine.dailyTasks || "");
      setPassions(userRoutine.dailyPassions || []);
    }
  }, [userRoutine]);

  const handleAddFoodTime = () => {
    if (newFoodTime.trim() && !foodTimes.includes(newFoodTime.trim())) {
      setFoodTimes([...foodTimes, newFoodTime.trim()]);
      setNewFoodTime("");
    }
  };

  const handleRemoveFoodTime = (time: string) => {
    setFoodTimes(foodTimes.filter((t) => t !== time));
  };

  const handleAddPassion = () => {
    if (newPassion.trim() && !passions.includes(newPassion.trim())) {
      setPassions([...passions, newPassion.trim()]);
      setNewPassion("");
    }
  };

  const handleRemovePassion = (passion: string) => {
    setPassions(passions.filter((p) => p !== passion));
  };

  const handleSave = () => {
    setUserRoutine({
      wakeUpTime: wakeUpTime || undefined,
      sleepingTime: sleepingTime || undefined,
      foodIntakeTimes: foodTimes.length > 0 ? foodTimes : undefined,
      dailyTasks: dailyTasks || undefined,
      dailyPassions: passions.length > 0 ? passions : undefined,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-soft/20 via-background to-rose-soft/20 pointer-events-none" />
      
      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="glass-card rounded-3xl p-8 animate-slide-up">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-8 h-8 text-primary" />
            <h1 className="font-display text-3xl font-bold text-foreground">
              Routine
            </h1>
          </div>
          <p className="text-muted-foreground mb-8">
            Set your daily routine. All fields are optional - fill in what you'd like.
          </p>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="wakeUp">Wake Up Time</Label>
              <Input
                id="wakeUp"
                type="time"
                value={wakeUpTime}
                onChange={(e) => setWakeUpTime(e.target.value)}
                className="rounded-xl"
              />
              <p className="text-xs text-muted-foreground">
                When do you typically wake up?
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sleeping">Sleeping Time</Label>
              <Input
                id="sleeping"
                type="time"
                value={sleepingTime}
                onChange={(e) => setSleepingTime(e.target.value)}
                className="rounded-xl"
              />
              <p className="text-xs text-muted-foreground">
                When do you typically go to sleep?
              </p>
            </div>

            <div className="space-y-2">
              <Label>Food Intake Times</Label>
              <div className="flex gap-2">
                <Input
                  type="time"
                  placeholder="Add meal time"
                  value={newFoodTime}
                  onChange={(e) => setNewFoodTime(e.target.value)}
                  className="rounded-xl"
                />
                <Button
                  type="button"
                  onClick={handleAddFoodTime}
                  size="icon"
                  className="rounded-xl"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {foodTimes.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {foodTimes.map((time) => (
                    <div
                      key={time}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm"
                    >
                      <span>{time}</span>
                      <button
                        onClick={() => handleRemoveFoodTime(time)}
                        className="hover:text-destructive transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Add your meal times (breakfast, lunch, dinner, etc.)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dailyTasks">Daily Tasks</Label>
              <Input
                id="dailyTasks"
                type="text"
                placeholder="e.g., work, college, other"
                value={dailyTasks}
                onChange={(e) => setDailyTasks(e.target.value)}
                className="rounded-xl"
              />
              <p className="text-xs text-muted-foreground">
                What are your main daily activities?
              </p>
            </div>

            <div className="space-y-2">
              <Label>Daily Passions</Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="e.g., Reading, Coding, Music"
                  value={newPassion}
                  onChange={(e) => setNewPassion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddPassion();
                    }
                  }}
                  className="rounded-xl"
                />
                <Button
                  type="button"
                  onClick={handleAddPassion}
                  size="icon"
                  className="rounded-xl"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {passions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {passions.map((passion) => (
                    <div
                      key={passion}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/20 text-secondary-foreground text-sm"
                    >
                      <span>{passion}</span>
                      <button
                        onClick={() => handleRemovePassion(passion)}
                        className="hover:text-destructive transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Add your passions or hobbies that you want to do daily (up to 3)
              </p>
            </div>

            <Button
              onClick={handleSave}
              className="w-full rounded-xl bg-primary hover:bg-primary/90 shadow-glow-indigo h-12 text-lg"
            >
              {saved ? (
                <span className="flex items-center gap-2">
                  <span>✓ Saved!</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="w-5 h-5" />
                  Save Routine
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Routine;
