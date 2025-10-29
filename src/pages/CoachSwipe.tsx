import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import SwipeCard from "@/components/SwipeCard";
import { ArrowLeft, SlidersHorizontal, Heart, X, Eye, Star, MapPin, Video, Users, CheckCircle } from "lucide-react";
import { toast } from "sonner";

// Mock coach data
const mockCoaches = [
  {
    id: 1,
    name: "Rajesh Kumar",
    sport: "Cricket",
    rating: 4.8,
    price: 1500,
    city: "Mumbai",
    mode: "Online & Offline",
    image: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=500",
    experience: "8+ years",
    specialization: "Batting Technique & Form Analysis",
    bio: "Certified cricket coach with AI-integrated training methods. Specializes in batting stance correction and timing improvement.",
    description: "Former Ranji Trophy player with extensive experience in developing young talent. Expert in using motion analysis to perfect batting technique, footwork, and shot selection. Works with players from grassroots to professional level.",
    certifications: ["ICC Level 3 Coach", "AI Motion Analysis Certified", "Sports Biomechanics"],
    achievements: ["50+ students at state level", "3 national champions"],
  },
  {
    id: 2,
    name: "Priya Sharma",
    sport: "Football",
    rating: 4.9,
    price: 1200,
    city: "Bangalore",
    mode: "Online",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500",
    experience: "5+ years",
    specialization: "Dribbling & Agility Training",
    bio: "Professional football trainer focused on agility, ball control, and speed training with real-time AI feedback.",
    description: "AFC 'A' License coach specializing in technical skills development. Uses computer vision to analyze dribbling patterns and body positioning for optimal ball control.",
    certifications: ["AFC 'A' License", "Cadence AI Partner", "Youth Development Specialist"],
    achievements: ["Led U-19 team to state finals", "40+ professional academy players trained"],
  },
  {
    id: 3,
    name: "Arjun Mehta",
    sport: "Basketball",
    rating: 4.7,
    price: 1800,
    city: "Delhi",
    mode: "Offline",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500",
    experience: "10+ years",
    specialization: "Shooting Form & Court Vision",
    bio: "Elite basketball coach specializing in shooting mechanics and game IQ development using AI-powered shot analysis.",
    description: "Former professional player turned coach. Expert in biomechanics of shooting form, defensive positioning, and court awareness training.",
    certifications: ["FIBA Certified Coach", "Strength & Conditioning", "AI Sports Analytics"],
    achievements: ["Coached 2 national youth teams", "70+ scholarship placements"],
  },
  {
    id: 4,
    name: "Sneha Patel",
    sport: "Yoga",
    rating: 4.9,
    price: 800,
    city: "Pune",
    mode: "Online & Offline",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500",
    experience: "6+ years",
    specialization: "Posture Correction & Flexibility",
    bio: "Certified yoga instructor using AI motion tracking to perfect asanas and prevent injury through form correction.",
    description: "RYT 500 certified with expertise in Hatha and Vinyasa. Combines traditional yoga wisdom with modern technology for precise alignment feedback.",
    certifications: ["RYT 500", "Anatomy Specialist", "Cadence AI Verified"],
    achievements: ["1000+ students trained", "Featured in Yoga Journal"],
  },
];

const CoachSwipe = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedSport = location.state?.sport || "All Sports";

  const [coaches, setCoaches] = useState(
    mockCoaches.filter(coach => selectedSport === "All Sports" || coach.sport === selectedSport)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shortlistedIds, setShortlistedIds] = useState<number[]>([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedCoachForAction, setSelectedCoachForAction] = useState<typeof currentCoach | null>(null);

  const currentCoach = coaches[currentIndex];

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
        <div className="text-center space-y-4 animate-slide-up">
          <h2 className="text-2xl font-bold font-poppins">No more coaches!</h2>
          <p className="text-muted-foreground font-montserrat">
            You've seen all available coaches for {selectedSport}.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate("/skill-mode")} variant="outline">
              Back to Search
            </Button>
            {shortlistedIds.length > 0 && (
              <Button onClick={() => navigate("/marketplace")}>
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
            onClick={() => toast.info("Filters coming soon!")}
            className="text-white hover:bg-white/10"
          >
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
        </div>
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
