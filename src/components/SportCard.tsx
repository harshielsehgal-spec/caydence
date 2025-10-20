import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface SportCardProps {
  name: string;
  icon: LucideIcon;
  description: string;
  gradient: string;
  onClick: () => void;
}

const SportCard = ({ name, icon: Icon, description, gradient, onClick }: SportCardProps) => {
  return (
    <Card 
      className="cursor-pointer transition-smooth hover:shadow-card-hover group"
      onClick={onClick}
    >
      <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center group-hover:scale-110 transition-smooth shadow-card`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        <h3 className="font-semibold text-lg font-poppins">{name}</h3>
        <p className="text-sm text-muted-foreground font-montserrat">{description}</p>
      </CardContent>
    </Card>
  );
};

export default SportCard;
