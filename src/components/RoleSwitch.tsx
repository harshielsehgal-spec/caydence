import { User, Dumbbell } from "lucide-react";
import { AppRole } from "@/hooks/useUserRole";

interface RoleSwitchProps {
  roles: AppRole[];
  currentRole: AppRole | null;
  onSwitch: (role: AppRole) => void;
}

export const RoleSwitch = ({ roles, currentRole, onSwitch }: RoleSwitchProps) => {
  if (roles.length <= 1) return null;

  return (
    <div className="flex gap-2 p-1 bg-charcoal/60 rounded-full border border-vibrantOrange/30">
      {roles.includes("athlete") && (
        <button
          onClick={() => onSwitch("athlete")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-smooth ${
            currentRole === "athlete"
              ? "bg-vibrantOrange text-white shadow-orange-glow"
              : "text-coolGray hover:text-white"
          }`}
        >
          <User className="h-3.5 w-3.5" />
          <span>Athlete</span>
        </button>
      )}
      {roles.includes("coach") && (
        <button
          onClick={() => onSwitch("coach")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-smooth ${
            currentRole === "coach"
              ? "bg-vibrantOrange text-white shadow-orange-glow"
              : "text-coolGray hover:text-white"
          }`}
        >
          <Dumbbell className="h-3.5 w-3.5" />
          <span>Coach</span>
        </button>
      )}
    </div>
  );
};
