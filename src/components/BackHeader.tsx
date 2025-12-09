import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BackHeaderProps {
  title: string;
  onBack?: () => void;
  rightContent?: React.ReactNode;
}

const BackHeader = ({ title, onBack, rightContent }: BackHeaderProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="sticky top-0 z-20 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="hover:bg-accent"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold font-poppins">{title}</h1>
        </div>
        {rightContent && <div className="flex items-center gap-3">{rightContent}</div>}
      </div>
    </div>
  );
};

export default BackHeader;
