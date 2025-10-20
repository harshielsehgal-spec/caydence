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
    <div className="min-h-screen px-4 py-8 bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 font-poppins"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Coaches
        </Button>

        {/* Profile Header */}
        <Card className="mb-6 shadow-card-hover overflow-hidden animate-slide-up">
          <div className="h-32 bg-gradient-to-r from-primary to-primary/60"></div>
          <CardContent className="p-6 -mt-16">
            <div className="flex flex-col sm:flex-row gap-6">
              <img
                src={coach.image}
                alt={coach.name}
                className="w-32 h-32 rounded-xl border-4 border-background shadow-card-hover"
              />
              
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                  <div>
                    <h1 className="text-3xl font-bold font-poppins mb-2">{coach.name}</h1>
                    <p className="text-lg text-muted-foreground font-montserrat">
                      {coach.specialization}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary font-poppins">
                      ₹{coach.price}
                    </div>
                    <p className="text-sm text-muted-foreground">per session</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Badge className="bg-yellow-400/10 text-yellow-600 border-yellow-400/20">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                    {coach.rating} Rating
                  </Badge>
                  <Badge variant="secondary">
                    {coach.sport}
                  </Badge>
                  <Badge variant="outline">
                    <MapPin className="h-3 w-3 mr-1" />
                    {coach.city}
                  </Badge>
                  <Badge variant="outline">
                    {coach.mode}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Experience & Certifications */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold font-poppins">Experience</h3>
              </div>
              <p className="text-muted-foreground font-montserrat">
                {coach.experience} of professional coaching experience
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold font-poppins">Certifications</h3>
              </div>
              <ul className="space-y-1 text-muted-foreground font-montserrat">
                <li>• Certified Sports Coach</li>
                <li>• Advanced Training Specialist</li>
                <li>• Sports Science Diploma</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* AI Pre-Evaluation */}
        <Card className="mb-6 shadow-card bg-gradient-to-br from-primary/5 to-background border-primary/20">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold font-poppins mb-3">
              🤖 AI Pre-Evaluation Available
            </h3>
            <p className="text-muted-foreground font-montserrat mb-4">
              Get an AI-powered form analysis before your first session. Our computer vision technology 
              will help you understand your current technique and prepare you for better coaching results.
            </p>
            <Button
              variant="outline"
              onClick={() => navigate("/motion-analysis")}
              className="font-poppins"
            >
              Start AI Evaluation
            </Button>
          </CardContent>
        </Card>

        {/* Availability */}
        <Card className="mb-6 shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-semibold font-poppins">Available Slots</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {availableSlots.map((slot, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="font-montserrat hover:bg-primary hover:text-primary-foreground transition-smooth"
                >
                  {slot}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Book Button */}
        <div className="flex gap-3">
          <Button
            size="lg"
            className="flex-1 h-14 text-lg font-poppins font-semibold"
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
