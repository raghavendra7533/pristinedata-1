import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Loader2 } from "lucide-react";

interface FilterSummaryCardProps {
  count: number;
  isLoading?: boolean;
}

export default function FilterSummaryCard({ count, isLoading }: FilterSummaryCardProps) {
  return (
    <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground font-medium">
              Current Match Count
            </div>
            <div className="flex items-baseline gap-2">
              {isLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-2xl font-bold">Counting...</span>
                </div>
              ) : (
                <>
                  <span className="text-4xl font-bold text-primary">
                    {count.toLocaleString()}
                  </span>
                  <span className="text-lg text-muted-foreground">accounts</span>
                </>
              )}
            </div>
          </div>
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <TrendingUp className="h-8 w-8 text-primary" />
          </div>
        </div>
        
        {!isLoading && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-foreground">
                {count === 0 ? "No matches found" : count < 50 ? "Very narrow targeting" : count < 500 ? "Focused search" : count < 5000 ? "Moderate reach" : "Broad reach"}
              </span>
              <Badge 
                variant={count === 0 ? "destructive" : count < 100 ? "outline" : "secondary"}
                className="text-sm font-semibold px-3 py-1"
              >
                {count === 0 ? "⚠️ Too Narrow" : count < 100 ? "🎯 Highly Targeted" : count < 1000 ? "✓ Well Balanced" : "📊 Large Audience"}
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
