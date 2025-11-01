import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export type AppRole = "athlete" | "coach";

export const useUserRole = (user: User | null) => {
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [currentRole, setCurrentRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRoles([]);
      setCurrentRole(null);
      setLoading(false);
      return;
    }

    const fetchRoles = async () => {
      try {
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id);

        if (error) throw error;

        const userRoles = (data?.map((r) => r.role) || []) as AppRole[];
        setRoles(userRoles);

        // Get stored role preference or default to first role
        const storedRole = localStorage.getItem("currentRole") as AppRole;
        if (storedRole && userRoles.includes(storedRole)) {
          setCurrentRole(storedRole);
        } else if (userRoles.length > 0) {
          setCurrentRole(userRoles[0]);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [user]);

  const switchRole = (role: AppRole) => {
    if (roles.includes(role)) {
      setCurrentRole(role);
      localStorage.setItem("currentRole", role);
    }
  };

  const hasRole = (role: AppRole) => roles.includes(role);

  return { roles, currentRole, loading, switchRole, hasRole };
};
