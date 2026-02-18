import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Lightbulb, 
  MessageCircle, 
  HelpCircle, 
  ChevronRight,
  Mail,
  Phone,
  Building2,
  MapPin,
  Sparkles,
  Target,
  TrendingUp,
  Users
} from "lucide-react";

const salesOpeners = {
  icebreakers: [
    "I noticed Snowflake recently expanded into the APAC market - how has that shift impacted your team's priorities?",
    "Congratulations on the recent Series D! With that growth, I imagine scaling operations has become a key focus.",
    "I saw your talk at Data Summit last month - your insights on data governance were spot on."
  ],
  discoveryQuestions: [
    "What's your biggest challenge when it comes to aligning sales and marketing data?",
    "How are you currently measuring the ROI of your data infrastructure investments?",
    "If you could wave a magic wand, what would you change about your current tech stack?"
  ]
};

const contactInfo = {
  name: "Sarah Chen",
  title: "VP of Revenue Operations",
  company: "Snowflake",
  email: "sarah.chen@snowflake.com",
  phone: "+1 (415) 555-0123",
  location: "San Francisco, CA",
  avatar: ""
};

// Option 1: Hero Card Design
function HeroCardDesign() {
  const [activeOpener, setActiveOpener] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Contact Header */}
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={contactInfo.avatar} />
          <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">SC</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-foreground">{contactInfo.name}</h2>
          <p className="text-muted-foreground">{contactInfo.title} at {contactInfo.company}</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Mail className="h-4 w-4" /> {contactInfo.email}</span>
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {contactInfo.location}</span>
          </div>
        </div>
      </div>

      {/* HERO CARD - Sales Openers */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            Sales Openers
            <Badge variant="secondary" className="ml-auto">AI-Generated</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Icebreakers */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MessageCircle className="h-4 w-4 text-emerald-500" />
              <span className="text-sm font-medium text-foreground">Icebreakers</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {salesOpeners.icebreakers.map((opener, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveOpener(activeOpener === opener ? null : opener)}
                  className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${
                    activeOpener === opener 
                      ? "bg-primary text-primary-foreground shadow-md" 
                      : "bg-muted/50 hover:bg-muted text-foreground"
                  }`}
                >
                  <span className="line-clamp-1">{opener.slice(0, 60)}...</span>
                </button>
              ))}
            </div>
          </div>

          {/* Discovery Questions */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-foreground">Discovery Questions</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {salesOpeners.discoveryQuestions.map((opener, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveOpener(activeOpener === opener ? null : opener)}
                  className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${
                    activeOpener === opener 
                      ? "bg-primary text-primary-foreground shadow-md" 
                      : "bg-muted/50 hover:bg-muted text-foreground"
                  }`}
                >
                  <span className="line-clamp-1">{opener.slice(0, 60)}...</span>
                </button>
              ))}
            </div>
          </div>

          {/* Expanded Opener */}
          {activeOpener && (
            <div className="mt-4 p-4 bg-background rounded-lg border border-border animate-in fade-in slide-in-from-top-2">
              <p className="text-sm text-foreground leading-relaxed">{activeOpener}</p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="default">
                  Copy to Clipboard
                </Button>
                <Button size="sm" variant="outline">
                  Use in Email
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Placeholder for other contact content */}
      <Card className="opacity-50">
        <CardHeader>
          <CardTitle className="text-base">Strategic Objectives & Challenges</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Other contact intelligence would appear here...</p>
        </CardContent>
      </Card>
    </div>
  );
}

// Option 2: Sticky Side Panel Design
function StickySidePanelDesign() {
  const [activeOpener, setActiveOpener] = useState<string | null>(null);

  return (
    <div className="flex gap-6">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Contact Header */}
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={contactInfo.avatar} />
            <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">SC</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground">{contactInfo.name}</h2>
            <p className="text-muted-foreground">{contactInfo.title} at {contactInfo.company}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Mail className="h-4 w-4" /> {contactInfo.email}</span>
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {contactInfo.location}</span>
            </div>
          </div>
        </div>

        {/* Placeholder content to show scrolling behavior */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Strategic Objectives
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm">Scale data infrastructure to support 3x customer growth</p>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm">Improve cross-functional data accessibility</p>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm">Reduce time-to-insight for revenue teams</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-amber-500" />
              Pain Points & Challenges
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm">Data silos between sales and marketing systems</p>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm">Manual reporting processes consuming 15+ hours/week</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              Talking Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Additional talking points and context...</p>
          </CardContent>
        </Card>
      </div>

      {/* STICKY SIDE PANEL */}
      <div className="w-72 shrink-0">
        <div className="sticky top-4">
          <Card className="border-2 border-primary/20 bg-gradient-to-b from-primary/5 to-background shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="h-4 w-4 text-primary" />
                Sales Openers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-3">
                <div className="space-y-4">
                  {/* Icebreakers */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MessageCircle className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Icebreakers</span>
                    </div>
                    <div className="space-y-2">
                      {salesOpeners.icebreakers.map((opener, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveOpener(activeOpener === opener ? null : opener)}
                          className={`w-full text-left p-3 rounded-lg text-xs transition-all ${
                            activeOpener === opener 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-muted/50 hover:bg-muted text-foreground"
                          }`}
                        >
                          <span className="line-clamp-2">{opener}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Discovery Questions */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <HelpCircle className="h-3.5 w-3.5 text-blue-500" />
                      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Discovery</span>
                    </div>
                    <div className="space-y-2">
                      {salesOpeners.discoveryQuestions.map((opener, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveOpener(activeOpener === opener ? null : opener)}
                          className={`w-full text-left p-3 rounded-lg text-xs transition-all ${
                            activeOpener === opener 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-muted/50 hover:bg-muted text-foreground"
                          }`}
                        >
                          <span className="line-clamp-2">{opener}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>

              {activeOpener && (
                <div className="mt-3 pt-3 border-t border-border">
                  <Button size="sm" className="w-full text-xs">
                    Copy Selected
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function SalesOpenersMockup() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Sales Openers - Design Options</h1>
          <p className="text-muted-foreground">Compare two layout approaches for displaying sales openers on contact profiles</p>
        </div>

        <Tabs defaultValue="hero" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="hero" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Hero Card
            </TabsTrigger>
            <TabsTrigger value="side" className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4" />
              Sticky Side Panel
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hero" className="mt-6">
            <div className="mb-4 p-4 bg-muted/30 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground">
                <strong>Hero Card:</strong> Prominent placement directly below contact header. Openers displayed as clickable chips that expand on selection. Best for maximum visibility and "front and center" importance.
              </p>
            </div>
            <div className="bg-card rounded-xl border border-border p-6">
              <HeroCardDesign />
            </div>
          </TabsContent>

          <TabsContent value="side" className="mt-6">
            <div className="mb-4 p-4 bg-muted/30 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground">
                <strong>Sticky Side Panel:</strong> Persistent narrow panel on the right that stays visible while scrolling. Always accessible with minimal footprint. Best when users spend time exploring contact details.
              </p>
            </div>
            <div className="bg-card rounded-xl border border-border p-6">
              <StickySidePanelDesign />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
