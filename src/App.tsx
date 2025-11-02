import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import SportSelection from "./pages/SportSelection";
import SkillMode from "./pages/SkillMode";
import CoachSwipe from "./pages/CoachSwipe";
import Marketplace from "./pages/Marketplace";
import CoachProfile from "./pages/CoachProfile";
import MotionAnalysis from "./pages/MotionAnalysis";
import AIInsights from "./pages/AIInsights";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import VideoUpload from "./pages/VideoUpload";
import CompareView from "./pages/CompareView";
import SessionBooking from "./pages/SessionBooking";
import CoachOnboarding from "./pages/CoachOnboarding";
import CoachHome from "./pages/CoachHome";
import CoachOffers from "./pages/CoachOffers";
import CoachCalendar from "./pages/CoachCalendar";
import CoachSessions from "./pages/CoachSessions";
import CoachMasterclasses from "./pages/CoachMasterclasses";
import CoachLeaderboard from "./pages/CoachLeaderboard";
import CoachAnalytics from "./pages/CoachAnalytics";
import CoachMessages from "./pages/CoachMessages";
import AthleteSkillMap from "./pages/AthleteSkillMap";
import AthletePlaylists from "./pages/AthletePlaylists";
import AthleteChallenges from "./pages/AthleteChallenges";
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
          <Route path="/coach-swipe" element={<CoachSwipe />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/coach/:id" element={<CoachProfile />} />
          <Route path="/video-upload" element={<VideoUpload />} />
          <Route path="/motion-analysis" element={<MotionAnalysis />} />
          <Route path="/compare-view" element={<CompareView />} />
          <Route path="/session-booking" element={<SessionBooking />} />
          <Route path="/ai-insights" element={<AIInsights />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* Coach Routes */}
          <Route path="/coach/onboarding" element={<CoachOnboarding />} />
          <Route path="/coach/home" element={<CoachHome />} />
          <Route path="/coach/offers" element={<CoachOffers />} />
          <Route path="/coach/calendar" element={<CoachCalendar />} />
          <Route path="/coach/sessions" element={<CoachSessions />} />
          <Route path="/coach/masterclasses" element={<CoachMasterclasses />} />
          <Route path="/coach/leaderboard" element={<CoachLeaderboard />} />
          <Route path="/coach/analytics" element={<CoachAnalytics />} />
          <Route path="/coach/messages" element={<CoachMessages />} />
          
          {/* Athlete Routes */}
          <Route path="/athlete/skill-map" element={<AthleteSkillMap />} />
          <Route path="/athlete/playlists" element={<AthletePlaylists />} />
          <Route path="/athlete/challenges" element={<AthleteChallenges />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
