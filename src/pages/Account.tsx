import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Account = () => {
  const { userProfile, currentEmail, setUserProfile } = useUser();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || "");
      setAge(userProfile.age?.toString() || "");
      setHeight(userProfile.height?.toString() || "");
      setWeight(userProfile.weight?.toString() || "");
    }
  }, [userProfile]);

  const handleSave = () => {
    if (!name.trim()) {
      return;
    }
    setUserProfile({
      name: name.trim(),
      age: age ? parseInt(age) : 0,
      height: height ? parseFloat(height) : 0,
      weight: weight ? parseFloat(weight) : 0,
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
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Account Details
          </h1>
          <p className="text-muted-foreground mb-8">
            Manage your personal information
          </p>

          {currentEmail && (
            <div className="mb-6 p-4 rounded-xl bg-muted/30">
              <Label className="text-sm text-muted-foreground">Email</Label>
              <p className="text-foreground font-medium">{currentEmail}</p>
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="25"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min="1"
                max="120"
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                placeholder="170"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                min="50"
                max="250"
                step="0.1"
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="70"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                min="20"
                max="300"
                step="0.1"
                className="rounded-xl"
              />
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
                  Save Changes
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
