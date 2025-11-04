import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Calendar, Award, Clock, ArrowLeft } from "lucide-react";

const CoachProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const coach = location.state?.coach;

  if (!coach) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Coach not found</p>
      </div>
    );
  }

  const availableSlots = [
    "Mon 9:00 AM", "Mon 11:00 AM", "Mon 4:00 PM",
    "Tue 10:00 AM", "Tue 2:00 PM", "Tue 6:00 PM",
    "Wed 8:00 AM", "Wed 1:00 PM", "Wed 5:00 PM",
  ];

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-b from-background to-background/95">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Coaches
        </Button>

        {/* Profile Header */}
        <Card className="mb-6 border-border/50 overflow-hidden">
          <div className="h-40 bg-gradient-to-r from-vibrantOrange/20 via-primary/30 to-vibrantOrange/20 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90"></div>
          </div>
          <CardContent className="p-6 sm:p-8 -mt-20 relative">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <img
                src={coach.image}
                alt={coach.name}
                className="w-32 h-32 rounded-2xl border-4 border-background shadow-lg ring-2 ring-vibrantOrange/20 object-cover"
              />
              
              <div className="flex-1 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="space-y-2">
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{coach.name}</h1>
                    <p className="text-lg text-muted-foreground">
                      {coach.specialization}
                    </p>
                  </div>
                  
                  <div className="sm:text-right bg-primary/10 p-4 rounded-xl border border-primary/20">
                    <div className="text-3xl font-bold text-primary">
                      ₹{coach.price}
                    </div>
                    <p className="text-sm text-muted-foreground">per session</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-yellow-400/10 text-yellow-600 border-yellow-400/20 px-3 py-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                    {coach.rating}
                  </Badge>
                  <Badge variant="secondary" className="px-3 py-1">
                    {coach.sport}
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {coach.city}
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1">
                    {coach.mode}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About Section */}
        {coach.bio && (
          <Card className="mb-6 border-border/50">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-3">About</h3>
              <p className="text-muted-foreground leading-relaxed">{coach.bio}</p>
            </CardContent>
          </Card>
        )}

        {/* Experience & Certifications */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card className="border-border/50 hover:border-primary/30 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Experience</h3>
              </div>
              <p className="text-muted-foreground">
                {coach.experience} of professional coaching experience
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 hover:border-primary/30 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Certifications</h3>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Certified Sports Coach</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Advanced Training Specialist</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Sports Science Diploma</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* AI Pre-Evaluation */}
        <Card className="mb-6 border-primary/30 bg-gradient-to-br from-primary/10 via-background to-background">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🤖</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">
                  AI Pre-Evaluation Available
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Get an AI-powered form analysis before your first session. Our computer vision technology 
                  will help you understand your current technique and prepare you for better coaching results.
                </p>
                <Button
                  variant="outline"
                  onClick={() => navigate("/motion-analysis")}
                  className="border-primary/50 hover:bg-primary/10"
                >
                  Start AI Evaluation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Availability */}
        <Card className="mb-6 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Available Slots</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {availableSlots.map((slot, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                >
                  {slot}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Book Button */}
        <div className="sticky bottom-4 flex gap-3">
          <Button
            size="lg"
            className="flex-1 h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            onClick={() => navigate("/motion-analysis")}
          >
            Book Evaluation Session
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CoachProfile;
