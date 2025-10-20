import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CoachCard from "@/components/CoachCard";
import { Search, SlidersHorizontal } from "lucide-react";

// Mock coach data
const mockCoaches = [
  {
    id: 1,
    name: "Rahul Sharma",
    sport: "Cricket",
    rating: 4.9,
    price: 800,
    city: "Mumbai",
    mode: "Hybrid",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
    experience: "10 years",
    specialization: "Batting Technique"
  },
  {
    id: 2,
    name: "Priya Mehta",
    sport: "Yoga",
    rating: 4.8,
    price: 600,
    city: "Bangalore",
    mode: "Online",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    experience: "8 years",
    specialization: "Hatha & Vinyasa"
  },
  {
    id: 3,
    name: "Arjun Reddy",
    sport: "Fitness",
    rating: 4.7,
    price: 1000,
    city: "Delhi",
    mode: "Offline",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
    experience: "12 years",
    specialization: "Strength Training"
  },
  {
    id: 4,
    name: "Sneha Patel",
    sport: "Basketball",
    rating: 4.9,
    price: 900,
    city: "Mumbai",
    mode: "Hybrid",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha",
    experience: "7 years",
    specialization: "Shooting & Defense"
  },
  {
    id: 5,
    name: "Vikram Singh",
    sport: "Boxing",
    rating: 4.8,
    price: 1200,
    city: "Pune",
    mode: "Offline",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram",
    experience: "15 years",
    specialization: "Technical Boxing"
  },
  {
    id: 6,
    name: "Ananya Das",
    sport: "Tennis",
    rating: 4.6,
    price: 700,
    city: "Kolkata",
    mode: "Online",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya",
    experience: "6 years",
    specialization: "Serve & Volley"
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
                         coach.sport.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMode = filterMode === "all" || coach.mode.toLowerCase().includes(filterMode);
    return matchesSearch && matchesMode;
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
