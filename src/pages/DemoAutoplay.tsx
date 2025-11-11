import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

const DemoAutoplay = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Parse screens from query params or use defaults
  const screensParam = searchParams.get("screens");
  const defaultScreens = "/coach-swipe,/motion-analysis,/ai-insights,/dashboard";
  const screens = (screensParam || defaultScreens).split(",").map(s => s.trim());
  
  const sport = searchParams.get("sport") || "Cricket";
  const isDemoMode = searchParams.get("mode") === "demo";

  // Store demo mode in sessionStorage for other components to check
  useEffect(() => {
    if (isDemoMode) {
      sessionStorage.setItem("demoMode", "true");
      sessionStorage.setItem("demoSport", sport);
    }
    return () => {
      sessionStorage.removeItem("demoMode");
      sessionStorage.removeItem("demoSport");
    };
  }, [isDemoMode, sport]);

  // Check session and sign in anonymously if needed
  useEffect(() => {
    const ensureSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        await supabase.auth.signInAnonymously();
      }
      setIsReady(true);
    };
    ensureSession();
  }, []);

  // Auto-scroll every 2.5s
  useEffect(() => {
    if (!isReady) return;
    const scrollInterval = setInterval(() => {
      window.scrollBy({ top: 520, behavior: "smooth" });
    }, 2500);
    return () => clearInterval(scrollInterval);
  }, [isReady]);

  // Auto-navigate every 6s
  useEffect(() => {
    if (!isReady) return;
    const navInterval = setInterval(() => {
      setCurrentIndex(prev => {
        const nextIndex = (prev + 1) % screens.length;
        const nextPath = screens[nextIndex];
        const pathWithParams = nextPath.includes("?") 
          ? `${nextPath}&demo=true&sport=${sport}`
          : `${nextPath}?demo=true&sport=${sport}`;
        navigate(pathWithParams, { state: { sport, demo: true } });
        window.scrollTo(0, 0);
        return nextIndex;
      });
    }, 6000);
    return () => clearInterval(navInterval);
  }, [isReady, screens, navigate, sport]);

  // Initial navigation
  useEffect(() => {
    if (isReady && screens.length > 0) {
      const firstPath = screens[0];
      const pathWithParams = firstPath.includes("?")
        ? `${firstPath}&demo=true&sport=${sport}`
        : `${firstPath}?demo=true&sport=${sport}`;
      navigate(pathWithParams, { state: { sport, demo: true } });
    }
  }, [isReady, navigate, sport]);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading demo...</div>
      </div>
    );
  }

  return (
    <>
      {/* Demo badge overlay */}
      <Badge 
        variant="secondary" 
        className="fixed top-4 left-4 z-50 bg-orange-500/90 text-white border-none shadow-lg"
      >
        🎬 Demo
      </Badge>
    </>
  );
};

export default DemoAutoplay;
