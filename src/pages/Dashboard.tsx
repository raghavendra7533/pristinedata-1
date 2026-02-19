import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import CampaignMetrics from "@/components/dashboard/CampaignMetrics";

const dashboardTiles = [
  {
    category: "Prospecting",
    description: "Discover and enrich the right leads for your pipeline",
    icon: "solar:target-linear",
    actions: [
      { title: "Lead Search", route: "/search", icon: "solar:magnifer-linear" },
      { title: "Lists", route: "/lists", icon: "solar:documents-linear" },
      { title: "Enrich Leads", route: "/upload", icon: "solar:upload-linear" },
    ],
  },
  {
    category: "Personalization",
    description: "Generate personalized outreach and campaigns at scale",
    icon: "solar:bot-linear",
    actions: [
      { title: "Sequence Builder", route: "/campaigns/create", icon: "solar:widget-linear" },
      { title: "Campaign Analytics", route: "/campaigns", icon: "solar:chart-linear" },
      { title: "Content HQ", route: "/personalization", icon: "solar:layers-linear" },
    ],
  },
  {
    category: "Sales Intelligence",
    description: "Account research, intent signals, and opportunity playbooks",
    icon: "solar:lightbulb-linear",
    actions: [
      { title: "Opportunity Playbook", route: "/opportunities", icon: "solar:bolt-linear" },
      { title: "Account Intelligence", route: "/search", icon: "solar:graph-up-linear" },
      { title: "Buying Signals", route: "/signals", icon: "solar:radar-linear" },
    ],
  },
];

const recentSearches = [
  { query: "RevOps in fintech", results: 1284, type: "Mixed" },
  { query: "Healthcare SaaS CMOs", results: 432, type: "Contacts" },
  { query: "Snowflake users US", results: 2156, type: "Accounts" },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full">
      {/* Campaigns */}
      <section className="px-6 pt-8 pb-4 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Campaigns</span>
          <button
            onClick={() => navigate("/campaigns")}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            View all
            <Icon icon="solar:arrow-right-linear" className="h-3.5 w-3.5" />
          </button>
        </div>
        <CampaignMetrics />
      </section>

      {/* Tiles */}
      <section className="px-6 py-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {dashboardTiles.map((tile) => (
            <Card
              key={tile.category}
              className="border-border/50 bg-card/40 hover:border-border transition-colors duration-200"
            >
              <CardHeader className="pb-2 pt-5 px-5">
                <div className="flex items-center gap-2.5 mb-3">
                  <Icon icon={tile.icon} className="h-5 w-5 text-primary" />
                  <span className="text-sm font-semibold">{tile.category}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{tile.description}</p>
              </CardHeader>
              <CardContent className="px-3 pb-4">
                <div className="space-y-0.5">
                  {tile.actions.map((action) => (
                    <button
                      key={action.title}
                      onClick={() => navigate(action.route)}
                      className="w-full flex items-center justify-between px-2 py-2 rounded-md hover:bg-accent text-xs text-muted-foreground hover:text-foreground transition-colors group"
                    >
                      <span className="flex items-center gap-2">
                        <Icon icon={action.icon} className="h-3.5 w-3.5" />
                        {action.title}
                      </span>
                      <Icon icon="solar:arrow-right-linear" className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Searches */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Recent Searches</span>
            <button
              onClick={() => navigate("/search")}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              New search
              <Icon icon="solar:add-circle-linear" className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentSearches.map((search, idx) => (
              <button
                key={idx}
                onClick={() => navigate(`/insights?q=${encodeURIComponent(search.query)}`)}
                className="text-left border border-border/50 rounded-lg p-4 hover:border-border hover:bg-card/40 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">{search.type}</span>
                  <span className="text-lg font-bold text-primary tabular-nums">{search.results.toLocaleString()}</span>
                </div>
                <p className="text-sm font-medium mb-1">{search.query}</p>
                <span className="text-xs text-muted-foreground">results found</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
