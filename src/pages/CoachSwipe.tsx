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
      <div className="min-h-screen bg-gradient-to-br from-charcoal via-charcoal/95 to-crimson/20 flex items-center justify-center px-4">
        <div className="text-center space-y-4 animate-slide-up max-w-md mx-auto">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold font-poppins">No coaches match your filters</h2>
          <p className="text-muted-foreground font-montserrat">
            Try clearing filters or expanding your search criteria.
          </p>
          <div className="flex flex-col gap-3 justify-center">
            <Button onClick={handleResetFilters} className="bg-crimson hover:bg-crimson/90">
              Reset Filters
            </Button>
            <Button onClick={() => navigate("/skill-mode")} variant="outline">
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
    <div className="min-h-screen bg-gradient-to-br from-charcoal via-charcoal/95 to-crimson/20">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 bg-charcoal/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/skill-mode")}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="text-center">
            <h1 className="text-xl font-bold font-poppins text-white">{selectedSport}</h1>
            <p className="text-xs text-muted-foreground font-montserrat">
              {currentIndex + 1} / {coaches.length}
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className="text-white hover:bg-white/10"
          >
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="border-t border-white/10 bg-charcoal/95 animate-accordion-down">
            <div className="max-w-6xl mx-auto px-4 py-4 space-y-4">
              {/* Sort Dropdown */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground font-montserrat">
                  SORT BY
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-charcoal border border-white/20 text-white rounded-lg px-3 py-2 text-sm font-montserrat focus:outline-none focus:ring-2 focus:ring-crimson"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low → High</option>
                  <option value="price-high">Price: High → Low</option>
                  <option value="rating">Rating: High → Low</option>
                  <option value="experience">Experience: High → Low</option>
                </select>
              </div>

              {/* Quick Filters */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-muted-foreground font-montserrat">
                  FILTERS
                </label>
                
                {/* Mode Filter */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-montserrat">Mode</p>
                  <div className="flex gap-2 flex-wrap">
                    <Badge
                      variant={filterMode === "all" ? "default" : "outline"}
                      className={`cursor-pointer ${filterMode === "all" ? "bg-crimson" : ""}`}
                      onClick={() => setFilterMode("all")}
                    >
                      All
                    </Badge>
                    <Badge
                      variant={filterMode === "online" ? "default" : "outline"}
                      className={`cursor-pointer ${filterMode === "online" ? "bg-crimson" : ""}`}
                      onClick={() => setFilterMode("online")}
                    >
                      Online
                    </Badge>
                    <Badge
                      variant={filterMode === "offline" ? "default" : "outline"}
                      className={`cursor-pointer ${filterMode === "offline" ? "bg-crimson" : ""}`}
                      onClick={() => setFilterMode("offline")}
                    >
                      Offline
                    </Badge>
                  </div>
                </div>

                {/* City Filter */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-montserrat">City</p>
                  <select
                    value={filterCity}
                    onChange={(e) => setFilterCity(e.target.value)}
                    className="w-full bg-charcoal border border-white/20 text-white rounded-lg px-3 py-2 text-sm font-montserrat focus:outline-none focus:ring-2 focus:ring-crimson"
                  >
                    <option value="all">All Cities</option>
                    {availableCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* Fee Filter */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-montserrat text-white">
                    Fee ≤ ₹800
                  </label>
                  <button
                    onClick={() => setFilterMaxFee(!filterMaxFee)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      filterMaxFee ? "bg-crimson" : "bg-white/20"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        filterMaxFee ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Reset Button */}
              <Button
                onClick={handleResetFilters}
                variant="outline"
                className="w-full text-sm"
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
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-charcoal via-charcoal/95 to-transparent pb-8 pt-6">
        <div className="flex items-center justify-center gap-6">
          <Button
            size="icon"
            variant="outline"
            className="h-14 w-14 rounded-full border-2 hover:scale-110 transition-transform"
            onClick={handleSwipeLeft}
          >
            <X className="h-6 w-6 text-destructive" />
          </Button>

          <Button
            size="icon"
            variant="outline"
            className="h-16 w-16 rounded-full border-2 hover:scale-110 transition-transform"
            onClick={handleSwipeUp}
          >
            <Eye className="h-7 w-7 text-primary" />
          </Button>

          <Button
            size="icon"
            className="h-14 w-14 rounded-full bg-crimson hover:bg-crimson/90 hover:scale-110 transition-transform"
            onClick={handleSwipeRight}
          >
            <Heart className="h-6 w-6" />
          </Button>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-4 font-montserrat">
          Swipe right to like • Tap to view profile • Swipe left to skip
        </p>
      </div>

      {/* Profile Modal */}
      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-poppins">Coach Profile</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start gap-4">
              <img
                src={currentCoach.image}
                alt={currentCoach.name}
                className="w-24 h-24 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold font-poppins">{currentCoach.name}</h2>
                    <p className="text-sm text-muted-foreground font-montserrat">
                      {currentCoach.specialization}
                    </p>
                  </div>
                  <Badge className="bg-crimson text-white">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    AI Verified
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-semibold">{currentCoach.rating}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {currentCoach.city}
                  </div>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{currentCoach.sport}</Badge>
              <Badge variant="outline">
                {getModeIcon()}
                <span className="ml-1">{currentCoach.mode}</span>
              </Badge>
              <Badge variant="outline">{currentCoach.experience}</Badge>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold font-poppins mb-2">About</h3>
              <p className="text-sm text-muted-foreground font-montserrat">
                {currentCoach.description}
              </p>
            </div>

            {/* Certifications */}
            <div>
              <h3 className="font-semibold font-poppins mb-2">Certifications</h3>
              <div className="flex flex-wrap gap-2">
                {currentCoach.certifications.map((cert, index) => (
                  <Badge key={index} variant="outline" className="font-montserrat">
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h3 className="font-semibold font-poppins mb-2">Achievements</h3>
              <ul className="space-y-1">
                {currentCoach.achievements.map((achievement, index) => (
                  <li key={index} className="text-sm text-muted-foreground font-montserrat flex items-start">
                    <span className="text-crimson mr-2">•</span>
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>

            {/* Price & Action */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-2xl font-bold text-crimson font-poppins">
                ₹{currentCoach.price}
                <span className="text-sm font-normal text-muted-foreground">/session</span>
              </div>
              <Button 
                onClick={() => {
                  setSelectedCoachForAction(currentCoach);
                  setShowProfileModal(false);
                  setShowActionModal(true);
                }}
                className="bg-crimson hover:bg-crimson/90"
              >
                Book Session
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Action Modal */}
      <Dialog open={showActionModal} onOpenChange={setShowActionModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-poppins text-center">
              What's Next?
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {selectedCoachForAction && (
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <img
                  src={selectedCoachForAction.image}
                  alt={selectedCoachForAction.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold font-poppins">{selectedCoachForAction.name}</p>
                  <p className="text-sm text-muted-foreground font-montserrat">
                    Added to shortlist ✓
                  </p>
                </div>
              </div>
            )}

            <Button
              onClick={handleBookSession}
              className="w-full h-14 bg-crimson hover:bg-crimson/90 text-base font-semibold"
            >
              🏋️ Start Training / Book Session
            </Button>

            <Button
              onClick={handleViewDashboard}
              variant="outline"
              className="w-full h-14 text-base font-semibold"
            >
              📊 View My Dashboard
            </Button>

            <Button
              onClick={handleContinueBrowsing}
              variant="ghost"
              className="w-full text-sm text-muted-foreground hover:text-foreground"
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
