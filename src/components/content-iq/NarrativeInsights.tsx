import { Icon } from "@iconify/react";

interface NarrativeInsight {
  title: string;
  description: string;
}

interface NarrativeInsightsProps {
  headline: string;
  insights: NarrativeInsight[];
}

export const NarrativeInsights = ({ headline, insights }: NarrativeInsightsProps) => {
  return (
    <div className="bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-sky-950/30 dark:to-cyan-950/30 border-l-4 border-sky-500 rounded-xl p-8">
      <h2 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
        <Icon icon="solar:lightbulb-bold" className="w-5 h-5 text-sky-500" />
        Narrative Insights
      </h2>
      
      <div className="bg-card rounded-lg p-4 mb-6 border-l-3 border-sky-500 shadow-sm">
        <p className="text-sm text-foreground font-medium leading-relaxed">
          {headline}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="bg-card rounded-lg p-4 border-l-3 border-cyan-400 shadow-sm"
          >
            <h4 className="text-sm font-semibold text-sky-700 dark:text-sky-300 mb-2">
              {insight.title}
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {insight.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
