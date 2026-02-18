import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PlayCircle, Settings } from "lucide-react";
import { HealthScoreCard } from "@/components/content-iq/HealthScoreCard";
import { CategoryCard } from "@/components/content-iq/CategoryCard";
import { GapsSection } from "@/components/content-iq/GapsSection";
import { ScoreTable } from "@/components/content-iq/ScoreTable";
import { RecommendationsSection } from "@/components/content-iq/RecommendationsSection";
import { EvidenceDrawer } from "@/components/content-iq/EvidenceDrawer";
import { ScoringRulesDialog } from "@/components/content-iq/ScoringRulesDialog";
import { NarrativeInsights } from "@/components/content-iq/NarrativeInsights";
import { ContentIQAssistant } from "@/components/content-iq/ContentIQAssistant";
import { BarChart3, FileCheck, Target, FileText, BookOpen } from "lucide-react";
import { toast } from "sonner";

const ContentIQ = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastAssessment, setLastAssessment] = useState(new Date().toISOString());
  const [showScoringRules, setShowScoringRules] = useState(false);

  const handleRunAssessment = () => {
    setIsLoading(true);
    toast.info("Running content health assessment...");
    setTimeout(() => {
      setIsLoading(false);
      setLastAssessment(new Date().toISOString());
      toast.success("Assessment complete!");
    }, 2000);
  };

  const categories = [
    {
      title: "Quantity",
      score: 3,
      maxScore: 5,
      note: "Good volume, but need more case studies",
      icon: BarChart3,
      tooltip: "Measures the breadth of your content library",
    },
    {
      title: "Quality",
      score: 3,
      maxScore: 5,
      note: "Content is clear, needs deeper proof points",
      icon: FileCheck,
      tooltip: "Evaluates content clarity and depth",
    },
    {
      title: "Competitive Intelligence",
      score: 1,
      maxScore: 5,
      note: "Critical gap: missing competitor comparisons",
      icon: Target,
      tooltip: "Assesses competitive positioning materials",
    },
    {
      title: "Pitch Materials",
      score: 3,
      maxScore: 5,
      note: "Decks are strong, add more use-case examples",
      icon: FileText,
      tooltip: "Reviews sales presentation assets",
    },
    {
      title: "Playbook Support",
      score: 2,
      maxScore: 5,
      note: "Limited discovery questions and objection docs",
      icon: BookOpen,
      tooltip: "Checks enablement and process documentation",
    },
  ];

  const gaps = [
    "Case studies",
    "Objection handling FAQ",
    "Competitor grid",
    "Discovery question bank",
    "ROI calculator template",
  ];

  const scoreTableData = [
    { category: "Quantity", score: "3/5", notes: "Good volume, but need more case studies" },
    { category: "Quality", score: "3/5", notes: "Content is clear, needs deeper proof points" },
    { category: "Competitive Intelligence", score: "1/5", notes: "Critical gap: missing competitor comparisons" },
    { category: "Pitch Materials", score: "3/5", notes: "Decks are strong, add more use-case examples" },
    { category: "Playbook Support", score: "2/5", notes: "Limited discovery questions and objection docs" },
  ];

  const evidenceFiles = [
    "Company Overview Deck.pptx",
    "ICP Definition.docx",
    "Product Features Guide.pdf",
    "Sales Kickoff Transcript.txt",
    "Competitive Analysis.docx",
    "Customer Success Stories.pdf",
  ];

  const narrativeInsights = {
    headline: "Pear Commerce has a solid foundation of sales and marketing materials, yet gaps in competitive intelligence and playbook assets could hinder sales performance.",
    insights: [
      {
        title: "Sales decks: strong foundation, needs persona targeting",
        description: "The sales decks articulate Pear Commerce's value proposition effectively but lack tailored content for specific buyer personas. Developing these targeted materials would enhance sales conversations.",
      },
      {
        title: "Case studies: valuable insights, but limited diversity",
        description: "Current case studies provide strong evidence of success but focus on a narrow set of industries. Expanding to include a wider range of scenarios would help sellers connect with diverse prospects.",
      },
      {
        title: "Competitive intelligence: major opportunity for improvement",
        description: "There is a critical lack of competitor analysis documents available, which limits sales teams' ability to effectively position Pear Commerce. Creating competitor grids and battlecards would be beneficial.",
      },
      {
        title: "Playbook and training: underpowered for scaling the team",
        description: "Training materials for objection handling and discovery are lacking, which could lead to inconsistent sales practices. Developing comprehensive guides would improve onboarding and overall sales effectiveness.",
      },
      {
        title: "Product and feature guides: informative but text-heavy",
        description: "Feature guides contain useful information but often rely on dense text. Incorporating visuals and examples would make them more user-friendly and easier to reference in sales conversations.",
      },
      {
        title: "Next 90 days: focus on critical initiatives",
        description: "In the coming months, prioritize creating diverse case studies, competitor comparison documents, and enhancing training resources to equip the sales team for success.",
      },
    ],
  };

  const formattedDate = new Date(lastAssessment).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-primary via-primary-light to-secondary px-6 py-8 mb-8 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Content IQ — Content Health Report
              </h1>
              <p className="text-white/80 text-sm">
                Last assessed: {formattedDate}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="secondary"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                onClick={() => setShowScoringRules(true)}
              >
                <Settings className="w-4 h-4 mr-2" />
                Scoring Rules
              </Button>
              <Button
                className="bg-white text-primary hover:bg-white/90"
                onClick={handleRunAssessment}
                disabled={isLoading}
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                Run Assessment
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12 space-y-8">
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {/* Overall Health Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <HealthScoreCard score={3.2} maxScore={5} />
              </div>
              <div className="lg:col-span-2">
                <GapsSection gaps={gaps} />
              </div>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {categories.map((category) => (
                <CategoryCard key={category.title} {...category} />
              ))}
            </div>

            {/* Score Table */}
            <ScoreTable scores={scoreTableData} />

            {/* Narrative Insights */}
            <NarrativeInsights 
              headline={narrativeInsights.headline}
              insights={narrativeInsights.insights}
            />

            {/* Recommendations */}
            <RecommendationsSection 
              categories={categories.map(cat => ({
                title: cat.title,
                score: cat.score,
                icon: cat.icon
              }))}
            />

            {/* Evidence Drawer */}
            <EvidenceDrawer files={evidenceFiles} />
          </>
        )}
      </div>

      <ScoringRulesDialog open={showScoringRules} onOpenChange={setShowScoringRules} />
      
      {/* Content IQ Assistant FAB */}
      <ContentIQAssistant />
    </div>
  );
};

const LoadingSkeleton = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="h-64 rounded-2xl" />
        <div className="lg:col-span-2">
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-96 rounded-2xl" />
    </div>
  );
};

export default ContentIQ;
