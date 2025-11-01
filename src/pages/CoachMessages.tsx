import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const CoachMessages = () => {
  const navigate = useNavigate();

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

        <h1 className="text-3xl md:text-4xl font-bold text-white font-heading mb-8">
          Messages
        </h1>

        <Card className="bg-charcoal/80 border-vibrantOrange/30">
          <CardHeader>
            <CardTitle className="text-white font-heading">Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-coolGray">
              Messaging feature will be available in Phase 2.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CoachMessages;
