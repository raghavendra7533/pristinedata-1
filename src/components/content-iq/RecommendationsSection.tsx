import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

interface CategoryScore {
  title: string;
  score: number;
  icon: string;
}

interface RecommendationsSectionProps {
  categories: CategoryScore[];
}

export const RecommendationsSection = ({ categories }: RecommendationsSectionProps) => {
  // Only show recommendations for categories with score <= 2 (weak)
  const weakCategories = categories.filter(cat => cat.score <= 2);
  if (weakCategories.length === 0) {
    return (
      <Card className="border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-center justify-center">
            <Icon icon="solar:check-circle-bold" className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              All categories are performing well. No critical actions needed.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon icon="solar:danger-triangle-linear" className="w-5 h-5 text-amber-600" />
          Recommended Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          The following categories need attention. Add assets to strengthen these areas:
        </p>

        <div className="space-y-3">
          {weakCategories.map((category) => (
            <div
              key={category.title}
              className="flex items-center gap-3 p-4 rounded-lg border border-amber-500/20 bg-amber-50/30 dark:bg-amber-950/10"
            >
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 shrink-0">
                <Icon icon={category.icon} className="w-5 h-5 text-amber-700 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{category.title}</h4>
                <p className="text-xs text-muted-foreground">
                  Score: {category.score}/5 — Critical gaps identified
                </p>
              </div>
            </div>
          ))}
        </div>

        <Button asChild className="w-full" size="lg">
          <Link to="/personalization">
            <Icon icon="solar:add-circle-linear" className="w-4 h-4 mr-2" />
            Add Assets
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};
