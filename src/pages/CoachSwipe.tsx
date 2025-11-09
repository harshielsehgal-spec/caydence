import { useState, useEffect } from "react";
import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import SwipeCard from "@/components/SwipeCard";
import CoachChipPanel from "@/components/CoachChipPanel";
import { ArrowLeft, SlidersHorizontal, Heart, X, Eye, Star, MapPin, Video, Users, CheckCircle, Bookmark, MessageSquare, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Mock coach data - Expanded and diversified
const mockCoaches = [
  // ⚽ FOOTBALL
  {
    id: 1,
    name: "Aarav Khanna",
    sport: "Football",
    sportTag: "football",
    rating: 4.8,
    price: 1200,
    city: "Delhi",
    mode: "Online & Offline",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500",
    experience: "8+ years",
    specialization: "Attacking drills and off-ball movement",
    bio: "Ex-Santosh Trophy player. Specializes in attacking drills and off-ball movement.",
    description: "Certified football coach with extensive experience in competitive training.",
    certifications: ["AFC 'B' License", "AI Motion Analysis"],
    achievements: ["30+ academy placements"],
  },
  {
    id: 2,
    name: "Ryan D'Souza",
    sport: "Football",
    sportTag: "football",
    rating: 4.6,
    price: 900,
    city: "Goa",
    mode: "Online",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500",
    experience: "6+ years",
    specialization: "Precision passing and endurance",
    bio: "Focuses on precision passing and endurance. UEFA C License certified.",
    description: "Online coaching specialist with European certification.",
    certifications: ["UEFA C License"],
    achievements: ["40+ online students"],
  },
  {
    id: 3,
    name: "Karan Oberoi",
    sport: "Football",
    sportTag: "football",
    rating: 4.9,
    price: 1400,
    city: "Mumbai",
    mode: "Offline",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500",
    experience: "10+ years",
    specialization: "Goal-scoring tactics and formations",
    bio: "Former ISL assistant coach. Expert in goal-scoring tactics and formations.",
    description: "Elite-level coach with ISL experience.",
    certifications: ["AFC 'A' License"],
    achievements: ["ISL assistant coach"],
  },
  {
    id: 4,
    name: "Zaid Alam",
    sport: "Football",
    sportTag: "football",
    rating: 4.7,
    price: 1100,
    city: "Lucknow",
    mode: "Online & Offline",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500",
    experience: "7+ years",
    specialization: "Defensive strategy and stamina building",
    bio: "Defensive strategy and stamina building for midfielders.",
    description: "Specialist in defensive tactics and endurance training.",
    certifications: ["AFC 'B' License"],
    achievements: ["State championship coach"],
  },
  {
    id: 5,
    name: "Mehul Jain",
    sport: "Football",
    sportTag: "football",
    rating: 4.5,
    price: 800,
    city: "Pune",
    mode: "Online",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500",
    experience: "5+ years",
    specialization: "Agility and speed development",
    bio: "Youth coach known for developing agility and speed among beginners.",
    description: "Youth development specialist focusing on fundamentals.",
    certifications: ["AFC 'C' License"],
    achievements: ["Youth program director"],
  },

  // 🏏 CRICKET
  {
    id: 6,
    name: "Rajat Kapoor",
    sport: "Cricket",
    sportTag: "cricket",
    rating: 4.9,
    price: 1500,
    city: "Jaipur",
    mode: "Offline",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500",
    experience: "12+ years",
    specialization: "Spin and line control",
    bio: "Ex-Ranji bowler. Master of spin and line control.",
    description: "Former Ranji Trophy player specializing in spin bowling.",
    certifications: ["ICC Level 3", "BCCI Certified"],
    achievements: ["Ranji Trophy player"],
  },
  {
    id: 7,
    name: "Nisha Rao",
    sport: "Cricket",
    sportTag: "cricket",
    rating: 4.6,
    price: 950,
    city: "Chennai",
    mode: "Online & Offline",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500",
    experience: "8+ years",
    specialization: "Swing bowling and consistency drills",
    bio: "Women's T20 league player. Specialist in swing bowling and consistency drills.",
    description: "Professional women's cricket coach with T20 experience.",
    certifications: ["ICC Level 2"],
    achievements: ["T20 league player"],
  },
  {
    id: 8,
    name: "Tanuj Malhotra",
    sport: "Cricket",
    sportTag: "cricket",
    rating: 4.8,
    price: 1200,
    city: "Delhi",
    mode: "Offline",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500",
    experience: "10+ years",
    specialization: "Power hitting and shot placement",
    bio: "Helps young batters refine power hitting and shot placement.",
    description: "Batting coach specializing in modern T20 techniques.",
    certifications: ["ICC Level 2", "AI Analytics"],
    achievements: ["3 national selections"],
  },
  {
    id: 9,
    name: "Akshay Pillai",
    sport: "Cricket",
    sportTag: "cricket",
    rating: 4.7,
    price: 1000,
    city: "Bangalore",
    mode: "Online & Offline",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500",
    experience: "10+ years",
    specialization: "Fielding and wicket-keeping",
    bio: "Fielding and wicket-keeping mentor with 10+ years of experience.",
    description: "Specialist in fielding techniques and wicket-keeping.",
    certifications: ["ICC Level 2"],
    achievements: ["50+ keepers trained"],
  },
  {
    id: 10,
    name: "Sourabh Das",
    sport: "Cricket",
    sportTag: "cricket",
    rating: 4.5,
    price: 850,
    city: "Kolkata",
    mode: "Online",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500",
    experience: "6+ years",
    specialization: "Fast bowlers' conditioning",
    bio: "Strength coach focusing on fast bowlers' conditioning.",
    description: "Fitness specialist for pace bowlers.",
    certifications: ["Strength & Conditioning"],
    achievements: ["State team trainer"],
  },

  // 🏀 BASKETBALL
  {
    id: 11,
    name: "Tania Das",
    sport: "Basketball",
    sportTag: "basketball",
    rating: 4.9,
    price: 1100,
    city: "Kolkata",
    mode: "Online & Offline",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500",
    experience: "9+ years",
    specialization: "Shooting accuracy",
    bio: "Former national women's team player. Specializes in shooting accuracy.",
    description: "National team experience with focus on shooting mechanics.",
    certifications: ["NBA Level 2"],
    achievements: ["National team player"],
  },
  {
    id: 12,
    name: "Arjun Sen",
    sport: "Basketball",
    sportTag: "basketball",
    rating: 4.7,
    price: 950,
    city: "Delhi",
    mode: "Offline",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500",
    experience: "7+ years",
    specialization: "Dribbling and zone defense",
    bio: "Focuses on dribbling, lay-ups, and zone defense training.",
    description: "Defensive specialist with youth coaching experience.",
    certifications: ["Basketball Coaching Level 2"],
    achievements: ["State championship coach"],
  },
  {
    id: 13,
    name: "Rehan George",
    sport: "Basketball",
    sportTag: "basketball",
    rating: 4.8,
    price: 1300,
    city: "Mumbai",
    mode: "Online & Offline",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500",
    experience: "11+ years",
    specialization: "Fitness-oriented skill development",
    bio: "Ex-NBA academy India trainee. Fitness-oriented skill development.",
    description: "Elite training with NBA academy background.",
    certifications: ["NBA Academy Certified"],
    achievements: ["NBA academy trainee"],
  },
  {
    id: 14,
    name: "Kabir Mehta",
    sport: "Basketball",
    sportTag: "basketball",
    rating: 4.9,
    price: 1250,
    city: "Noida",
    mode: "Offline",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500",
    experience: "10+ years",
    specialization: "Footwork and vertical jump training",
    bio: "Known for personalized footwork drills and vertical jump training.",
    description: "Athletic performance specialist for basketball.",
    certifications: ["Strength & Conditioning", "Basketball Level 2"],
    achievements: ["60+ athletes trained"],
  },
  {
    id: 15,
    name: "Shivani Nair",
    sport: "Basketball",
    sportTag: "basketball",
    rating: 4.5,
    price: 900,
    city: "Hyderabad",
    mode: "Online",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500",
    experience: "5+ years",
    specialization: "Team coordination",
    bio: "Specializes in team coordination and female athlete development.",
    description: "Women's basketball development specialist.",
    certifications: ["Women's Coaching Certified"],
    achievements: ["Youth program director"],
  },

  // 🎾 TENNIS
  {
    id: 16,
    name: "Neeraj Saini",
    sport: "Tennis",
    sportTag: "tennis",
    rating: 4.8,
    price: 1300,
    city: "Chandigarh",
    mode: "Online & Offline",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500",
    experience: "9+ years",
    specialization: "Serve technique and baseline control",
    bio: "Former ITF player. Focuses on serve technique and baseline control.",
    description: "ITF level coaching with serve specialization.",
    certifications: ["ITF Level 2"],
    achievements: ["ITF player"],
  },
  {
    id: 17,
    name: "Ananya Menon",
    sport: "Tennis",
    sportTag: "tennis",
    rating: 4.6,
    price: 950,
    city: "Bangalore",
    mode: "Online",
    image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=500",
    experience: "6+ years",
    specialization: "Footwork drills and forehand accuracy",
    bio: "Specializes in footwork drills and forehand accuracy for intermediates.",
    description: "Technical coach for intermediate players.",
    certifications: ["ITF Level 1"],
    achievements: ["40+ online students"],
  },
  {
    id: 18,
    name: "Dev Chauhan",
    sport: "Tennis",
    sportTag: "tennis",
    rating: 4.9,
    price: 1500,
    city: "Delhi",
    mode: "Offline",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500",
    experience: "12+ years",
    specialization: "Mental endurance",
    bio: "Worked with ATP-level coaches. Emphasizes mental endurance.",
    description: "Elite mental coaching with ATP experience.",
    certifications: ["ITF Level 3", "Sports Psychology"],
    achievements: ["ATP coaching experience"],
  },
  {
    id: 19,
    name: "Ritika Patel",
    sport: "Tennis",
    sportTag: "tennis",
    rating: 4.7,
    price: 1000,
    city: "Pune",
    mode: "Online & Offline",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500",
    experience: "7+ years",
    specialization: "Serve-return strategy",
    bio: "Expert in beginner-friendly training plans and serve-return strategy.",
    description: "Beginner specialist with strategic focus.",
    certifications: ["ITF Level 1"],
    achievements: ["50+ beginners trained"],
  },
  {
    id: 20,
    name: "Samar Iqbal",
    sport: "Tennis",
    sportTag: "tennis",
    rating: 4.5,
    price: 800,
    city: "Jaipur",
    mode: "Online",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500",
    experience: "5+ years",
    specialization: "Timing and backhand strength",
    bio: "Helps new players develop timing, backhand strength, and grip control.",
    description: "Foundation coach for tennis beginners.",
    certifications: ["ITF Level 1"],
    achievements: ["Youth academy coach"],
  },

  // 🏸 BADMINTON
  {
    id: 21,
    name: "Kavya Rao",
    sport: "Badminton",
    sportTag: "badminton",
    rating: 4.8,
    price: 1100,
    city: "Bangalore",
    mode: "Online & Offline",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500",
    experience: "8+ years",
    specialization: "Footwork agility and reflex training",
    bio: "Focuses on footwork agility, reflex training, and doubles coordination.",
    description: "Agility and reflex specialist for competitive players.",
    certifications: ["BWF Level 1"],
    achievements: ["State doubles coach"],
  },
  {
    id: 22,
    name: "Ankit Bansal",
    sport: "Badminton",
    sportTag: "badminton",
    rating: 4.7,
    price: 1000,
    city: "Delhi",
    mode: "Offline",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500",
    experience: "7+ years",
    specialization: "Net reflex expert",
    bio: "Professional coach with BWF Level-1 certification. Net reflex expert.",
    description: "Net play specialist with international certification.",
    certifications: ["BWF Level 1"],
    achievements: ["60+ competitive players"],
  },
  {
    id: 23,
    name: "Sneha Chatterjee",
    sport: "Badminton",
    sportTag: "badminton",
    rating: 4.9,
    price: 1200,
    city: "Kolkata",
    mode: "Offline",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500",
    experience: "10+ years",
    specialization: "Strength and accuracy",
    bio: "Former state champion. Strength and accuracy coach.",
    description: "Elite coach with state championship experience.",
    certifications: ["BWF Level 2"],
    achievements: ["State champion"],
  },
  {
    id: 24,
    name: "Rohan Gupta",
    sport: "Badminton",
    sportTag: "badminton",
    rating: 4.6,
    price: 950,
    city: "Mumbai",
    mode: "Online & Offline",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500",
    experience: "6+ years",
    specialization: "Junior training programs",
    bio: "Training programs designed for juniors aiming at state selections.",
    description: "Youth development specialist for competitive badminton.",
    certifications: ["BWF Level 1"],
    achievements: ["40+ state selections"],
  },
  {
    id: 25,
    name: "Piyush Rawat",
    sport: "Badminton",
    sportTag: "badminton",
    rating: 4.5,
    price: 850,
    city: "Dehradun",
    mode: "Online",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500",
    experience: "5+ years",
    specialization: "Shuttle control and wrist precision",
    bio: "Works on shuttle control, speed recovery, and wrist precision.",
    description: "Technical specialist for badminton fundamentals.",
    certifications: ["BWF Level 1"],
    achievements: ["Online academy founder"],
  },
];

type CoachSimple = {
  id: number;
  name: string;
  city: string;
  rating: number;
  image: string;
  sport: string;
  price: number;
  mode: string;
};

type SwipeState = {
  liked: CoachSimple[];
  passed: CoachSimple[];
  shortlisted: CoachSimple[];
};

// Default filter state
const DEFAULT_FILTERS = {
  sport: null,
  skillLevel: null,
  mode: null,
  priceMin: 0,
  priceMax: 99999,
  city: null,
  verifiedOnly: false,
};

// Pure helper functions for deduplication
const removeFromAll = (state: SwipeState, id: number): SwipeState => {
  return {
    liked: state.liked.filter(c => c.id !== id),
    passed: state.passed.filter(c => c.id !== id),
    shortlisted: state.shortlisted.filter(c => c.id !== id),
  };
};

const addToList = (state: SwipeState, listName: 'liked' | 'passed' | 'shortlisted', coach: CoachSimple): SwipeState => {
  const stripped = removeFromAll(state, coach.id);
  return { ...stripped, [listName]: [coach, ...stripped[listName]] };
};

const CoachSwipe = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedSport = location.state?.sport || "All Sports";
  const [userId, setUserId] = useState<string | null>(null);

  // Get current user ID and scope storage to user
  useEffect(() => {
    const getUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUserId();
  }, []);

  const getStorageKey = (key: string) => userId ? `${key}_${userId}` : key;

  // Filter and Sort State with sessionStorage persistence
  const [sortBy, setSortBy] = useState<string>(() => {
    const saved = sessionStorage.getItem('cadenceFilters');
    return saved ? JSON.parse(saved).sortBy || "recommended" : "recommended";
  });
  const [filterMode, setFilterMode] = useState<string>(() => {
    const saved = sessionStorage.getItem('cadenceFilters');
    return saved ? JSON.parse(saved).mode || "all" : "all";
  });
  const [filterCity, setFilterCity] = useState<string>(() => {
    const saved = sessionStorage.getItem('cadenceFilters');
    return saved ? JSON.parse(saved).city || "all" : "all";
  });
  const [filterMaxFee, setFilterMaxFee] = useState<boolean>(() => {
    const saved = sessionStorage.getItem('cadenceFilters');
    return saved ? JSON.parse(saved).maxFee || false : false;
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Swipe state with localStorage persistence (user-scoped)
  const [swipeState, setSwipeState] = useState<SwipeState>({ liked: [], passed: [], shortlisted: [] });
  
  const [draggedCoach, setDraggedCoach] = useState<CoachSimple | null>(null);
  const [dragSource, setDragSource] = useState<'liked' | 'passed' | 'shortlisted' | null>(null);
  const [showShortlistDrawer, setShowShortlistDrawer] = useState(false);
  const [activeTab, setActiveTab] = useState<'liked' | 'passed'>('liked');

  // Apply filters and sorting with proper type coercion and case-insensitive matching
  const getFilteredAndSortedCoaches = () => {
    let filtered = mockCoaches.filter(
      coach => selectedSport === "All Sports" || coach.sport === selectedSport
    );

    // Apply mode filter - case insensitive
    if (filterMode !== "all") {
      filtered = filtered.filter(coach => 
        coach.mode.toLowerCase().trim().includes(filterMode.toLowerCase().trim())
      );
    }

    // Apply city filter - case insensitive
    if (filterCity !== "all") {
      filtered = filtered.filter(coach => 
        coach.city.toLowerCase().trim() === filterCity.toLowerCase().trim()
      );
    }

    // Apply max fee filter - ensure numeric comparison
    if (filterMaxFee) {
      filtered = filtered.filter(coach => Number(coach.price) <= 800);
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price-high":
        filtered.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "rating":
        filtered.sort((a, b) => Number(b.rating) - Number(a.rating));
        break;
      case "experience":
        filtered.sort((a, b) => 
          parseInt(b.experience) - parseInt(a.experience)
        );
        break;
      default:
        // Recommended - keep original order
        break;
    }

    return filtered;
  };

  // Fallback to recommended coaches if no results
  const getRecommendedCoaches = () => {
    return mockCoaches
      .filter(coach => coach.rating >= 4.7)
      .sort((a, b) => Number(b.rating) - Number(a.rating))
      .slice(0, 5);
  };

  const [coaches, setCoaches] = useState(getFilteredAndSortedCoaches());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedCoachForAction, setSelectedCoachForAction] = useState<typeof currentCoach | null>(null);
  const [previewCoach, setPreviewCoach] = useState<CoachSimple | null>(null);
  const [showRecommendedFallback, setShowRecommendedFallback] = useState(false);

  // Load user-scoped swipe state
  useEffect(() => {
    if (userId) {
      const saved = localStorage.getItem(getStorageKey('cadenceSwipeState'));
      if (saved) {
        setSwipeState(JSON.parse(saved));
      }
    }
  }, [userId]);

  // Clear filters on mount if coming from dashboard
  useEffect(() => {
    const fromDashboard = sessionStorage.getItem('fromDashboard');
    if (fromDashboard === 'true') {
      sessionStorage.removeItem('cadenceFilters');
      sessionStorage.removeItem('fromDashboard');
    }
  }, []);

  // Persist swipe state to localStorage (user-scoped)
  useEffect(() => {
    if (userId) {
      localStorage.setItem(getStorageKey('cadenceSwipeState'), JSON.stringify(swipeState));
    }
  }, [swipeState, userId]);

  // Persist filters to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('cadenceFilters', JSON.stringify({
      sortBy,
      mode: filterMode,
      city: filterCity,
      maxFee: filterMaxFee,
    }));
  }, [sortBy, filterMode, filterCity, filterMaxFee]);

  // Re-filter when filters change with loading state
  React.useEffect(() => {
    setIsLoading(true);
    const filtered = getFilteredAndSortedCoaches();
    
    // If no results, show recommended coaches
    if (filtered.length === 0) {
      const recommended = getRecommendedCoaches();
      setCoaches(recommended);
      setShowRecommendedFallback(true);
    } else {
      setCoaches(filtered);
      setShowRecommendedFallback(false);
    }
    
    setCurrentIndex(0);
    setTimeout(() => setIsLoading(false), 300);
  }, [sortBy, filterMode, filterCity, filterMaxFee, selectedSport]);

  const currentCoach = coaches[currentIndex];

  // Get unique cities from current sport
  const availableCities = Array.from(
    new Set(
      mockCoaches
        .filter(coach => selectedSport === "All Sports" || coach.sport === selectedSport)
        .map(coach => coach.city)
    )
  ).sort();

  const handleResetFilters = () => {
    sessionStorage.removeItem('cadenceFilters');
    setSortBy("recommended");
    setFilterMode("all");
    setFilterCity("all");
    setFilterMaxFee(false);
    toast.success("Filters reset!");
  };

  const handleSwipeLeft = () => {
    if (currentCoach) {
      const simple: CoachSimple = {
        id: currentCoach.id,
        name: currentCoach.name,
        city: currentCoach.city,
        rating: currentCoach.rating,
        image: currentCoach.image,
        sport: currentCoach.sport,
        price: currentCoach.price,
        mode: currentCoach.mode,
      };
      setSwipeState(prev => addToList(prev, 'passed', simple));
    }
    if (currentIndex < coaches.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      toast.info("No more coaches to show!");
    }
  };

  const handleSwipeRight = () => {
    if (currentCoach) {
      const simple: CoachSimple = {
        id: currentCoach.id,
        name: currentCoach.name,
        city: currentCoach.city,
        rating: currentCoach.rating,
        image: currentCoach.image,
        sport: currentCoach.sport,
        price: currentCoach.price,
        mode: currentCoach.mode,
      };
      setSwipeState(prev => addToList(prev, 'liked', simple));
      setSelectedCoachForAction(currentCoach);
      setShowActionModal(true);
    }
  };

  const handleSwipeUp = () => {
    setShowProfileModal(true);
  };

  const handleBookSession = () => {
    navigate("/session-booking", { state: { coach: selectedCoachForAction || currentCoach } });
  };

  const handleViewDashboard = () => {
    navigate("/dashboard");
  };

  const handleContinueBrowsing = () => {
    setShowActionModal(false);
    if (currentIndex < coaches.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      toast.info("No more coaches to show!");
    }
  };

  const getModeIcon = () => {
    if (currentCoach?.mode.toLowerCase().includes("online")) return <Video className="h-4 w-4" />;
    if (currentCoach?.mode.toLowerCase().includes("offline")) return <Users className="h-4 w-4" />;
    return <Video className="h-4 w-4" />;
  };

  if (!currentCoach && !showRecommendedFallback) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center px-4"
        style={{
          background: 'linear-gradient(135deg, #0D0D0D 0%, #1A1A1A 50%, #0D0D0D 100%)',
        }}
      >
        <div className="text-center space-y-6 animate-slide-up max-w-md mx-auto bg-charcoal/60 backdrop-blur-sm p-8 rounded-2xl border-2 border-vibrantOrange/30 shadow-orange-glow">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold font-heading" style={{ color: '#F2F2F2' }}>
            No coaches found
          </h2>
          <p className="font-body" style={{ color: '#BFBFBF' }}>
            Try clearing filters or check back later for new coaches.
          </p>
          <div className="flex flex-col gap-3 justify-center">
            <Button 
              onClick={handleResetFilters} 
              className="bg-vibrantOrange hover:bg-vibrantOrange/90 shadow-orange-glow hover:shadow-orange-glow-strong transition-smooth"
            >
              Reset Filters
            </Button>
            <Button 
              onClick={() => navigate("/skill-mode")} 
              variant="outline"
              className="border-2 border-vibrantOrange text-white hover:bg-vibrantOrange hover:text-white"
            >
              Back to Search
            </Button>
            {swipeState.shortlisted.length > 0 && (
              <Button onClick={() => setShowShortlistDrawer(true)} variant="ghost">
                View Shortlist ({swipeState.shortlisted.length})
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen relative"
      style={{
        background: 'linear-gradient(135deg, #0D0D0D 0%, #1A1A1A 50%, #0D0D0D 100%)',
      }}
    >
      {/* Subtle texture overlay */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,107,0,0.1) 10px, rgba(255,107,0,0.1) 20px)',
        }}
      />
      
      {/* Top Bar */}
      <div className="sticky top-0 z-20 bg-charcoal/95 backdrop-blur-md border-b-2 border-vibrantOrange/20 shadow-orange-glow/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/skill-mode")}
            className="text-vibrantOrange hover:bg-vibrantOrange/10 hover:shadow-orange-glow transition-smooth"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="text-center">
            <h1 className="text-xl font-bold font-heading" style={{ color: '#F2F2F2' }}>{selectedSport}</h1>
            <p className="text-xs font-body" style={{ color: '#BFBFBF' }}>
              {currentIndex + 1} / {coaches.length}
            </p>
          </div>

          <div className="flex gap-2">
            <Sheet open={showShortlistDrawer} onOpenChange={setShowShortlistDrawer}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-vibrantOrange hover:bg-vibrantOrange/10 hover:shadow-orange-glow transition-smooth relative"
                >
                  <Bookmark className="h-5 w-5" />
                  {swipeState.shortlisted.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-vibrantOrange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                      {swipeState.shortlisted.length}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
            </Sheet>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className="text-vibrantOrange hover:bg-vibrantOrange/10 hover:shadow-orange-glow transition-smooth"
            >
              <SlidersHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="border-t-2 border-vibrantOrange/20 bg-charcoal/95 animate-accordion-down">
            <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
              {/* Section Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-vibrantOrange/50 to-transparent"></div>
              
              {/* Sort Dropdown */}
              <div className="space-y-2">
                <label className="text-xs font-semibold font-body tracking-wider" style={{ color: '#F2F2F2' }}>
                  SORT BY
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-charcoal/80 border-2 border-vibrantOrange/30 rounded-lg px-4 py-3 text-sm font-body transition-smooth focus:outline-none focus:border-vibrantOrange focus:shadow-orange-glow hover:border-vibrantOrange/50"
                  style={{ color: '#F2F2F2' }}
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low → High</option>
                  <option value="price-high">Price: High → Low</option>
                  <option value="rating">Rating: High → Low</option>
                  <option value="experience">Experience: High → Low</option>
                </select>
              </div>

              {/* Quick Filters */}
              <div className="space-y-4">
                <label className="text-xs font-semibold font-body tracking-wider" style={{ color: '#F2F2F2' }}>
                  FILTERS
                </label>
                
                {/* Mode Filter */}
                <div className="space-y-2">
                  <p className="text-xs font-body" style={{ color: '#BFBFBF' }}>Mode</p>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setFilterMode("all")}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-smooth ${
                        filterMode === "all" 
                          ? "bg-vibrantOrange text-white border-2 border-vibrantOrange shadow-orange-glow animate-bounce-subtle" 
                          : "bg-charcoal/60 text-coolGray border-2 border-white/10 hover:border-vibrantOrange/50"
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilterMode("online")}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-smooth ${
                        filterMode === "online" 
                          ? "bg-vibrantOrange text-white border-2 border-vibrantOrange shadow-orange-glow animate-bounce-subtle" 
                          : "bg-charcoal/60 text-coolGray border-2 border-white/10 hover:border-vibrantOrange/50"
                      }`}
                    >
                      Online
                    </button>
                    <button
                      onClick={() => setFilterMode("offline")}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-smooth ${
                        filterMode === "offline" 
                          ? "bg-vibrantOrange text-white border-2 border-vibrantOrange shadow-orange-glow animate-bounce-subtle" 
                          : "bg-charcoal/60 text-coolGray border-2 border-white/10 hover:border-vibrantOrange/50"
                      }`}
                    >
                      Offline
                    </button>
                  </div>
                </div>

                {/* Section Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                {/* City Filter */}
                <div className="space-y-2">
                  <p className="text-xs font-body" style={{ color: '#BFBFBF' }}>City</p>
                  <select
                    value={filterCity}
                    onChange={(e) => setFilterCity(e.target.value)}
                    className="w-full bg-charcoal/80 border-2 border-vibrantOrange/30 rounded-lg px-4 py-3 text-sm font-body transition-smooth focus:outline-none focus:border-vibrantOrange focus:shadow-orange-glow hover:border-vibrantOrange/50"
                    style={{ color: '#F2F2F2' }}
                  >
                    <option value="all">All Cities</option>
                    {availableCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* Fee Filter */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-charcoal/40 border border-white/10">
                  <label className="text-sm font-body font-semibold" style={{ color: '#F2F2F2' }}>
                    Fee ≤ ₹800
                  </label>
                  <button
                    onClick={() => setFilterMaxFee(!filterMaxFee)}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-smooth ${
                      filterMaxFee ? "bg-vibrantOrange shadow-orange-glow" : "bg-white/20"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-md ${
                        filterMaxFee ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Section Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-vibrantOrange/50 to-transparent"></div>

              {/* Reset Button */}
              <Button
                onClick={handleResetFilters}
                variant="outline"
                className="w-full text-sm border-2 border-vibrantOrange/50 text-white hover:bg-vibrantOrange hover:text-white hover:border-vibrantOrange transition-smooth"
              >
                Reset Filters
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Loading Shimmer */}
      {isLoading && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-charcoal/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 border-4 border-vibrantOrange/30 border-t-vibrantOrange rounded-full animate-spin" />
            <p className="text-sm text-white font-body">Loading coaches...</p>
          </div>
        </div>
      )}

      {/* Recommended Fallback Notice */}
      {showRecommendedFallback && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 bg-vibrantOrange/20 border border-vibrantOrange/50 rounded-lg px-4 py-2 backdrop-blur-sm">
          <p className="text-sm text-white font-body">
            Showing recommended coaches near you
          </p>
        </div>
      )}

      {/* Main Content - 3 Column Layout on Desktop */}
      <div className="hidden md:grid md:grid-cols-[280px_1fr_280px] md:gap-4 md:px-4 md:pt-4 md:pb-32 min-h-[calc(100vh-80px)]">
        {/* Left Sidebar - Passed */}
        <div className="flex flex-col h-full">
          <div className="sticky top-20 flex flex-col h-[calc(100vh-120px)]">
            <div className="flex items-center justify-between mb-3 px-3">
              <h3 className="text-lg font-bold text-white font-heading">Passed</h3>
              <Badge className="bg-destructive/20 text-destructive border-destructive/40">
                {swipeState.passed.length}
              </Badge>
            </div>
            
            {/* Always-visible drop zone */}
            <div 
              className={`border-2 border-dashed rounded-lg p-4 mb-3 transition-all ${
                draggedCoach && dragSource !== 'passed' 
                  ? 'border-vibrantOrange bg-vibrantOrange/10 shadow-orange-glow' 
                  : 'border-destructive/40 bg-destructive/5'
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (draggedCoach && dragSource !== 'passed') {
                  setSwipeState(prev => addToList(prev, 'passed', draggedCoach));
                  toast.info("Moved to passed");
                }
              }}
            >
              <p className="text-sm text-center text-coolGray">
                {draggedCoach && dragSource !== 'passed' ? '🎯 Drop here to move to Passed' : 'Drop coaches here'}
              </p>
            </div>

            {/* Scrollable coach list */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
              {swipeState.passed.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-coolGray">No coaches passed yet</p>
                </div>
              ) : (
                swipeState.passed.map((coach) => (
                  <HoverCard key={coach.id}>
                    <HoverCardTrigger asChild>
                      <Card 
                        className="bg-charcoal/80 border-2 border-white/10 hover:border-vibrantOrange/50 transition-smooth cursor-move"
                        draggable
                        onDragStart={() => {
                          setDraggedCoach(coach);
                          setDragSource('passed');
                        }}
                        onDragEnd={() => {
                          setDraggedCoach(null);
                          setDragSource(null);
                        }}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2">
                            <img
                              src={coach.image}
                              alt={coach.name}
                              className="w-12 h-12 rounded-full object-cover border-2 border-vibrantOrange/30"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-white truncate">{coach.name}</p>
                              <div className="flex items-center gap-1 text-xs text-coolGray">
                                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                <span>{coach.rating}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </HoverCardTrigger>
                    <HoverCardContent side="right" className="w-80 bg-charcoal border-2 border-vibrantOrange/30">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <img
                            src={coach.image}
                            alt={coach.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-vibrantOrange/50"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-white">{coach.name}</h4>
                            <p className="text-sm text-coolGray flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {coach.city}
                            </p>
                            <p className="text-vibrantOrange font-semibold mt-1">₹{coach.price}/session</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const fullCoach = mockCoaches.find(c => c.id === coach.id);
                              if (fullCoach) {
                                setSelectedCoachForAction(fullCoach);
                                setShowProfileModal(true);
                              }
                            }}
                            className="flex-1 border-vibrantOrange/50 text-white hover:bg-vibrantOrange/10"
                          >
                            View Profile
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSwipeState(prev => addToList(prev, 'liked', coach));
                              toast.success("Moved to liked");
                            }}
                            className="border-vibrantOrange text-vibrantOrange hover:bg-vibrantOrange hover:text-white"
                          >
                            Move to Liked
                          </Button>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Center - Swipe Card */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-full max-w-lg h-[calc(100vh-250px)]">
            {coaches.slice(currentIndex, currentIndex + 2).map((coach, index) => (
              <SwipeCard
                key={coach.id}
                coach={coach}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
                onSwipeUp={handleSwipeUp}
                style={{
                  zIndex: coaches.length - currentIndex - index,
                  scale: index === 0 ? 1 : 0.95,
                  opacity: index === 0 ? 1 : 0.5,
                }}
              />
            ))}
          </div>
        </div>

        {/* Right Sidebar - Liked */}
        <div className="flex flex-col h-full">
          <div className="sticky top-20 flex flex-col h-[calc(100vh-120px)]">
            <div className="flex items-center justify-between mb-3 px-3">
              <h3 className="text-lg font-bold text-white font-heading">Liked</h3>
              <Badge className="bg-vibrantOrange/20 text-vibrantOrange border-vibrantOrange/40">
                {swipeState.liked.length}
              </Badge>
            </div>
            
            {/* Always-visible drop zone */}
            <div 
              className={`border-2 border-dashed rounded-lg p-4 mb-3 transition-all ${
                draggedCoach && dragSource !== 'liked' 
                  ? 'border-vibrantOrange bg-vibrantOrange/10 shadow-orange-glow' 
                  : 'border-vibrantOrange/40 bg-vibrantOrange/5'
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (draggedCoach && dragSource !== 'liked') {
                  setSwipeState(prev => addToList(prev, 'liked', draggedCoach));
                  toast.success("Moved to liked");
                }
              }}
            >
              <p className="text-sm text-center text-coolGray">
                {draggedCoach && dragSource !== 'liked' ? '🎯 Drop here to move to Liked' : 'Drop coaches here'}
              </p>
            </div>

            {/* Scrollable coach list */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
              {swipeState.liked.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-coolGray">No coaches liked yet</p>
                </div>
              ) : (
                swipeState.liked.map((coach) => (
                  <HoverCard key={coach.id}>
                    <HoverCardTrigger asChild>
                      <Card 
                        className="bg-charcoal/80 border-2 border-white/10 hover:border-vibrantOrange/50 transition-smooth cursor-move"
                        draggable
                        onDragStart={() => {
                          setDraggedCoach(coach);
                          setDragSource('liked');
                        }}
                        onDragEnd={() => {
                          setDraggedCoach(null);
                          setDragSource(null);
                        }}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2">
                            <img
                              src={coach.image}
                              alt={coach.name}
                              className="w-12 h-12 rounded-full object-cover border-2 border-vibrantOrange/30"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-white truncate">{coach.name}</p>
                              <div className="flex items-center gap-1 text-xs text-coolGray">
                                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                <span>{coach.rating}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </HoverCardTrigger>
                    <HoverCardContent side="left" className="w-80 bg-charcoal border-2 border-vibrantOrange/30">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <img
                            src={coach.image}
                            alt={coach.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-vibrantOrange/50"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-white">{coach.name}</h4>
                            <p className="text-sm text-coolGray flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {coach.city}
                            </p>
                            <p className="text-vibrantOrange font-semibold mt-1">₹{coach.price}/session</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const fullCoach = mockCoaches.find(c => c.id === coach.id);
                              if (fullCoach) {
                                setSelectedCoachForAction(fullCoach);
                                setShowProfileModal(true);
                              }
                            }}
                            className="flex-1 border-vibrantOrange/50 text-white hover:bg-vibrantOrange/10"
                          >
                            View Profile
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              setSwipeState(prev => addToList(prev, 'shortlisted', coach));
                              toast.success("Added to shortlist!");
                            }}
                            className="bg-vibrantOrange hover:bg-vibrantOrange/90 text-white"
                          >
                            <Bookmark className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View - Show swipe card + tabs */}
      <div className="md:hidden">
        <div className="relative h-[calc(100vh-180px)] max-w-2xl mx-auto px-4 pt-4">
          {coaches.slice(currentIndex, currentIndex + 2).map((coach, index) => (
            <SwipeCard
              key={coach.id}
              coach={coach}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
              onSwipeUp={handleSwipeUp}
              style={{
                zIndex: coaches.length - currentIndex - index,
                scale: index === 0 ? 1 : 0.95,
                opacity: index === 0 ? 1 : 0.5,
              }}
            />
          ))}
        </div>

        {/* Mobile Tabs */}
        <div className="fixed bottom-[120px] left-0 right-0 z-10 px-4">
          <div className="flex gap-2 bg-charcoal/95 backdrop-blur-md rounded-full p-1 border-2 border-vibrantOrange/20">
            <button
              onClick={() => setActiveTab('liked')}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-smooth ${
                activeTab === 'liked'
                  ? 'bg-vibrantOrange text-white shadow-orange-glow'
                  : 'text-coolGray hover:text-white'
              }`}
            >
              Liked {swipeState.liked.length > 0 && `(${swipeState.liked.length})`}
            </button>
            <button
              onClick={() => setActiveTab('passed')}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-smooth ${
                activeTab === 'passed'
                  ? 'bg-vibrantOrange text-white shadow-orange-glow'
                  : 'text-coolGray hover:text-white'
              }`}
            >
              Passed {swipeState.passed.length > 0 && `(${swipeState.passed.length})`}
            </button>
          </div>
          {/* Mobile Chip List */}
          {activeTab && (
            <div className="mt-2 bg-charcoal/95 backdrop-blur-md rounded-2xl p-3 border-2 border-vibrantOrange/20 max-h-32 overflow-x-auto">
              <div className="flex gap-2 pb-1">
                {(activeTab === 'liked' ? swipeState.liked : swipeState.passed).length === 0 ? (
                  <p className="text-sm text-coolGray py-2 px-3">No coaches yet</p>
                ) : (
                  (activeTab === 'liked' ? swipeState.liked : swipeState.passed).map((coach) => (
                    <div
                      key={coach.id}
                      className="flex-shrink-0 bg-charcoal/80 border-2 border-white/10 rounded-xl p-2 min-w-[100px]"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <img
                          src={coach.image}
                          alt={coach.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-vibrantOrange/30"
                        />
                        <p className="text-xs font-semibold text-white truncate w-full text-center">{coach.name}</p>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs text-white">{coach.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-charcoal via-charcoal/95 to-transparent pb-8 pt-8 z-10">
        <div className="flex items-center justify-center gap-8">
          <button
            onClick={handleSwipeLeft}
            className="h-16 w-16 rounded-full bg-charcoal border-3 border-destructive/80 flex items-center justify-center hover:scale-110 hover:shadow-[0_0_20px_rgba(239,68,68,0.6)] transition-smooth active:scale-95 group"
          >
            <X className="h-7 w-7 text-destructive group-hover:text-white transition-colors" />
          </button>

          <button
            onClick={handleSwipeUp}
            className="h-20 w-20 rounded-full bg-vibrantOrange border-3 border-vibrantOrange flex items-center justify-center hover:scale-110 shadow-orange-glow hover:shadow-orange-glow-strong transition-smooth active:scale-95 group"
          >
            <Eye className="h-8 w-8 text-white" />
          </button>

          <button
            onClick={handleSwipeRight}
            className="h-16 w-16 rounded-full bg-charcoal border-3 border-vibrantOrange flex items-center justify-center hover:scale-110 hover:bg-vibrantOrange hover:shadow-orange-glow-strong transition-smooth active:scale-95 group"
          >
            <Heart className="h-7 w-7 text-vibrantOrange group-hover:text-white transition-colors" />
          </button>
        </div>
        <p className="text-center text-xs mt-6 font-body" style={{ color: '#BFBFBF' }}>
          Swipe right to like • Tap to view profile • Swipe left to skip
        </p>
      </div>

      {/* Shortlist Drawer */}
      <Sheet open={showShortlistDrawer} onOpenChange={setShowShortlistDrawer}>
        <SheetContent 
          side="right" 
          className={`w-full sm:max-w-lg bg-charcoal border-l-2 border-vibrantOrange/30 overflow-y-auto transition-all ${
            draggedCoach && dragSource !== 'shortlisted' ? 'ring-2 ring-vibrantOrange ring-inset' : ''
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={(e) => {
            e.preventDefault();
            if (draggedCoach && dragSource !== 'shortlisted') {
              setSwipeState(prev => addToList(prev, 'shortlisted', draggedCoach));
              toast.success("Added to shortlist!");
            }
          }}
        >
          <SheetHeader>
            <SheetTitle className="text-2xl font-heading text-white flex items-center gap-2">
              <Bookmark className="h-6 w-6 text-vibrantOrange" />
              Shortlisted Coaches
              <Badge className="ml-auto bg-vibrantOrange text-white">
                {swipeState.shortlisted.length}
              </Badge>
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            {swipeState.shortlisted.length === 0 ? (
              <div className="text-center py-12">
                <Bookmark className="h-16 w-16 mx-auto text-vibrantOrange/30 mb-4" />
                <p className="text-coolGray font-body">No coaches shortlisted yet</p>
                <p className="text-sm text-coolGray/70 mt-2">Drag liked coaches here to shortlist</p>
              </div>
            ) : (
              swipeState.shortlisted.map((coach) => (
                <Card 
                  key={coach.id}
                  className="bg-charcoal/60 border-2 border-vibrantOrange/30 hover:border-vibrantOrange transition-smooth"
                  draggable
                  onDragStart={() => {
                    setDraggedCoach(coach);
                    setDragSource('shortlisted');
                  }}
                  onDragEnd={() => {
                    setDraggedCoach(null);
                    setDragSource(null);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <img
                        src={coach.image}
                        alt={coach.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-vibrantOrange/50"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white truncate">{coach.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-coolGray mt-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                          <span>{coach.rating}</span>
                          <span>•</span>
                          <MapPin className="h-3 w-3" />
                          <span>{coach.city}</span>
                        </div>
                        <div className="text-vibrantOrange font-semibold mt-1">
                          ₹{coach.price}/session
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        onClick={() => {
                          const fullCoach = mockCoaches.find(c => c.id === coach.id);
                          if (fullCoach) {
                            navigate("/session-booking", { state: { coach: fullCoach } });
                          }
                        }}
                        className="flex-1 bg-vibrantOrange hover:bg-vibrantOrange/90 text-white"
                        size="sm"
                      >
                        Book
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-vibrantOrange/50 text-white hover:bg-vibrantOrange/10"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSwipeState(prev => removeFromAll(prev, coach.id));
                          toast.success("Removed from shortlist");
                        }}
                        className="border-destructive/50 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
          {swipeState.shortlisted.length > 0 && (
            <div className="mt-6 p-4 bg-vibrantOrange/10 border border-vibrantOrange/30 rounded-lg">
              <p className="text-sm text-coolGray">
                💡 <span className="font-semibold">Tip:</span> Drag coaches to "Passed" to remove from shortlist
              </p>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Profile Modal */}
      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-charcoal border-2 border-vibrantOrange/30">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading" style={{ color: '#F2F2F2' }}>Coach Profile</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Section Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-vibrantOrange to-transparent"></div>
            
            {/* Header */}
            <div className="flex items-start gap-4">
              <img
                src={currentCoach.image}
                alt={currentCoach.name}
                className="w-24 h-24 rounded-full object-cover border-3 border-vibrantOrange/50 shadow-orange-glow"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold font-heading" style={{ color: '#F2F2F2' }}>{currentCoach.name}</h2>
                    <p className="text-sm font-body" style={{ color: '#BFBFBF' }}>
                      {currentCoach.specialization}
                    </p>
                  </div>
                  <div className="bg-white text-charcoal px-3 py-1.5 rounded-full flex items-center gap-1.5 font-semibold text-xs shadow-orange-glow">
                    <CheckCircle className="h-3.5 w-3.5 text-vibrantOrange" />
                    AI Verified
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mt-3 text-sm">
                  <div className="flex items-center bg-charcoal/50 px-3 py-1.5 rounded-full">
                    <Star className="h-4 w-4 mr-1" style={{ fill: '#FFB800', color: '#FFB800' }} />
                    <span className="font-semibold" style={{ color: '#F2F2F2' }}>{currentCoach.rating}</span>
                  </div>
                  <div className="flex items-center" style={{ color: '#BFBFBF' }}>
                    <MapPin className="h-4 w-4 mr-1 text-vibrantOrange" />
                    {currentCoach.city}
                  </div>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <div className="bg-vibrantOrange/20 text-vibrantOrange px-3 py-1.5 rounded-lg text-sm font-semibold border border-vibrantOrange/40">
                {currentCoach.sport}
              </div>
              <div className="bg-charcoal/60 text-white px-3 py-1.5 rounded-lg text-sm font-semibold border border-white/20 flex items-center gap-1.5">
                {getModeIcon()}
                <span>{currentCoach.mode}</span>
              </div>
              <div className="bg-charcoal/60 text-white px-3 py-1.5 rounded-lg text-sm font-semibold border border-white/20">
                {currentCoach.experience}
              </div>
            </div>

            {/* Section Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

            {/* Description */}
            <div>
              <h3 className="font-semibold font-heading mb-3 text-vibrantOrange">About</h3>
              <p className="text-sm font-body" style={{ color: '#BFBFBF' }}>
                {currentCoach.description}
              </p>
            </div>

            {/* Certifications */}
            <div>
              <h3 className="font-semibold font-heading mb-3 text-vibrantOrange">Certifications</h3>
              <div className="flex flex-wrap gap-2">
                {currentCoach.certifications.map((cert, index) => (
                  <div 
                    key={index}
                    className="bg-charcoal/60 text-white px-3 py-1.5 rounded-lg text-xs font-semibold border border-white/20"
                  >
                    {cert}
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h3 className="font-semibold font-heading mb-3 text-vibrantOrange">Achievements</h3>
              <ul className="space-y-2">
                {currentCoach.achievements.map((achievement, index) => (
                  <li key={index} className="text-sm font-body flex items-start" style={{ color: '#BFBFBF' }}>
                    <span className="text-vibrantOrange mr-2 font-bold">•</span>
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>

            {/* Section Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-vibrantOrange to-transparent"></div>

            {/* Price & Action */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-3xl font-bold text-vibrantOrange font-heading">
                ₹{currentCoach.price}
                <span className="text-sm font-normal" style={{ color: '#BFBFBF' }}>/session</span>
              </div>
              <Button 
                onClick={() => {
                  setSelectedCoachForAction(currentCoach);
                  setShowProfileModal(false);
                  setShowActionModal(true);
                }}
                className="bg-vibrantOrange hover:bg-vibrantOrange/90 shadow-orange-glow hover:shadow-orange-glow-strong transition-smooth"
              >
                Book Session
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Action Modal */}
      <Dialog open={showActionModal} onOpenChange={setShowActionModal}>
        <DialogContent className="max-w-md bg-charcoal border-2 border-vibrantOrange/30">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading text-center" style={{ color: '#F2F2F2' }}>
              What's Next?
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {selectedCoachForAction && (
              <>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-vibrantOrange/30">
                  <img
                    src={selectedCoachForAction.image}
                    alt={selectedCoachForAction.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-vibrantOrange/50 shadow-orange-glow"
                  />
                  <div>
                    <p className="font-semibold font-heading" style={{ color: '#F2F2F2' }}>
                      {selectedCoachForAction.name}
                    </p>
                    <p className="text-sm font-body flex items-center gap-1" style={{ color: '#BFBFBF' }}>
                      <span className="text-vibrantOrange">✓</span> Added to shortlist
                    </p>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              </>
            )}

            <Button
              onClick={handleBookSession}
              className="w-full h-14 bg-vibrantOrange hover:bg-vibrantOrange/90 text-white text-base font-semibold shadow-orange-glow hover:shadow-orange-glow-strong transition-smooth"
            >
              🏋️ Start Training / Book Session
            </Button>

            <Button
              onClick={handleViewDashboard}
              variant="outline"
              className="w-full h-14 text-base font-semibold border-2 border-vibrantOrange/50 text-white hover:bg-vibrantOrange hover:text-white hover:border-vibrantOrange transition-smooth"
            >
              📊 View My Dashboard
            </Button>

            <Button
              onClick={handleContinueBrowsing}
              variant="ghost"
              className="w-full text-sm hover:text-vibrantOrange transition-smooth"
              style={{ color: '#BFBFBF' }}
            >
              Continue browsing coaches →
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoachSwipe;
