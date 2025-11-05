import { useNavigate, useLocation } from "react-router-dom";
import { Home, Trophy, BarChart3, User } from "lucide-react";

export const AthleteBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", icon: Home, label: "Home" },
    { path: "/community", icon: Trophy, label: "Community" },
    { path: "/ai-insights", icon: BarChart3, label: "Insights" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0D0D0D]/95 backdrop-blur-lg border-t border-[#FF6B00]/30 md:hidden">
      <div className="grid grid-cols-4 gap-1 p-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all ${
                active
                  ? "bg-[#FF6B00]/20 text-[#FF6B00] shadow-[0_0_12px_rgba(255,107,0,0.4)]"
                  : "text-[#D0D0D0] hover:text-white hover:bg-[#FF6B00]/10"
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? "animate-pulse" : ""}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
