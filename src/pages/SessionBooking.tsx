import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar as CalendarIcon, Star, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const SessionBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const coach = location.state?.coach;

  const [trainingMode, setTrainingMode] = useState<string>("");
  const [sessionType, setSessionType] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!coach) {
    navigate("/coach-swipe");
    return null;
  }

  const handleConfirmBooking = () => {
    if (!trainingMode || !sessionType || !selectedDate || !selectedTime) {
      toast.error("Please fill all fields to continue");
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirmPayment = () => {
    toast.success("Session booked successfully! 🎉");
    setShowConfirmation(false);
    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
  };

  const timeSlots = [
    "06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM",
    "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
    "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal via-charcoal/95 to-crimson/20">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-charcoal/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/coach-swipe")}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold font-poppins text-white">Book Session</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
        {/* Coach Info Card */}
        <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <div className="flex items-start gap-4">
            <img
              src={coach.image}
              alt={coach.name}
              className="w-20 h-20 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold font-poppins">{coach.name}</h2>
                  <p className="text-sm text-muted-foreground font-montserrat">
                    {coach.specialization}
                  </p>
                </div>
                <Badge className="bg-crimson text-white">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  AI Verified
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{coach.rating}</span>
                <span className="text-muted-foreground">• {coach.city}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 space-y-6">
          <h3 className="text-lg font-semibold font-poppins">Session Details</h3>

          {/* Training Mode */}
          <div className="space-y-2">
            <label className="text-sm font-medium font-montserrat">Training Mode</label>
            <Select value={trainingMode} onValueChange={setTrainingMode}>
              <SelectTrigger className="bg-charcoal/50 border-white/10">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Session Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium font-montserrat">Session Type</label>
            <Select value={sessionType} onValueChange={setSessionType}>
              <SelectTrigger className="bg-charcoal/50 border-white/10">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="evaluation">AI Evaluation (First Session)</SelectItem>
                <SelectItem value="regular">Regular Training</SelectItem>
                <SelectItem value="intensive">Intensive Workshop</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Picker */}
          <div className="space-y-2">
            <label className="text-sm font-medium font-montserrat">Preferred Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-charcoal/50 border-white/10",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-card border-white/10" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Picker */}
          <div className="space-y-2">
            <label className="text-sm font-medium font-montserrat">Preferred Time</label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger className="bg-charcoal/50 border-white/10">
                <SelectValue placeholder="Select time slot" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Display */}
          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-montserrat">Session Fee</span>
              <span className="text-2xl font-bold text-crimson font-poppins">
                ₹{coach.price}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleConfirmBooking}
            className="w-full bg-crimson hover:bg-crimson/90 h-12 text-base font-semibold"
          >
            Confirm & Pay
          </Button>
          <Button
            onClick={() => navigate("/coach-swipe")}
            variant="outline"
            className="w-full h-12 text-base"
          >
            Back to Coach List
          </Button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-poppins text-center">
              Confirm Booking
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="text-center space-y-2">
              <div className="text-4xl mb-4">🎯</div>
              <p className="text-muted-foreground font-montserrat">
                You're about to book a session with <span className="font-semibold text-foreground">{coach.name}</span>
              </p>
            </div>

            <div className="bg-charcoal/30 rounded-lg p-4 space-y-2 text-sm font-montserrat">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mode:</span>
                <span className="font-semibold capitalize">{trainingMode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <span className="font-semibold capitalize">{sessionType?.replace("-", " ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-semibold">
                  {selectedDate && format(selectedDate, "PPP")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time:</span>
                <span className="font-semibold">{selectedTime}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/10">
                <span className="text-muted-foreground">Total:</span>
                <span className="text-xl font-bold text-crimson">₹{coach.price}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowConfirmation(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmPayment}
                className="flex-1 bg-crimson hover:bg-crimson/90"
              >
                Confirm Payment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SessionBooking;
