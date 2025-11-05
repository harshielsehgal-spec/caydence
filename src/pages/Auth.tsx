import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Dumbbell } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AddRoleDialog } from "@/components/AddRoleDialog";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Step 1: Role picker (default), Step 2: Auth form
  const [step, setStep] = useState<"picker" | "form">("picker");
  const [isLogin, setIsLogin] = useState(true);
  const [pendingRole, setPendingRole] = useState<"athlete" | "coach">("athlete");
  const [loading, setLoading] = useState(false);
  const [showAddRoleDialog, setShowAddRoleDialog] = useState(false);
  const [existingUserId, setExistingUserId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    age: "",
    gender: "",
    city: "",
  });

  // Prefill from URL params
  useEffect(() => {
    const emailParam = searchParams.get("email");
    const roleParam = searchParams.get("role") as "athlete" | "coach" | null;
    const modeParam = searchParams.get("mode");

    if (emailParam) setFormData(prev => ({ ...prev, email: emailParam }));
    if (roleParam) setPendingRole(roleParam);
    if (modeParam === "signup") setIsLogin(false);
    
    // If params present, skip to form
    if (emailParam || roleParam || modeParam) {
      setStep("form");
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Attempt sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        // Email not found or wrong password
        if (error.message.includes("Invalid login credentials")) {
          // Check if it's a new email by attempting to find user
          const { data: users } = await supabase
            .from("user_roles")
            .select("user_id")
            .limit(1);
          
          // If we can't verify, assume it's unregistered
          toast.error("This email isn't registered. Let's create your account.");
          setTimeout(() => {
            navigate(`/auth?mode=signup&email=${encodeURIComponent(formData.email)}&role=${pendingRole}`);
          }, 1500);
          return;
        }
        throw error;
      }

      // Clear old session data
      const oldKeys = Object.keys(localStorage).filter(key => 
        key.includes('cadenceSwipeState_') && !key.includes(data.user.id)
      );
      oldKeys.forEach(key => localStorage.removeItem(key));

      // Fetch user roles
      const { data: rolesData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id);

      const userRoles = (rolesData?.map(r => r.role) || []) as Array<"athlete" | "coach">;

      // Check if user has the pending role
      if (!userRoles.includes(pendingRole)) {
        // Show add role modal
        setExistingUserId(data.user.id);
        setShowAddRoleDialog(true);
        setLoading(false);
        return;
      }

      // Success - set active role and route
      localStorage.setItem("currentRole", pendingRole);
      toast.success("Login successful!");
      routeAfterAuth(pendingRole);
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;
      if (!data.user) throw new Error("Signup failed");

      // Insert role
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({ user_id: data.user.id, role: pendingRole });

      if (roleError) throw roleError;

      localStorage.setItem("currentRole", pendingRole);
      toast.success("Account created successfully!");
      routeAfterAuth(pendingRole);
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddRole = async () => {
    if (!existingUserId) return;
    
    try {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: existingUserId, role: pendingRole });

      if (error) throw error;

      localStorage.setItem("currentRole", pendingRole);
      toast.success(`${pendingRole === "coach" ? "Coach" : "Athlete"} role added!`);
      setShowAddRoleDialog(false);
      routeAfterAuth(pendingRole);
    } catch (error: any) {
      console.error("Add role error:", error);
      toast.error("Failed to add role. Please try again.");
    }
  };

  const routeAfterAuth = (role: "athlete" | "coach") => {
    if (role === "coach") {
      // TODO: check if coach profile setup is done
      navigate("/coach/onboarding");
    } else {
      navigate("/sport-selection");
    }
  };

  // Role Picker Screen
  if (step === "picker") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A]">
        <Card className="w-full max-w-md bg-[#181818] border-[#FF6B00]/20">
          <CardHeader className="space-y-2">
            <CardTitle className="text-4xl font-bold text-center font-poppins text-white">
              Continue as...
            </CardTitle>
            <CardDescription className="text-center text-[#D0D0D0] font-montserrat">
              Choose your role to get started
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Role Chips */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setPendingRole("athlete")}
                className={`flex flex-col items-center gap-3 p-6 rounded-xl font-poppins font-semibold transition-all ${
                  pendingRole === "athlete"
                    ? "bg-[#FF6B00] text-white shadow-[0_0_20px_rgba(255,107,0,0.5)]"
                    : "bg-transparent border-2 border-[#FF6B00] text-[#FF6B00] hover:bg-[#FF6B00]/10"
                }`}
              >
                <User className="h-10 w-10" />
                <span className="text-lg">Athlete</span>
              </button>
              
              <button
                onClick={() => setPendingRole("coach")}
                className={`flex flex-col items-center gap-3 p-6 rounded-xl font-poppins font-semibold transition-all ${
                  pendingRole === "coach"
                    ? "bg-[#FF6B00] text-white shadow-[0_0_20px_rgba(255,107,0,0.5)]"
                    : "bg-transparent border-2 border-[#FF6B00] text-[#FF6B00] hover:bg-[#FF6B00]/10"
                }`}
              >
                <Dumbbell className="h-10 w-10" />
                <span className="text-lg">Coach</span>
              </button>
            </div>

            <Button
              onClick={() => setStep("form")}
              className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-poppins font-semibold text-lg py-6 shadow-[0_0_12px_rgba(255,107,0,0.4)]"
            >
              Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Auth Form Screen
  return (
    <>
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A]">
        <Card className="w-full max-w-md bg-[#181818] border-[#FF6B00]/20">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold text-center font-poppins text-white">
              {isLogin ? "Welcome Back" : "Join Cadence"}
            </CardTitle>
            <CardDescription className="text-center text-[#D0D0D0] font-montserrat">
              {isLogin ? "Login to continue your training journey" : "Start your journey to better performance"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Selected Role Display */}
            <div className="flex items-center justify-center gap-2 p-3 bg-[#FF6B00]/10 rounded-lg border border-[#FF6B00]/30">
              {pendingRole === "athlete" ? (
                <User className="h-5 w-5 text-[#FF6B00]" />
              ) : (
                <Dumbbell className="h-5 w-5 text-[#FF6B00]" />
              )}
              <span className="text-white font-poppins font-medium">
                Continuing as {pendingRole === "athlete" ? "Athlete" : "Coach"}
              </span>
              <button
                onClick={() => setStep("picker")}
                className="ml-auto text-[#FF6B00] hover:text-[#FF6B00]/80 text-sm underline"
              >
                Change
              </button>
            </div>

            <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-[#0D0D0D] border-[#FF6B00]/30 text-white placeholder:text-[#D0D0D0]/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="bg-[#0D0D0D] border-[#FF6B00]/30 text-white"
                />
              </div>

              {!isLogin && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age" className="text-white">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="25"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        required
                        className="bg-[#0D0D0D] border-[#FF6B00]/30 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender" className="text-white">Gender</Label>
                      <Input
                        id="gender"
                        placeholder="Male/Female"
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        required
                        className="bg-[#0D0D0D] border-[#FF6B00]/30 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-white">City</Label>
                    <Input
                      id="city"
                      placeholder="Mumbai"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                      className="bg-[#0D0D0D] border-[#FF6B00]/30 text-white"
                    />
                  </div>
                </>
              )}

              <Button 
                type="submit" 
                className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-poppins font-semibold shadow-[0_0_12px_rgba(255,107,0,0.4)]" 
                disabled={loading}
              >
                {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
              </Button>
            </form>

            <div className="text-center text-sm">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-[#FF6B00] hover:text-[#FF6B00]/80 font-medium underline"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      <AddRoleDialog
        open={showAddRoleDialog}
        onOpenChange={setShowAddRoleDialog}
        pendingRole={pendingRole}
        onConfirm={handleAddRole}
      />
    </>
  );
};

export default Auth;
