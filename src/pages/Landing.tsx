import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-athlete.jpg";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section 
        className="relative flex-1 flex items-center justify-center px-6 py-20 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(255, 107, 0, 0.92) 0%, rgba(198, 40, 0, 0.95) 100%), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-4xl mx-auto text-center relative z-10 animate-slide-up">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 font-heading tracking-wide" style={{ color: '#FFFFFF' }}>
            Train Smarter.<br />Move Better.<br />Anywhere.
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 font-body" style={{ color: '#DADADA' }}>
            AI + Human Coaching Combined for Real Performance
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-vibrantOrange/30 blur-xl rounded-full animate-glow-pulse"></div>
              <Button
                size="lg"
                onClick={() => navigate("/auth")}
                className="relative bg-vibrantOrange text-white hover:bg-white hover:text-vibrantOrange font-heading font-semibold text-lg px-8 py-6 transition-smooth shadow-orange-glow-strong hover:shadow-orange-glow active:scale-95"
              >
                Get Started
              </Button>
            </div>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/auth?mode=login")}
              className="bg-transparent border-2 border-vibrantOrange text-white hover:bg-vibrantOrange hover:text-white hover:shadow-orange-glow font-heading font-semibold text-lg px-8 py-6 transition-smooth active:scale-95"
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
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 font-heading" style={{ color: '#FFFFFF' }}>
            Why Choose Cadence?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div 
              className="p-8 rounded-2xl shadow-card border-2 border-vibrantOrange/20 hover:border-vibrantOrange hover:shadow-orange-glow hover:-translate-y-2 transition-smooth duration-300 group"
              style={{ backgroundColor: '#141414' }}
            >
              <div className="w-14 h-14 bg-vibrantOrange/20 rounded-xl flex items-center justify-center mb-6 shadow-orange-glow group-hover:shadow-orange-glow-strong transition-smooth">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 font-heading" style={{ color: '#E6E6E6' }}>
                Verified Coaches
              </h3>
              <p className="font-body" style={{ color: '#BFBFBF' }}>
                Connect with certified trainers across multiple sports and fitness disciplines
              </p>
            </div>

            <div 
              className="p-8 rounded-2xl shadow-card border-2 border-vibrantOrange/20 hover:border-vibrantOrange hover:shadow-orange-glow hover:-translate-y-2 transition-smooth duration-300 group"
              style={{ backgroundColor: '#141414' }}
            >
              <div className="w-14 h-14 bg-vibrantOrange/20 rounded-xl flex items-center justify-center mb-6 shadow-orange-glow group-hover:shadow-orange-glow-strong transition-smooth">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 font-heading" style={{ color: '#E6E6E6' }}>
                AI Motion Analysis
              </h3>
              <p className="font-body" style={{ color: '#BFBFBF' }}>
                Get real-time form correction using computer vision and rhythm efficiency analysis
              </p>
            </div>

            <div 
              className="p-8 rounded-2xl shadow-card border-2 border-vibrantOrange/20 hover:border-vibrantOrange hover:shadow-orange-glow hover:-translate-y-2 transition-smooth duration-300 group"
              style={{ backgroundColor: '#141414' }}
            >
              <div className="w-14 h-14 bg-vibrantOrange/20 rounded-xl flex items-center justify-center mb-6 shadow-orange-glow group-hover:shadow-orange-glow-strong transition-smooth">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 font-heading" style={{ color: '#E6E6E6' }}>
                Track Progress
              </h3>
              <p className="font-body" style={{ color: '#BFBFBF' }}>
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
