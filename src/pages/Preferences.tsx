import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";

const Preferences = () => {
  const { userPreferences, setUserPreferences } = useUser();
  const navigate = useNavigate();
  const [preferences, setPreferencesState] = useState({
    notifications: true,
    voiceEnabled: true,
    darkMode: false,
    ...userPreferences,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (userPreferences) {
      setPreferencesState((prev) => ({ ...prev, ...userPreferences }));
    }
  }, [userPreferences]);

  const handleSave = () => {
    setUserPreferences(preferences);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const togglePreference = (key: string) => {
    setPreferencesState((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
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
            <Settings className="w-8 h-8 text-primary" />
            <h1 className="font-display text-3xl font-bold text-foreground">
              Preferences
            </h1>
          </div>
          <p className="text-muted-foreground mb-8">
            Customize your Imperfect Coach experience
          </p>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
              <div className="space-y-0.5">
                <Label htmlFor="notifications" className="text-base">
                  Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive coaching reminders and updates
                </p>
              </div>
              <Switch
                id="notifications"
                checked={preferences.notifications}
                onCheckedChange={() => togglePreference("notifications")}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
              <div className="space-y-0.5">
                <Label htmlFor="voiceEnabled" className="text-base">
                  Voice Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Play audio when coach responds
                </p>
              </div>
              <Switch
                id="voiceEnabled"
                checked={preferences.voiceEnabled}
                onCheckedChange={() => togglePreference("voiceEnabled")}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
              <div className="space-y-0.5">
                <Label htmlFor="darkMode" className="text-base">
                  Dark Mode
                </Label>
                <p className="text-sm text-muted-foreground">
                  Use dark theme (coming soon)
                </p>
              </div>
              <Switch
                id="darkMode"
                checked={preferences.darkMode}
                onCheckedChange={() => togglePreference("darkMode")}
                disabled
              />
            </div>

            <Button
              onClick={handleSave}
              className="w-full rounded-xl bg-primary hover:bg-primary/90 shadow-glow-indigo h-12 text-lg mt-6"
            >
              {saved ? (
                <span className="flex items-center gap-2">
                  <span>✓ Saved!</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="w-5 h-5" />
                  Save Preferences
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preferences;
