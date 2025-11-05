import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Calendar,
  DollarSign,
  BarChart3,
  MessageSquare,
  Video,
  Trophy,
  Globe,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

export const CoachSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { path: "/coach/home", icon: Home, label: "Home" },
    { path: "/coach/calendar", icon: Calendar, label: "Calendar" },
    { path: "/coach/sessions", icon: MessageSquare, label: "Sessions" },
    { path: "/coach/masterclasses", icon: Video, label: "Masterclasses" },
    { path: "/coach/analytics", icon: BarChart3, label: "Analytics" },
    { path: "/coach/revenue", icon: DollarSign, label: "Revenue" },
    { path: "/community", icon: Globe, label: "Community" },
    { path: "/coach/leaderboard", icon: Trophy, label: "Leaderboard" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-[#0D0D0D] to-[#1A1A1A] border-r border-[#FF6B00]/30 transition-all duration-300 z-40 hidden lg:flex flex-col ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-[#FF6B00]/20 flex items-center justify-between">
        {!collapsed && (
          <h2 className="text-xl font-bold text-white font-heading">Coach Panel</h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-[#D0D0D0] hover:text-white hover:bg-[#FF6B00]/10"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="space-y-1 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                  active
                    ? "bg-[#FF6B00]/20 text-[#FF6B00] shadow-[0_0_12px_rgba(255,107,0,0.4)]"
                    : "text-[#D0D0D0] hover:text-white hover:bg-[#FF6B00]/10"
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 ${active ? "animate-pulse" : ""}`} />
                {!collapsed && (
                  <span className="font-medium text-sm">{item.label}</span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-[#FF6B00]/20">
          <p className="text-xs text-[#D0D0D0] text-center">Cadence Coach</p>
        </div>
      )}
    </div>
  );
};
