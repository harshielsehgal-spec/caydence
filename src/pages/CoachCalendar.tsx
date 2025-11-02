import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Clock, Copy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface TimeSlot {
  id?: string;
  weekday: number;
  start_time: string;
  end_time: string;
}

const CoachCalendar = () => {
  const navigate = useNavigate();
  const [coachId, setCoachId] = useState<string | null>(null);
  const [availability, setAvailability] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCoachData();
  }, []);

  const fetchCoachData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: coach, error: coachError } = await supabase
        .from("coaches")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (coachError) throw coachError;
      setCoachId(coach.id);

      const { data: availabilityData, error: availError } = await supabase
        .from("coach_availability")
        .select("*")
        .eq("coach_id", coach.id);

      if (availError) throw availError;
      setAvailability(availabilityData || []);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load availability");
    } finally {
      setLoading(false);
    }
  };

  const addTimeSlot = (weekday: number) => {
    setAvailability([...availability, { weekday, start_time: "09:00", end_time: "10:00" }]);
  };

  const updateTimeSlot = (index: number, field: "start_time" | "end_time", value: string) => {
    const updated = [...availability];
    updated[index][field] = value;
    setAvailability(updated);
  };

  const removeTimeSlot = (index: number) => {
    setAvailability(availability.filter((_, i) => i !== index));
  };

  const copyToAllWeekdays = (sourceDay: number) => {
    const sourceSlots = availability.filter(slot => slot.weekday === sourceDay);
    if (sourceSlots.length === 0) {
      toast.error("No slots to copy from this day");
      return;
    }

    const newAvailability = [...availability.filter(slot => slot.weekday === sourceDay)];
    for (let day = 1; day <= 5; day++) {
      if (day !== sourceDay) {
        sourceSlots.forEach(slot => {
          newAvailability.push({
            weekday: day,
            start_time: slot.start_time,
            end_time: slot.end_time,
          });
        });
      }
    }
    setAvailability(newAvailability);
    toast.success("Copied to all weekdays");
  };

  const handleSave = async () => {
    if (!coachId) return;

    // Validate time slots
    for (const slot of availability) {
      if (slot.start_time >= slot.end_time) {
        toast.error("End time must be after start time");
        return;
      }
    }

    setSaving(true);
    try {
      // Delete existing availability
      await supabase
        .from("coach_availability")
        .delete()
        .eq("coach_id", coachId);

      // Insert new availability
      if (availability.length > 0) {
        const { error } = await supabase
          .from("coach_availability")
          .insert(
            availability.map(slot => ({
              coach_id: coachId,
              weekday: slot.weekday,
              start_time: slot.start_time,
              end_time: slot.end_time,
            }))
          );

        if (error) throw error;
      }

      toast.success("Availability saved successfully");
    } catch (error: any) {
      console.error("Error saving availability:", error);
      toast.error("Failed to save availability");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0D0D0D] via-[#1A1A1A] to-[#0D0D0D] flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D0D0D] via-[#1A1A1A] to-[#0D0D0D] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/coach/home")}
          className="mb-6 text-coolGray hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white font-heading">
              My Availability
            </h1>
            <p className="text-coolGray mt-2">Set your weekly schedule for session bookings</p>
          </div>
          <Button variant="glow" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Availability"}
          </Button>
        </div>

        <div className="space-y-4">
          {WEEKDAYS.map((day, weekdayIndex) => {
            const daySlots = availability.filter(slot => slot.weekday === weekdayIndex);
            return (
              <Card key={weekdayIndex} className="bg-charcoal/80 border-vibrantOrange/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white font-heading">{day}</CardTitle>
                    <div className="flex gap-2">
                      {weekdayIndex >= 1 && weekdayIndex <= 5 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToAllWeekdays(weekdayIndex)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy to Weekdays
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addTimeSlot(weekdayIndex)}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Add Slot
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {daySlots.length === 0 ? (
                    <p className="text-coolGray text-sm">No availability set for this day</p>
                  ) : (
                    <div className="space-y-3">
                      {daySlots.map((slot, slotIndex) => {
                        const actualIndex = availability.findIndex(
                          s => s === slot
                        );
                        return (
                          <div key={slotIndex} className="flex items-center gap-3">
                            <div className="flex items-center gap-2 flex-1">
                              <input
                                type="time"
                                value={slot.start_time}
                                onChange={(e) =>
                                  updateTimeSlot(actualIndex, "start_time", e.target.value)
                                }
                                className="bg-charcoal/60 border border-vibrantOrange/30 rounded px-3 py-2 text-white"
                              />
                              <span className="text-coolGray">to</span>
                              <input
                                type="time"
                                value={slot.end_time}
                                onChange={(e) =>
                                  updateTimeSlot(actualIndex, "end_time", e.target.value)
                                }
                                className="bg-charcoal/60 border border-vibrantOrange/30 rounded px-3 py-2 text-white"
                              />
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeTimeSlot(actualIndex)}
                            >
                              Remove
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-charcoal/40 border border-vibrantOrange/20 rounded-lg">
          <p className="text-coolGray text-sm">
            <span className="text-vibrantOrange font-medium">Timezone:</span> {Intl.DateTimeFormat().resolvedOptions().timeZone}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CoachCalendar;
