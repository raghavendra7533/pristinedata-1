import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface HealthScoreCardProps {
  score: number;
  maxScore: number;
}

export const HealthScoreCard = ({ score, maxScore }: HealthScoreCardProps) => {
  const status = score >= 4 ? "Excellent" : score >= 2.5 ? "Good" : "Needs Improvement";
  const statusColor = score >= 4 ? "bg-emerald-500" : score >= 2.5 ? "bg-amber-500" : "bg-rose-500";
  const caption = score >= 4 
    ? "Your content library is comprehensive and sales-ready" 
    : score >= 2.5 
    ? "Solid foundation with room to strengthen key areas" 
    : "Critical content gaps to address for sales effectiveness";

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="text-6xl font-bold text-primary">
            {score.toFixed(1)}
            <span className="text-3xl text-muted-foreground">/{maxScore}</span>
          </div>
          <Badge className={`${statusColor} text-white px-4 py-1`}>
            {status}
          </Badge>
          <p className="text-sm text-muted-foreground max-w-xs">
            {caption}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
