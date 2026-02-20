import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@iconify/react";

interface GapsSectionProps {
  gaps: string[];
}

export const GapsSection = ({ gaps }: GapsSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon icon="solar:danger-circle-linear" className="w-5 h-5 text-amber-500" />
          Gaps & Coverage
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">
          Missing content that would strengthen your sales process:
        </p>
        <div className="flex flex-wrap gap-2">
          {gaps.map((gap, index) => (
            <Badge key={index} variant="outline" className="border-amber-500/50 text-amber-700 dark:text-amber-400">
              {gap}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
