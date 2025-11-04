import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, TrendingUp, TrendingDown } from "lucide-react";
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell 
} from "recharts";

const mockData = {
  monthlyEarnings: [
    { month: "Aug", amount: 15000 },
    { month: "Sep", amount: 21000 },
    { month: "Oct", amount: 27000 },
    { month: "Nov", amount: 30000 }
  ],
  cityPricing: [
    { city: "Jaipur", avgSession: 800, yourPrice: 900 },
    { city: "Lucknow", avgSession: 750, yourPrice: 700 },
    { city: "Guwahati", avgSession: 650, yourPrice: 680 }
  ],
  sportBreakdown: [
    { sport: "Football", revenue: 18000 },
    { sport: "Cricket", revenue: 9500 },
    { sport: "Tennis", revenue: 7500 }
  ],
  planBreakdown: [
    { plan: "Basic", count: 12, revenue: 7200 },
    { plan: "Pro", count: 9, revenue: 10800 },
    { plan: "Elite", count: 5, revenue: 12500 }
  ]
};

const CoachRevenue = () => {
  const navigate = useNavigate();

  // Calculate insights
  const totalRevenue = mockData.monthlyEarnings[mockData.monthlyEarnings.length - 1].amount;
  const prevRevenue = mockData.monthlyEarnings[mockData.monthlyEarnings.length - 2].amount;
  const growthPercent = Math.round(((totalRevenue - prevRevenue) / prevRevenue) * 100);
  
  const totalSportRevenue = mockData.sportBreakdown.reduce((acc, s) => acc + s.revenue, 0);
  const footballPercent = Math.round((mockData.sportBreakdown[0].revenue / totalSportRevenue) * 100);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-lg font-semibold text-primary">₹{payload[0].value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  const PricingTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const city = payload[0].payload.city;
      const avg = payload[0].payload.avgSession;
      const yours = payload[0].payload.yourPrice;
      const diff = ((yours - avg) / avg * 100).toFixed(1);
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-semibold text-foreground">{city}</p>
          <p className="text-xs text-muted-foreground">Market Avg: ₹{avg}</p>
          <p className="text-xs text-muted-foreground">Your Price: ₹{yours}</p>
          <p className={`text-xs font-semibold ${parseFloat(diff) > 0 ? 'text-primary' : 'text-blue-400'}`}>
            {parseFloat(diff) > 0 ? '+' : ''}{diff}% {parseFloat(diff) > 0 ? 'above' : 'below'} market
          </p>
        </div>
      );
    }
    return null;
  };

  const getPricingHint = (city: string, avg: number, yours: number) => {
    const diff = ((yours - avg) / avg) * 100;
    if (diff < -10) {
      return { 
        text: "Consider raising your rate", 
        color: "text-blue-400",
        icon: TrendingUp
      };
    }
    if (diff > 20) {
      return { 
        text: "Premium pricing (keep quality high)", 
        color: "text-primary",
        icon: TrendingUp
      };
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal via-[hsl(0,0%,10%)] to-charcoal p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate("/coach/home")}
              className="mb-3 text-muted-foreground hover:text-foreground -ml-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground font-heading">
              Revenue Optimization
            </h1>
            <p className="text-muted-foreground mt-2">Track earnings, pricing insights, and revenue drivers</p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Download Report
          </Button>
        </div>

        {/* Summary Insights */}
        <Card className="bg-card/80 border-primary/30">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-foreground">
                <span className="font-semibold">You earned ₹{totalRevenue.toLocaleString()} this month</span>
                <span className="text-primary ml-2">(+{growthPercent}% vs Oct)</span>
              </p>
              <p className="text-muted-foreground text-sm">
                Football accounts for <span className="text-primary font-semibold">{footballPercent}%</span> of total revenue.
              </p>
              <p className="text-muted-foreground text-sm">
                Your Lucknow rate is <span className="text-blue-400 font-semibold">6% below market</span> — try adjusting pricing.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Earnings Chart */}
        <Card className="bg-card/80 border-border hover:border-primary/30 transition-smooth">
          <CardHeader>
            <CardTitle className="text-foreground font-heading">Monthly Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockData.monthlyEarnings}>
                <defs>
                  <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(16, 100%, 50%)" />
                    <stop offset="100%" stopColor="hsl(25, 100%, 50%)" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 20%)" />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(0, 0%, 75%)"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="hsl(0, 0%, 75%)"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => `₹${value / 1000}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="amount" fill="url(#earningsGradient)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pricing Insights by City */}
          <Card className="bg-card/80 border-border hover:border-primary/30 transition-smooth">
            <CardHeader>
              <CardTitle className="text-foreground font-heading">Pricing Insights by City</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={mockData.cityPricing} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 20%)" />
                  <XAxis 
                    type="number" 
                    stroke="hsl(0, 0%, 75%)"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="city" 
                    stroke="hsl(0, 0%, 75%)"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip content={<PricingTooltip />} />
                  <Bar dataKey="avgSession" fill="hsl(0, 0%, 40%)" radius={[0, 4, 4, 0]} name="Market Avg" />
                  <Bar dataKey="yourPrice" fill="hsl(18, 100%, 50%)" radius={[0, 4, 4, 0]} name="Your Price" />
                </BarChart>
              </ResponsiveContainer>
              
              {/* Pricing Hints */}
              <div className="space-y-2 mt-4 pt-4 border-t border-border">
                {mockData.cityPricing.map((city) => {
                  const hint = getPricingHint(city.city, city.avgSession, city.yourPrice);
                  if (!hint) return null;
                  const Icon = hint.icon;
                  return (
                    <div key={city.city} className="flex items-start gap-2 p-2 rounded-lg bg-card/40">
                      <Icon className={`h-4 w-4 mt-0.5 ${hint.color}`} />
                      <div>
                        <p className="text-sm font-medium text-foreground">{city.city}</p>
                        <p className={`text-xs ${hint.color}`}>{hint.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Top Revenue Drivers */}
          <Card className="bg-card/80 border-border hover:border-primary/30 transition-smooth">
            <CardHeader>
              <CardTitle className="text-foreground font-heading">Top Revenue Drivers</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Sport Breakdown */}
              <div className="space-y-3 mb-6">
                <p className="text-sm font-medium text-muted-foreground">By Sport</p>
                {mockData.sportBreakdown.map((sport, idx) => {
                  const percent = (sport.revenue / totalSportRevenue) * 100;
                  return (
                    <div key={sport.sport} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-foreground">{sport.sport}</span>
                        <span className="text-primary font-semibold">₹{sport.revenue.toLocaleString()}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[hsl(16,100%,50%)] to-[hsl(25,100%,50%)] transition-smooth"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Plan Breakdown */}
              <div className="space-y-3 pt-4 border-t border-border">
                <p className="text-sm font-medium text-muted-foreground">By Plan Tier</p>
                {mockData.planBreakdown.map((plan) => (
                  <div key={plan.plan} className="flex items-center justify-between p-3 rounded-lg bg-card/40 hover:bg-card/60 transition-smooth">
                    <div>
                      <p className="text-sm font-medium text-foreground">{plan.plan}</p>
                      <p className="text-xs text-muted-foreground">{plan.count} sessions</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">₹{plan.revenue.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">
                        ₹{Math.round(plan.revenue / plan.count)} avg
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CoachRevenue;
