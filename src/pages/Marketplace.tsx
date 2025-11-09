import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CoachCard from "@/components/CoachCard";
import { Search, SlidersHorizontal } from "lucide-react";

// Mock coach data - Expanded and diversified
const mockCoaches = [
  // ⚽ FOOTBALL
  { 
    id: 1, 
    name: "Aarav Khanna", 
    city: "Delhi", 
    sport: "Football",
    sportTag: "football", 
    rating: 4.8, 
    price: 1200, 
    mode: "Hybrid",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav",
    experience: "8 years",
    specialization: "Attacking drills and off-ball movement",
  },
  { 
    id: 2, 
    name: "Ryan D'Souza", 
    city: "Goa", 
    sport: "Football",
    sportTag: "football", 
    rating: 4.6, 
    price: 900, 
    mode: "Online",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ryan",
    experience: "6 years",
    specialization: "Precision passing and endurance",
  },
  { 
    id: 3, 
    name: "Karan Oberoi", 
    city: "Mumbai", 
    sport: "Football",
    sportTag: "football", 
    rating: 4.9, 
    price: 1400, 
    mode: "Offline",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Karan",
    experience: "10 years",
    specialization: "Goal-scoring tactics and formations",
  },
  { 
    id: 4, 
    name: "Zaid Alam", 
    city: "Lucknow", 
    sport: "Football",
    sportTag: "football", 
    rating: 4.7, 
    price: 1100, 
    mode: "Hybrid",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zaid",
    experience: "7 years",
    specialization: "Defensive strategy and stamina building",
  },
  { 
    id: 5, 
    name: "Mehul Jain", 
    city: "Pune", 
    sport: "Football",
    sportTag: "football", 
    rating: 4.5, 
    price: 800, 
    mode: "Online",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mehul",
    experience: "5 years",
    specialization: "Agility and speed development",
  },

  // 🏏 CRICKET
  { 
    id: 6, 
    name: "Rajat Kapoor", 
    city: "Jaipur", 
    sport: "Cricket",
    sportTag: "cricket", 
    rating: 4.9, 
    price: 1500, 
    mode: "Offline",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajat",
    experience: "12 years",
    specialization: "Spin and line control",
  },
  { 
    id: 7, 
    name: "Nisha Rao", 
    city: "Chennai", 
    sport: "Cricket",
    sportTag: "cricket", 
    rating: 4.6, 
    price: 950, 
    mode: "Hybrid",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=NishaC",
    experience: "8 years",
    specialization: "Swing bowling and consistency drills",
  },
  { 
    id: 8, 
    name: "Tanuj Malhotra", 
    city: "Delhi", 
    sport: "Cricket",
    sportTag: "cricket", 
    rating: 4.8, 
    price: 1200, 
    mode: "Offline",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tanuj",
    experience: "10 years",
    specialization: "Power hitting and shot placement",
  },
  { 
    id: 9, 
    name: "Akshay Pillai", 
    city: "Bangalore", 
    sport: "Cricket",
    sportTag: "cricket", 
    rating: 4.7, 
    price: 1000, 
    mode: "Hybrid",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Akshay",
    experience: "10 years",
    specialization: "Fielding and wicket-keeping",
  },
  { 
    id: 10, 
    name: "Sourabh Das", 
    city: "Kolkata", 
    sport: "Cricket",
    sportTag: "cricket", 
    rating: 4.5, 
    price: 850, 
    mode: "Online",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sourabh",
    experience: "6 years",
    specialization: "Fast bowlers' conditioning",
  },

  // 🏀 BASKETBALL
  { 
    id: 11, 
    name: "Tania Das", 
    city: "Kolkata", 
    sport: "Basketball",
    sportTag: "basketball", 
    rating: 4.9, 
    price: 1100, 
    mode: "Hybrid",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tania",
    experience: "9 years",
    specialization: "Shooting accuracy",
  },
  { 
    id: 12, 
    name: "Arjun Sen", 
    city: "Delhi", 
    sport: "Basketball",
    sportTag: "basketball", 
    rating: 4.7, 
    price: 950, 
    mode: "Offline",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=ArjunSen",
    experience: "7 years",
    specialization: "Dribbling and zone defense",
  },
  { 
    id: 13, 
    name: "Rehan George", 
    city: "Mumbai", 
    sport: "Basketball",
    sportTag: "basketball", 
    rating: 4.8, 
    price: 1300, 
    mode: "Hybrid",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rehan",
    experience: "11 years",
    specialization: "Fitness-oriented skill development",
  },
  { 
    id: 14, 
    name: "Kabir Mehta", 
    city: "Noida", 
    sport: "Basketball",
    sportTag: "basketball", 
    rating: 4.9, 
    price: 1250, 
    mode: "Offline",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=KabirB",
    experience: "10 years",
    specialization: "Footwork and vertical jump training",
  },
  { 
    id: 15, 
    name: "Shivani Nair", 
    city: "Hyderabad", 
    sport: "Basketball",
    sportTag: "basketball", 
    rating: 4.5, 
    price: 900, 
    mode: "Online",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Shivani",
    experience: "5 years",
    specialization: "Team coordination",
  },

  // 🎾 TENNIS
  { 
    id: 16, 
    name: "Neeraj Saini", 
    city: "Chandigarh", 
    sport: "Tennis",
    sportTag: "tennis", 
    rating: 4.8, 
    price: 1300, 
    mode: "Hybrid",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Neeraj",
    experience: "9 years",
    specialization: "Serve technique and baseline control",
  },
  { 
    id: 17, 
    name: "Ananya Menon", 
    city: "Bangalore", 
    sport: "Tennis",
    sportTag: "tennis", 
    rating: 4.6, 
    price: 950, 
    mode: "Online",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=AnanyaM",
    experience: "6 years",
    specialization: "Footwork drills and forehand accuracy",
  },
  { 
    id: 18, 
    name: "Dev Chauhan", 
    city: "Delhi", 
    sport: "Tennis",
    sportTag: "tennis", 
    rating: 4.9, 
    price: 1500, 
    mode: "Offline",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dev",
    experience: "12 years",
    specialization: "Mental endurance",
  },
  { 
    id: 19, 
    name: "Ritika Patel", 
    city: "Pune", 
    sport: "Tennis",
    sportTag: "tennis", 
    rating: 4.7, 
    price: 1000, 
    mode: "Hybrid",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ritika",
    experience: "7 years",
    specialization: "Serve-return strategy",
  },
  { 
    id: 20, 
    name: "Samar Iqbal", 
    city: "Jaipur", 
    sport: "Tennis",
    sportTag: "tennis", 
    rating: 4.5, 
    price: 800, 
    mode: "Online",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Samar",
    experience: "5 years",
    specialization: "Timing and backhand strength",
  },

  // 🏸 BADMINTON
  { 
    id: 21, 
    name: "Kavya Rao", 
    city: "Bangalore", 
    sport: "Badminton",
    sportTag: "badminton", 
    rating: 4.8, 
    price: 1100, 
    mode: "Hybrid",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kavya",
    experience: "8 years",
    specialization: "Footwork agility and reflex training",
  },
  { 
    id: 22, 
    name: "Ankit Bansal", 
    city: "Delhi", 
    sport: "Badminton",
    sportTag: "badminton", 
    rating: 4.7, 
    price: 1000, 
    mode: "Offline",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ankit",
    experience: "7 years",
    specialization: "Net reflex expert",
  },
  { 
    id: 23, 
    name: "Sneha Chatterjee", 
    city: "Kolkata", 
    sport: "Badminton",
    sportTag: "badminton", 
    rating: 4.9, 
    price: 1200, 
    mode: "Offline",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=SnehaC",
    experience: "10 years",
    specialization: "Strength and accuracy",
  },
  { 
    id: 24, 
    name: "Rohan Gupta", 
    city: "Mumbai", 
    sport: "Badminton",
    sportTag: "badminton", 
    rating: 4.6, 
    price: 950, 
    mode: "Hybrid",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=RohanG",
    experience: "6 years",
    specialization: "Junior training programs",
  },
  { 
    id: 25, 
    name: "Piyush Rawat", 
    city: "Dehradun", 
    sport: "Badminton",
    sportTag: "badminton", 
    rating: 4.5, 
    price: 850, 
    mode: "Online",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Piyush",
    experience: "5 years",
    specialization: "Shuttle control and wrist precision",
  },
];

const Marketplace = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const preferences = location.state || {};
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recommended");
  const [filterMode, setFilterMode] = useState("all");

  const filteredCoaches = mockCoaches.filter(coach => {
    const matchesSearch = coach.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         coach.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         coach.sportTag.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMode = filterMode === "all" || coach.mode.toLowerCase().includes(filterMode);
    const matchesSport = !preferences.sport || coach.sport === preferences.sport;
    return matchesSearch && matchesMode && matchesSport;
  });

  const sortedCoaches = [...filteredCoaches].sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    return 0; // recommended
  });

  return (
    <div className="min-h-screen px-4 py-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 font-poppins">
            Find Your Coach
          </h1>
          <p className="text-muted-foreground font-montserrat">
            {preferences.sport ? `Coaches for ${preferences.sport}` : "Browse verified trainers"}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search coaches or sports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px] h-12">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant={filterMode === "all" ? "default" : "outline"}
              onClick={() => setFilterMode("all")}
              className="font-poppins"
            >
              All
            </Button>
            <Button
              size="sm"
              variant={filterMode === "online" ? "default" : "outline"}
              onClick={() => setFilterMode("online")}
              className="font-poppins"
            >
              Online
            </Button>
            <Button
              size="sm"
              variant={filterMode === "offline" ? "default" : "outline"}
              onClick={() => setFilterMode("offline")}
              className="font-poppins"
            >
              Offline
            </Button>
            <Button
              size="sm"
              variant={filterMode === "hybrid" ? "default" : "outline"}
              onClick={() => setFilterMode("hybrid")}
              className="font-poppins"
            >
              Hybrid
            </Button>
          </div>
        </div>

        {/* Coach Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {sortedCoaches.map((coach, index) => (
            <div
              key={coach.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CoachCard
                coach={coach}
                onClick={() => navigate(`/coach/${coach.id}`, { state: { coach } })}
              />
            </div>
          ))}
        </div>

        {/* No Results */}
        {sortedCoaches.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground font-montserrat">
              No coaches found matching your criteria
            </p>
          </div>
        )}

        {/* Back Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="font-poppins"
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
