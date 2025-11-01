import { useState } from "react";
import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import SwipeCard from "@/components/SwipeCard";
import { ArrowLeft, SlidersHorizontal, Heart, X, Eye, Star, MapPin, Video, Users, CheckCircle } from "lucide-react";
import { toast } from "sonner";

// Mock coach data - Seeded dataset
const mockCoaches = [
  // Football Coaches
  {
    id: 1,
    name: "Aarav Khanna",
    sport: "Football",
    rating: 4.8,
    price: 900,
    city: "Delhi",
    mode: "Online & Offline",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500",
    experience: "6+ years",
    specialization: "Instep Shooting & Dribbling Control",
    bio: "Expert in instep shooting technique, dribbling control, and stamina building for competitive players.",
    description: "Certified football coach specializing in technical skills development. Uses AI-powered motion analysis to perfect shooting form, dribbling patterns, and endurance training. Works with youth academies and competitive leagues.",
    certifications: ["AFC 'B' License", "AI Motion Analysis Certified", "Youth Development"],
    achievements: ["30+ academy placements", "State championship coach"],
  },
  {
    id: 2,
    name: "Nisha Rao",
    sport: "Football",
    rating: 4.6,
    price: 700,
    city: "Gurgaon",
    mode: "Online",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500",
    experience: "4+ years",
    specialization: "First-Touch & Passing Accuracy",
    bio: "Specializes in first-touch control, passing accuracy, and youth development programs.",
    description: "Professional trainer focused on technical fundamentals. Expert in developing ball control, accurate passing, and game intelligence for young players. Offers structured online programs with video feedback.",
    certifications: ["AFC 'C' License", "Youth Coaching Specialist", "Cadence AI Partner"],
    achievements: ["Youth program director", "40+ players trained"],
  },
  {
    id: 3,
    name: "Kabir Mehta",
    sport: "Football",
    rating: 4.9,
    price: 1100,
    city: "Noida",
    mode: "Offline",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500",
    experience: "8+ years",
    specialization: "Elite Dribbling & Finishing",
    bio: "Elite-level training in dribble drills, pace development, and clinical finishing techniques.",
    description: "Former semi-professional player with extensive coaching experience. Specializes in advanced dribbling techniques, speed training, and goal-scoring efficiency. Works with competitive teams and individual players.",
    certifications: ["AFC 'A' License", "Strength & Conditioning", "AI Sports Analytics"],
    achievements: ["Coached state champions", "60+ professional academy players"],
  },
  
  // Cricket Coaches
  {
    id: 4,
    name: "Ritvik Sharma",
    sport: "Cricket",
    rating: 4.7,
    price: 950,
    city: "Delhi",
    mode: "Online & Offline",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500",
    experience: "7+ years",
    specialization: "Batting Technique & Timing",
    bio: "Expert in batting technique, straight drive mechanics, and timing improvement for all formats.",
    description: "Former Ranji Trophy player specializing in batting fundamentals. Uses AI motion tracking to analyze and perfect stroke technique, footwork, and timing. Focuses on building solid technique for long-term success.",
    certifications: ["ICC Level 2 Coach", "AI Motion Analysis Certified", "BCCI Certified"],
    achievements: ["40+ state-level players", "2 Ranji selections"],
  },
  {
    id: 5,
    name: "Pranavi Iyer",
    sport: "Cricket",
    rating: 4.5,
    price: 750,
    city: "Noida",
    mode: "Online",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500",
    experience: "5+ years",
    specialization: "Bowling Action & Workload Management",
    bio: "Specializes in bowling action basics, injury prevention, and safe workload management.",
    description: "Professional bowling coach with expertise in action mechanics and injury prevention. Uses video analysis to identify and correct bowling faults. Focuses on sustainable training for young fast bowlers and spinners.",
    certifications: ["ICC Level 1 Coach", "Sports Physiotherapy", "Cadence AI Verified"],
    achievements: ["Youth development program", "30+ bowlers trained"],
  },
  {
    id: 6,
    name: "Harsh Malhotra",
    sport: "Cricket",
    rating: 4.8,
    price: 1200,
    city: "Ghaziabad",
    mode: "Offline",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500",
    experience: "9+ years",
    specialization: "Advanced Footwork & Shot Selection",
    bio: "Elite training in footwork, pull/cover drive techniques, and match awareness development.",
    description: "Senior coach with professional playing background. Specializes in advanced batting techniques including footwork patterns, shot selection, and match situations. Works with competitive cricketers aiming for state and national selection.",
    certifications: ["ICC Level 3 Coach", "Match Strategy", "AI Analytics"],
    achievements: ["3 national selections", "50+ state-level batsmen"],
  },
  
  // Tennis Coaches
  {
    id: 7,
    name: "Zoya Kapur",
    sport: "Tennis",
    rating: 4.9,
    price: 1200,
    city: "Delhi",
    mode: "Online & Offline",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500",
    experience: "9+ years",
    specialization: "Forehand Topspin & Footwork",
    bio: "Expert in forehand topspin mechanics, footwork ladder drills, and competitive match play.",
    description: "Professional tennis coach with ITF certification. Specializes in modern forehand technique with heavy topspin, agility training, and competitive mindset development. Uses motion analysis for precision coaching.",
    certifications: ["ITF Level 2", "AI Motion Tracking", "Sports Psychology"],
    achievements: ["National junior coach", "80+ tournament players"],
  },
  {
    id: 8,
    name: "Arjun Bhatt",
    sport: "Tennis",
    rating: 4.6,
    price: 800,
    city: "Faridabad",
    mode: "Online",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500",
    experience: "5+ years",
    specialization: "Backhand Consistency & Serve",
    bio: "Focuses on backhand consistency, serve toss mechanics, and online technical coaching.",
    description: "Technical coach specializing in stroke mechanics and serve development. Offers structured online programs with detailed video analysis. Expert in building consistent two-handed and one-handed backhands.",
    certifications: ["ITF Level 1", "Online Coaching Certified", "Cadence AI Partner"],
    achievements: ["Online academy founder", "40+ students globally"],
  },
  {
    id: 9,
    name: "Meera Sethi",
    sport: "Tennis",
    rating: 4.7,
    price: 1000,
    city: "Delhi",
    mode: "Offline",
    image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=500",
    experience: "6+ years",
    specialization: "Net Game & Recovery",
    bio: "Specializes in net game tactics, split-step timing, and court recovery techniques.",
    description: "Former competitive player turned coach. Focuses on volleys, net play tactics, court positioning, and recovery footwork. Works on developing all-court game for competitive players.",
    certifications: ["ITF Level 2", "Doubles Specialist", "AI Cadence Verified"],
    achievements: ["Doubles state champion", "50+ competitive players"],
  },
];

const CoachSwipe = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedSport = location.state?.sport || "All Sports";

  // Filter and Sort State
  const [sortBy, setSortBy] = useState<string>("recommended");
  const [filterMode, setFilterMode] = useState<string>("all");
  const [filterCity, setFilterCity] = useState<string>("all");
  const [filterMaxFee, setFilterMaxFee] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState(false);

  // Apply filters and sorting
  const getFilteredAndSortedCoaches = () => {
    let filtered = mockCoaches.filter(
      coach => selectedSport === "All Sports" || coach.sport === selectedSport
    );

    // Apply mode filter
    if (filterMode !== "all") {
      filtered = filtered.filter(coach => 
        coach.mode.toLowerCase().includes(filterMode.toLowerCase())
      );
    }

    // Apply city filter
    if (filterCity !== "all") {
      filtered = filtered.filter(coach => coach.city === filterCity);
    }

    // Apply max fee filter
    if (filterMaxFee) {
      filtered = filtered.filter(coach => coach.price <= 800);
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
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

  const [coaches, setCoaches] = useState(getFilteredAndSortedCoaches());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shortlistedIds, setShortlistedIds] = useState<number[]>([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedCoachForAction, setSelectedCoachForAction] = useState<typeof currentCoach | null>(null);

  // Re-filter when filters change
  React.useEffect(() => {
    const filtered = getFilteredAndSortedCoaches();
    setCoaches(filtered);
    setCurrentIndex(0);
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
    setSortBy("recommended");
    setFilterMode("all");
    setFilterCity("all");
    setFilterMaxFee(false);
  };

  const handleSwipeLeft = () => {
    if (currentIndex < coaches.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      toast.info("No more coaches to show!");
    }
  };

  const handleSwipeRight = () => {
    if (currentCoach) {
      setShortlistedIds([...shortlistedIds, currentCoach.id]);
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

  if (!currentCoach) {
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
            No coaches match your filters
          </h2>
          <p className="font-body" style={{ color: '#BFBFBF' }}>
            Try clearing filters or expanding your search criteria.
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
            {shortlistedIds.length > 0 && (
              <Button onClick={() => navigate("/marketplace")} variant="ghost">
                View Shortlist ({shortlistedIds.length})
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

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className="text-vibrantOrange hover:bg-vibrantOrange/10 hover:shadow-orange-glow transition-smooth"
          >
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
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

      {/* Swipe Area */}
      <div className="relative h-[calc(100vh-180px)] max-w-2xl mx-auto">
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
