import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@iconify/react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CategoryCardProps {
  title: string;
  score: number;
  maxScore: number;
  note: string;
  icon: string;
  tooltip?: string;
}

export const CategoryCard = ({ title, score, maxScore, note, icon, tooltip }: CategoryCardProps) => {
  const segments = Array.from({ length: maxScore }, (_, i) => i + 1);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon icon={icon} className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{title}</h3>
                </div>
                <span className="text-2xl font-bold text-primary">
                  {score}<span className="text-lg text-muted-foreground">/{maxScore}</span>
                </span>
              </div>
              
              <div className="flex gap-1">
                {segments.map((seg) => (
                  <div
                    key={seg}
                    className={`h-2 flex-1 rounded-full transition-colors ${
                      seg <= score ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
              
              <p className="text-sm text-muted-foreground">{note}</p>
            </CardContent>
          </Card>
        </TooltipTrigger>
        {tooltip && (
          <TooltipContent>
            <p className="max-w-xs">{tooltip}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};
