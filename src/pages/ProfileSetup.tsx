import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, ArrowRight } from "lucide-react";

const ProfileSetup = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [error, setError] = useState("");
  const { setUserProfile } = useUser();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }
    if (!age || parseInt(age) < 1 || parseInt(age) > 120) {
      setError("Please enter a valid age");
      return;
    }
    if (!height || parseFloat(height) < 50 || parseFloat(height) > 250) {
      setError("Please enter a valid height (50-250 cm)");
      return;
    }
    if (!weight || parseFloat(weight) < 20 || parseFloat(weight) > 300) {
      setError("Please enter a valid weight (20-300 kg)");
      return;
    }

    // Save profile
    setUserProfile({
      name: name.trim(),
      age: parseInt(age),
      height: parseFloat(height),
      weight: parseFloat(weight),
    });

    // Navigate to home
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-soft/20 via-background to-rose-soft/20 pointer-events-none" />
      
      <div className="relative w-full max-w-md">
        <div className="glass-card rounded-3xl p-8 animate-slide-up">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/80 to-lavender-soft flex items-center justify-center mx-auto mb-4 glow-indigo">
              <Heart className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Tell us about yourself
            </h1>
            <p className="text-muted-foreground">
              We'll use this to personalize your coaching experience
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
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
                required
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
                required
                className="rounded-xl"
              />
              <p className="text-xs text-muted-foreground">
                Example: 170 cm (5'7")
              </p>
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
                required
                className="rounded-xl"
              />
              <p className="text-xs text-muted-foreground">
                Example: 70 kg (154 lbs)
              </p>
            </div>

            <Button
              type="submit"
              className="w-full rounded-xl bg-primary hover:bg-primary/90 shadow-glow-indigo h-12 text-lg mt-6"
            >
              Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>

          {/* Skip option (optional) */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                // Set minimal profile and continue
                setUserProfile({
                  name: "friend",
                  age: 25,
                  height: 170,
                  weight: 70,
                });
                navigate("/");
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
