import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-athlete.jpg";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section 
        className="relative flex-1 flex items-center justify-center px-6 py-20 gradient-hero overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(211, 47, 47, 0.9) 0%, rgba(17, 17, 17, 0.95) 100%), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-4xl mx-auto text-center relative z-10 animate-slide-up">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-poppins">
            Train Smarter.<br />Move Better.<br />Anywhere.
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-12 font-montserrat">
            AI + Human Coaching Combined for Real Performance
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-white text-primary hover:bg-white/90 font-poppins font-semibold text-lg px-8 py-6 transition-smooth shadow-card-hover"
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/auth?mode=login")}
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary font-poppins font-semibold text-lg px-8 py-6 transition-smooth"
            >
              Login
            </Button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 font-poppins">
            Why Choose Cadence?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl shadow-card bg-card hover:shadow-card-hover transition-smooth">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 font-poppins">Verified Coaches</h3>
              <p className="text-muted-foreground">
                Connect with certified trainers across multiple sports and fitness disciplines
              </p>
            </div>

            <div className="p-6 rounded-xl shadow-card bg-card hover:shadow-card-hover transition-smooth">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 font-poppins">AI Motion Analysis</h3>
              <p className="text-muted-foreground">
                Get real-time form correction using computer vision and rhythm efficiency analysis
              </p>
            </div>

            <div className="p-6 rounded-xl shadow-card bg-card hover:shadow-card-hover transition-smooth">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 font-poppins">Track Progress</h3>
              <p className="text-muted-foreground">
                Monitor your improvement with detailed analytics and personalized insights
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
