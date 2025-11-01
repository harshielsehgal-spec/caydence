import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Settings, Trophy, Calendar, MapPin } from "lucide-react";
import { SubscriptionModal } from "@/components/SubscriptionModal";
import { RoleSwitch } from "@/components/RoleSwitch";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

const Profile = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [userPlan, setUserPlan] = useState<"free" | "basic" | "pro" | "elite">("free");
  const [user, setUser] = useState<User | null>(null);
  
  const { roles, currentRole, loading, switchRole } = useUserRole(user);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handlePlanUpdate = (plan: "basic" | "pro" | "elite", billing: "monthly" | "yearly") => {
    setUserPlan(plan);
  };

  const handleRoleSwitch = (role: "athlete" | "coach") => {
    switchRole(role);
    if (role === "coach") {
      navigate("/coach/home");
    } else {
      navigate("/dashboard");
    }
  };

  const getPlanBadge = () => {
    if (userPlan === "free") return null;
    const planNames = {
      basic: "Basic Member",
      pro: "Pro Member",
      elite: "Elite Member"
    };
    return (
      <Badge className="bg-primary/10 text-primary border-primary/20" style={{ backgroundColor: 'rgba(255, 107, 0, 0.2)', color: '#FF6B00', borderColor: 'rgba(255, 107, 0, 0.3)' }}>
        {planNames[userPlan]}
      </Badge>
    );
  };

  const getUpgradeCardContent = () => {
    if (userPlan === "free") {
      return {
        title: "Upgrade to Pro",
        description: "Get unlimited AI analyses, priority coach booking, and exclusive training content",
        buttonText: "Upgrade Now"
      };
    }
    return {
      title: "Manage Plan",
      description: "View your current subscription and explore other plan options",
      buttonText: "Change Plan"
    };
  };

  const upgradeCardContent = getUpgradeCardContent();

  const userStats = [
    { label: "Member Since", value: "Jan 2024", icon: Calendar },
    { label: "Location", value: "Mumbai", icon: MapPin },
    { label: "Achievements", value: "3", icon: Trophy },
  ];

  return (
    <div className="min-h-screen px-4 py-8 bg-background">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 font-poppins"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {/* Profile Header */}
        <Card className="mb-6 shadow-card-hover overflow-hidden animate-slide-up">
          <div className="h-24 bg-gradient-to-r from-primary to-primary/60"></div>
          <CardContent className="p-6 -mt-12">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <Avatar className="w-24 h-24 border-4 border-background shadow-card-hover">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                  <div>
                    <h1 className="text-3xl font-bold font-poppins mb-2">John Doe</h1>
                    <p className="text-muted-foreground font-montserrat">john.doe@example.com</p>
                  </div>
                  
                  <Button variant="outline" className="font-poppins">
                    <Settings className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{currentRole === "coach" ? "Coach" : "Athlete"}</Badge>
                  {getPlanBadge()}
                  {userPlan === "free" && (
                    <Badge variant="outline" style={{ color: '#BFBFBF', borderColor: 'rgba(191, 191, 191, 0.3)' }}>
                      Free
                    </Badge>
                  )}
                </div>
                
                {/* Role Switch */}
                {!loading && roles.length > 1 && (
                  <div className="mt-4">
                    <RoleSwitch 
                      roles={roles}
                      currentRole={currentRole}
                      onSwitch={handleRoleSwitch}
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {userStats.map((stat, index) => (
            <Card key={index} className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <stat.icon className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground font-montserrat">
                    {stat.label}
                  </span>
                </div>
                <div className="text-2xl font-bold font-poppins">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Training Preferences */}
        <Card className="mb-6 shadow-card">
          <CardHeader>
            <CardTitle className="font-poppins">Training Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b">
              <span className="font-montserrat">Primary Sport</span>
              <Badge variant="outline">Cricket</Badge>
            </div>
            <div className="flex justify-between items-center py-3 border-b">
              <span className="font-montserrat">Skill Level</span>
              <Badge variant="outline">Intermediate</Badge>
            </div>
            <div className="flex justify-between items-center py-3 border-b">
              <span className="font-montserrat">Training Mode</span>
              <Badge variant="outline">Hybrid</Badge>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="font-montserrat">Budget Range</span>
              <Badge variant="outline">₹500 - ₹1000</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Membership */}
        <Card className="shadow-card-hover bg-gradient-to-br from-primary/5 to-background border-primary/20">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold font-poppins mb-3">
              {upgradeCardContent.title}
            </h3>
            <p className="text-muted-foreground font-montserrat mb-4">
              {upgradeCardContent.description}
            </p>
            <Button 
              onClick={() => setModalOpen(true)}
              className="w-full sm:w-auto font-poppins font-semibold"
            >
              {upgradeCardContent.buttonText}
            </Button>
          </CardContent>
        </Card>

        <SubscriptionModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          currentPlan={userPlan}
          onPlanUpdate={handlePlanUpdate}
        />

        {/* Footer Links */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground font-montserrat">
          <button className="hover:text-primary transition-smooth">About</button>
          <button className="hover:text-primary transition-smooth">Technology</button>
          <button className="hover:text-primary transition-smooth">Privacy</button>
          <button className="hover:text-primary transition-smooth">Support</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
