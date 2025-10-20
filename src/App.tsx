import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import SportSelection from "./pages/SportSelection";
import SkillMode from "./pages/SkillMode";
import Marketplace from "./pages/Marketplace";
import CoachProfile from "./pages/CoachProfile";
import MotionAnalysis from "./pages/MotionAnalysis";
import AIInsights from "./pages/AIInsights";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import VideoUpload from "./pages/VideoUpload";
import CompareView from "./pages/CompareView";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/sport-selection" element={<SportSelection />} />
          <Route path="/skill-mode" element={<SkillMode />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/coach/:id" element={<CoachProfile />} />
          <Route path="/video-upload" element={<VideoUpload />} />
          <Route path="/motion-analysis" element={<MotionAnalysis />} />
          <Route path="/compare-view" element={<CompareView />} />
          <Route path="/ai-insights" element={<AIInsights />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
