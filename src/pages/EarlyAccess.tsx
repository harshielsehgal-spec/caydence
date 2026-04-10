/**
 * EarlyAccess.tsx — ₹399/month early access waitlist page
 * Route: /pricing
 * Also shown as paywall when free limits are hit.
 * Stores name + email in Supabase early_access_waitlist table.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Zap, Brain, BarChart3, Mic, CheckCircle, ArrowLeft } from "lucide-react";

const FEATURES = [
  { icon: Brain,    text: "AI form analysis — pushups, bicep curls, squats" },
  { icon: Zap,      text: "Real-time voice coaching during every rep" },
  { icon: BarChart3,text: "Per-rep scoring with fault breakdown" },
  { icon: Mic,      text: "Post-session AI coaching report" },
];

const EarlyAccess = () => {
  const navigate  = useNavigate();
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Please enter your name and email.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      // Use supabase as any to bypass generated type restrictions
      // early_access_waitlist was created after types were generated
      const { error } = await (supabase as any)
        .from("early_access_waitlist")
        .insert({
          name:  name.trim(),
          email: email.trim().toLowerCase(),
        });

      if (error) {
        // Unique constraint = already signed up
        if (error.code === "23505") {
          toast.success("You're already on the list! We'll be in touch soon.");
          setDone(true);
          return;
        }
        throw error;
      }

      setDone(true);
      toast.success("You're on the list!");
    } catch (err: any) {
      console.error("Waitlist error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{
        background: "radial-gradient(ellipse at 50% 0%, #1a0a00 0%, #0a0a0a 60%, #000 100%)",
        fontFamily: "'DM Mono', monospace",
      }}
    >
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
            style={{ background: "#FF6B0022", color: "#FF6B00", border: "1px solid #FF6B0055" }}>
            ⚡ Early Access — Limited Spots
          </div>
          <h1 className="text-4xl font-bold text-white mb-3" style={{ letterSpacing: "-0.03em" }}>
            Train like a pro.<br />Pay less than a coffee.
          </h1>
          <p className="text-slate-400 text-sm">
            Caydence uses AI + computer vision to coach your form in real time —<br />
            no personal trainer needed.
          </p>
        </div>

        {/* Price card */}
        <div
          className="rounded-2xl p-6 mb-6"
          style={{ background: "#0d0d0d", border: "1px solid #FF6B0033" }}
        >
          <div className="flex items-end gap-2 mb-1">
            <span className="text-5xl font-bold text-white">₹399</span>
            <span className="text-slate-400 mb-2">/month</span>
            <span className="ml-auto text-xs px-2 py-1 rounded-full font-bold"
              style={{ background: "#FF6B0022", color: "#FF6B00" }}>
              EARLY BIRD
            </span>
          </div>
          <p className="text-slate-500 text-xs mb-6">Price locks in for life when you join early.</p>

          <div className="space-y-3">
            {FEATURES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" style={{ color: "#FF6B00" }} />
                <span className="text-slate-300 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form or success */}
        {done ? (
          <div
            className="rounded-2xl p-8 text-center"
            style={{ background: "#0d1a0d", border: "1px solid #22c55e44" }}
          >
            <CheckCircle className="w-12 h-12 mx-auto mb-4" style={{ color: "#22c55e" }} />
            <h2 className="text-xl font-bold text-white mb-2">You're on the list!</h2>
            <p className="text-slate-400 text-sm">
              We'll email you when early access opens. Expect to hear from us within 48 hours.
            </p>
            <button
              onClick={() => navigate("/sport-selection")}
              className="mt-6 text-sm font-bold uppercase tracking-widest px-6 py-3 rounded-xl transition-all"
              style={{ background: "#FF6B00", color: "#fff" }}
            >
              Continue with free plan →
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all"
              style={{
                background: "#0d0d0d",
                border: "1px solid #FF6B0033",
              }}
              onFocus={(e) => e.target.style.borderColor = "#FF6B00"}
              onBlur={(e)  => e.target.style.borderColor = "#FF6B0033"}
            />
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all"
              style={{
                background: "#0d0d0d",
                border: "1px solid #FF6B0033",
              }}
              onFocus={(e) => e.target.style.borderColor = "#FF6B00"}
              onBlur={(e)  => e.target.style.borderColor = "#FF6B0033"}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all"
              style={{
                background:  loading ? "#7a3300" : "#FF6B00",
                color:       "#fff",
                cursor:      loading ? "not-allowed" : "pointer",
                boxShadow:   loading ? "none" : "0 0 20px rgba(255,107,0,0.4)",
              }}
            >
              {loading ? "Saving your spot..." : "🚀 I want early access — ₹399/month"}
            </button>
            <p className="text-center text-xs text-slate-500 pt-1">
              No payment now. We'll reach out when we launch.
            </p>
          </form>
        )}

        {/* Social proof */}
        <p className="text-center text-xs text-slate-600 mt-8">
          Built on the same computer vision tech used in professional sports analytics.
        </p>
      </div>
    </div>
  );
};

export default EarlyAccess;