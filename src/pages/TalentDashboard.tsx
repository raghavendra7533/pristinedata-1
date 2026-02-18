import { TrendingUp, Bot, Target, Users, Building2, Upload, Mail, Workflow, Lightbulb, Zap, FileSpreadsheet, ArrowRight, BarChart3, Layers, Radio, UserSearch, Briefcase, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const dashboardTiles = [{
  category: "Candidate Sourcing & Enrichment",
  description: "Discover and enrich the right talent for your open roles",
  icon: UserSearch,
  color: "from-purple-500 to-purple-600",
  actions: [{
    title: "Candidate Search",
    route: "/search",
    icon: Users
  }, {
    title: "Talent Pools",
    route: "/lists",
    icon: FileSpreadsheet
  }, {
    title: "Enrich Candidates",
    route: "/upload",
    icon: Upload
  }]
}, {
  category: "Talent Engagement",
  description: "Generate personalized outreach and campaigns at scale",
  icon: Bot,
  color: "from-violet-500 to-violet-600",
  actions: [{
    title: "Recruitment Campaign Builder",
    route: "/campaigns/create",
    icon: Workflow
  }, {
    title: "Campaign Analytics",
    route: "/campaigns",
    icon: BarChart3
  }, {
    title: "Personalization Assets",
    route: "/personalization",
    icon: Layers
  }]
}, {
  category: "Career Intelligence & Prep",
  description: "Land your dream job with AI-powered preparation and intelligence tools",
  icon: Award,
  color: "from-violet-500 to-violet-600",
  actions: [{
    title: "Interview Prep",
    route: "/interview-prep",
    icon: Briefcase
  }, {
    title: "Role & Company Intelligence",
    route: "/opportunities",
    icon: Lightbulb
  }, {
    title: "Company Signals",
    route: "/signals",
    icon: Radio
  }]
}];

const recentSearches = [{
  query: "Senior Software Engineers in SF",
  results: 3284,
  type: "Candidates"
}, {
  query: "Product Managers at Series B",
  results: 892,
  type: "Candidates"
}, {
  query: "Data Scientists with ML experience",
  results: 1456,
  type: "Candidates"
}];

export default function TalentDashboard() {
  const navigate = useNavigate();
  return <div className="min-h-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero px-6 py-6">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center">
            <h1 className="text-xl font-bold text-white mb-2 leading-tight md:text-5xl">AI for HR and Recruiting</h1>
          </div>
        </div>
      </section>

      {/* Campaign Dashboard */}
      <section className="px-6 pt-8 pb-6 max-w-7xl mx-auto">
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => navigate("/campaigns")}
              className="hover:opacity-80 transition-opacity"
            >
              <h2 className="text-2xl font-bold">Recruitment Campaigns</h2>
            </button>
            <Button 
              variant="outline" 
              onClick={() => navigate("/campaigns")}
              className="gap-2"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>Overview of your active recruitment campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Active Campaigns</p>
                  <p className="text-3xl font-bold">12</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Candidates Reached</p>
                  <p className="text-3xl font-bold">2,847</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Response Rate</p>
                  <p className="text-3xl font-bold">32%</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Interviews Scheduled</p>
                  <p className="text-3xl font-bold">156</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Main Dashboard Tiles */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {dashboardTiles.map(tile => <Card key={tile.category} className="group hover:shadow-primary transition-all duration-300">
              <CardHeader>
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tile.color} flex items-center justify-center mb-4`}>
                  <tile.icon className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl mb-2">{tile.category}</CardTitle>
                <CardDescription className="text-base">{tile.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {tile.actions.map(action => <Button key={action.title} variant="ghost" className="w-full justify-between hover:bg-muted" onClick={() => navigate(action.route)}>
                      <span className="flex items-center gap-2">
                        <action.icon className="h-4 w-4" />
                        {action.title}
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>)}
                </div>
              </CardContent>
            </Card>)}
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Recent Searches</h2>
              <p className="text-muted-foreground">Pick up where you left off</p>
            </div>
            <Button variant="outline" onClick={() => navigate("/search")} className="gap-2">
              New Search
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentSearches.map((search, idx) => <Card key={idx} className="group cursor-pointer hover:shadow-primary transition-all duration-300 hover:-translate-y-1" onClick={() => navigate(`/insights?q=${encodeURIComponent(search.query)}`)}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      {search.type}
                    </Badge>
                    <div className="text-2xl font-bold text-primary">
                      {search.results.toLocaleString()}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{search.query}</CardTitle>
                  <CardDescription>candidates found</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full justify-between group-hover:bg-muted">
                    View Results
                    <TrendingUp className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Solutions for Every Stakeholder */}
      <section className="px-6 py-16 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Solutions for Every Stakeholder</h2>
            <p className="text-lg text-muted-foreground">Whether you're hiring, recruiting, or searching for your next opportunity, Pristine Data AI delivers the intelligence you need.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Candidate Search & Sourcing */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4">
                  <UserSearch className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl mb-2">Candidate Search & Sourcing</CardTitle>
                <CardDescription className="text-base mb-6">
                  Find the right talent for your roles or recruiting services with AI-powered candidate discovery.
                </CardDescription>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2">
                    <Zap className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Advanced candidate search and filtering</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Zap className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Build and manage talent pools</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Zap className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Enrich candidate profiles with verified data</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => navigate("/search")}>
                  Start Searching
                </Button>
              </CardContent>
            </Card>

            {/* Job Alerts & Market Intelligence */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center mb-4">
                  <Radio className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl mb-2">Job Alerts & Market Intelligence</CardTitle>
                <CardDescription className="text-base mb-6">
                  Track hiring signals and company openings to stay ahead of talent market opportunities.
                </CardDescription>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2">
                    <Zap className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Real-time job opening alerts</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Zap className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Company hiring signal detection</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Zap className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Market trends and competitive intelligence</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => navigate("/opportunities")}>
                  Explore Opportunities
                </Button>
              </CardContent>
            </Card>

            {/* For Job Seekers */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center mb-4">
                  <Award className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl mb-2">For Job Seekers</CardTitle>
                <CardDescription className="text-base mb-6">
                  Land your dream job with AI-powered preparation and intelligence tools.
                </CardDescription>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2">
                    <Zap className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">AI-powered interview preparation</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Zap className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Role and company intelligence insights</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Zap className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Real-time company hiring signals</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => navigate("/search")}>
                  Find Your Next Role
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>;
}
