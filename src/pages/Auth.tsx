import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Dumbbell } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") === "login";
  
  const [isLogin, setIsLogin] = useState(initialMode);
  const [userType, setUserType] = useState<"athlete" | "coach">("athlete");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    age: "",
    gender: "",
    city: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        // Fetch user's roles to determine navigation
        const { data: rolesData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id);

        const userRoles = rolesData?.map((r) => r.role) || [];
        const hasSelectedRole = userRoles.includes(userType);
        
        // Store the selected role preference
        if (hasSelectedRole) {
          localStorage.setItem("currentRole", userType);
        } else {
          // Fall back to first available role
          const firstRole = userRoles[0] || "athlete";
          localStorage.setItem("currentRole", firstRole);
        }
        
        toast.success("Login successful!");
        
        // Route based on selected role if user has it, otherwise use first available
        if (hasSelectedRole && userType === "coach") {
          navigate("/coach/home");
        } else if (hasSelectedRole && userType === "athlete") {
          navigate("/dashboard");
        } else if (userRoles.includes("coach")) {
          navigate("/coach/home");
        } else {
          navigate("/dashboard");
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          },
        });

        if (error) throw error;
        if (!data.user) throw new Error("Signup failed");

        // Insert the selected role
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert({ user_id: data.user.id, role: userType });

        if (roleError) throw roleError;

        toast.success("Account created successfully!");
        
        if (userType === "athlete") {
          navigate("/sport-selection");
        } else {
          navigate("/coach/onboarding");
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast.error(error.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary/5 to-background">
      <Card className="w-full max-w-md shadow-card-hover">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center font-poppins">
            {isLogin ? "Welcome Back" : "Join Cadence"}
          </CardTitle>
          <CardDescription className="text-center">
            {isLogin ? "Login to continue your training journey" : "Start your journey to better performance"}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* User Type Toggle */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant={userType === "athlete" ? "default" : "outline"}
              className="w-full font-poppins"
              onClick={() => setUserType("athlete")}
            >
              <User className="mr-2 h-4 w-4" />
              Athlete
            </Button>
            <Button
              type="button"
              variant={userType === "coach" ? "default" : "outline"}
              className="w-full font-poppins"
              onClick={() => setUserType("coach")}
            >
              <Dumbbell className="mr-2 h-4 w-4" />
              Coach
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="25"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Input
                      id="gender"
                      placeholder="Male/Female"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="Mumbai"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>
              </>
            )}

            <Button 
              type="submit" 
              className="w-full font-poppins font-semibold" 
              disabled={loading}
            >
              {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
            </Button>
          </form>

          <div className="text-center text-sm">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline font-medium"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
