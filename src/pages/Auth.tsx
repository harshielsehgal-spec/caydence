import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Dumbbell } from "lucide-react";
import { toast } from "sonner";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") === "login";
  
  const [isLogin, setIsLogin] = useState(initialMode);
  const [userType, setUserType] = useState<"athlete" | "trainer">("athlete");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    age: "",
    gender: "",
    city: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock authentication
    toast.success(isLogin ? "Login successful!" : "Account created successfully!");
    
    // Navigate based on user type
    if (userType === "athlete") {
      navigate("/sport-selection");
    } else {
      navigate("/profile"); // Trainers go to profile setup
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
              variant={userType === "trainer" ? "default" : "outline"}
              className="w-full font-poppins"
              onClick={() => setUserType("trainer")}
            >
              <Dumbbell className="mr-2 h-4 w-4" />
              Trainer
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

            <Button type="submit" className="w-full font-poppins font-semibold">
              {isLogin ? "Login" : "Sign Up"}
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
