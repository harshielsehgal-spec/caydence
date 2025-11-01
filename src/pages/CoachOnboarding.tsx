import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Upload, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const SPORTS_OPTIONS = ["Cricket", "Football", "Basketball", "Tennis", "Badminton", "Running", "Swimming"];
const CITIES_OPTIONS = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune", "Kolkata"];
const LANGUAGES = ["English", "Hindi", "Tamil", "Telugu", "Kannada", "Malayalam", "Marathi"];

const CoachOnboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    photoUrl: "",
    bio: "",
    cities: [] as string[],
    sports: [] as string[],
    languages: [] as string[],
    yearsExperience: 0,
    perSessionFee: 500,
    mode: [] as string[],
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleSubmit = async () => {
    if (!formData.name || !formData.bio || formData.sports.length === 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.bio.length < 120 || formData.bio.length > 160) {
      toast.error("Bio must be between 120-160 characters");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("coaches").insert({
        user_id: user.id,
        name: formData.name,
        photo_url: formData.photoUrl,
        bio: formData.bio,
        sports: formData.sports,
        cities: formData.cities,
        languages: formData.languages,
        years_experience: formData.yearsExperience,
        per_session_fee: formData.perSessionFee,
        mode: formData.mode,
      });

      if (error) throw error;

      toast.success("Coach profile created successfully!");
      navigate("/coach/home");
    } catch (error: any) {
      console.error("Onboarding error:", error);
      toast.error(error.message || "Failed to create profile");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (array: string[], item: string) => {
    return array.includes(item)
      ? array.filter((i) => i !== item)
      : [...array, item];
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-3">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="bio">Bio (120-160 characters) *</Label>
              <Textarea
                id="bio"
                placeholder="Certified cricket coach with 10+ years experience. Specialized in batting techniques and mental training..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="min-h-[100px]"
              />
              <div className="text-xs text-muted-foreground text-right">
                {formData.bio.length}/160
              </div>
            </div>

            <div className="space-y-3">
              <Label>Profile Photo (Optional)</Label>
              <div className="flex items-center gap-3">
                <Button type="button" variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Photo
                </Button>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-3">
              <Label>Sports You Coach *</Label>
              <div className="grid grid-cols-2 gap-2">
                {SPORTS_OPTIONS.map((sport) => (
                  <button
                    key={sport}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        sports: toggleSelection(formData.sports, sport),
                      })
                    }
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-smooth border-2 ${
                      formData.sports.includes(sport)
                        ? "bg-vibrantOrange border-vibrantOrange text-white shadow-orange-glow"
                        : "bg-charcoal/60 border-vibrantOrange/30 text-coolGray hover:border-vibrantOrange/60 hover:text-white"
                    }`}
                  >
                    {sport}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Years of Experience</Label>
              <Input
                type="number"
                min="0"
                value={formData.yearsExperience}
                onChange={(e) =>
                  setFormData({ ...formData, yearsExperience: parseInt(e.target.value) || 0 })
                }
              />
            </div>

            <div className="space-y-3">
              <Label>Languages</Label>
              <div className="grid grid-cols-3 gap-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        languages: toggleSelection(formData.languages, lang),
                      })
                    }
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-smooth border ${
                      formData.languages.includes(lang)
                        ? "bg-vibrantOrange/20 border-vibrantOrange text-white"
                        : "bg-charcoal/40 border-border text-coolGray hover:text-white"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-3">
              <Label>Per-Session Fee (₹)</Label>
              <Input
                type="number"
                min="100"
                step="100"
                value={formData.perSessionFee}
                onChange={(e) =>
                  setFormData({ ...formData, perSessionFee: parseInt(e.target.value) || 500 })
                }
              />
            </div>

            <div className="space-y-3">
              <Label>Cities You Serve</Label>
              <div className="grid grid-cols-2 gap-2">
                {CITIES_OPTIONS.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        cities: toggleSelection(formData.cities, city),
                      })
                    }
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-smooth border ${
                      formData.cities.includes(city)
                        ? "bg-vibrantOrange/20 border-vibrantOrange text-white"
                        : "bg-charcoal/60 border-border text-coolGray hover:text-white"
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Coaching Mode</Label>
              <div className="grid grid-cols-3 gap-2">
                {["online", "offline", "hybrid"].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        mode: toggleSelection(formData.mode, mode),
                      })
                    }
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium capitalize transition-smooth border ${
                      formData.mode.includes(mode)
                        ? "bg-vibrantOrange border-vibrantOrange text-white shadow-orange-glow"
                        : "bg-charcoal/60 border-border text-coolGray hover:text-white"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-vibrantOrange mx-auto animate-bounce-subtle" />
              <h3 className="text-2xl font-bold text-white font-heading">Profile Preview</h3>
              <p className="text-coolGray">Review your information before submitting</p>
            </div>

            <Card className="bg-charcoal/60 border-vibrantOrange/30">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <span className="text-coolGray text-sm">Name:</span>
                  <p className="text-white font-medium">{formData.name}</p>
                </div>
                <div>
                  <span className="text-coolGray text-sm">Bio:</span>
                  <p className="text-white text-sm">{formData.bio}</p>
                </div>
                <div>
                  <span className="text-coolGray text-sm">Sports:</span>
                  <p className="text-white">{formData.sports.join(", ") || "None"}</p>
                </div>
                <div>
                  <span className="text-coolGray text-sm">Experience:</span>
                  <p className="text-white">{formData.yearsExperience} years</p>
                </div>
                <div>
                  <span className="text-coolGray text-sm">Fee:</span>
                  <p className="text-vibrantOrange font-semibold">₹{formData.perSessionFee}/session</p>
                </div>
                <div>
                  <span className="text-coolGray text-sm">Mode:</span>
                  <p className="text-white capitalize">{formData.mode.join(", ") || "None"}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D0D0D] via-[#1A1A1A] to-[#0D0D0D] p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-charcoal/80 border-vibrantOrange/30 shadow-orange-glow">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-2xl md:text-3xl font-heading text-white">
                Coach Onboarding
              </CardTitle>
              <span className="text-sm text-coolGray">
                Step {step} of {totalSteps}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardHeader>

          <CardContent className="space-y-8">
            {renderStep()}

            <div className="flex gap-3 pt-4">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  disabled={loading}
                  className="flex-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}

              {step < totalSteps ? (
                <Button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  disabled={loading}
                  className="flex-1"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1"
                  variant="glow"
                >
                  {loading ? "Creating Profile..." : "Complete Setup"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CoachOnboarding;
