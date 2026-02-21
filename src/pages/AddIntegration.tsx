import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { ConnectIntegrationDialog } from "@/components/integrations/ConnectIntegrationDialog";
import { ManageIntegrationSheet } from "@/components/integrations/ManageIntegrationSheet";

const availableIntegrations = [
  { id: "sf", name: "Salesforce", category: "CRM", description: "Sync accounts, contacts, leads, and opportunities", isConnected: true, icon: "logos:salesforce", popular: true },
  { id: "hubspot", name: "HubSpot", category: "CRM", description: "Connect companies, contacts, and deals", isConnected: true, icon: "logos:hubspot", popular: true },
  { id: "zoho", name: "Zoho CRM", category: "CRM", description: "Integrate accounts, contacts, leads, and deals", isConnected: false, icon: "logos:zoho", popular: false },
  { id: "pipedrive", name: "Pipedrive", category: "CRM", description: "Manage deals and sales pipeline", isConnected: false, icon: "logos:pipedrive", popular: false },
  { id: "instantly", name: "Instantly", category: "Email", description: "Automate cold email outreach campaigns", isConnected: true, icon: "solar:letter-bold", popular: true },
  { id: "smartlead", name: "SmartLead", category: "Email", description: "Scale cold email with unlimited sending accounts", isConnected: false, icon: "solar:mailbox-bold", popular: false },
  { id: "outreach", name: "Outreach", category: "Email", description: "Sales engagement and automation platform", isConnected: false, icon: "solar:forward-bold", popular: true },
  { id: "apollo", name: "Apollo.io", category: "Email", description: "Sales intelligence and engagement", isConnected: false, icon: "solar:rocket-bold", popular: false },
  { id: "fathom", name: "Fathom", category: "Meeting Notes", description: "Auto-import meeting recordings and notes", isConnected: false, icon: "solar:video-frame-bold", popular: true },
  { id: "tactiq", name: "Tactiq", category: "Meeting Notes", description: "Capture meeting transcripts automatically", isConnected: false, icon: "solar:microphone-3-bold", popular: false },
  { id: "gong", name: "Gong", category: "Meeting Notes", description: "Revenue intelligence and call recording", isConnected: false, icon: "solar:microphone-bold", popular: true },
  { id: "chorus", name: "Chorus", category: "Meeting Notes", description: "Conversation intelligence platform", isConnected: false, icon: "solar:music-notes-bold", popular: false },
  { id: "slack", name: "Slack", category: "Communication", description: "Real-time notifications and alerts", isConnected: false, icon: "logos:slack-icon", popular: true },
  { id: "teams", name: "Microsoft Teams", category: "Communication", description: "Team collaboration and messaging", isConnected: false, icon: "logos:microsoft-teams", popular: false },
  { id: "zapier", name: "Zapier", category: "Automation", description: "Connect 5000+ apps with workflows", isConnected: false, icon: "logos:zapier-icon", popular: true },
  { id: "make", name: "Make", category: "Automation", description: "Visual automation platform", isConnected: false, icon: "solar:widget-5-bold", popular: false }
];

const categoryColors = {
  CRM: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  Email: "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20",
  "Meeting Notes": "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  Communication: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  Automation: "bg-primary/10 text-primary border-primary/20"
};

const categoryIcons = {
  CRM: "solar:user-id-bold",
  Email: "solar:letter-bold",
  "Meeting Notes": "solar:video-frame-bold",
  Communication: "solar:chat-round-dots-bold",
  Automation: "solar:atom-bold"
};

export default function AddIntegration() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [manageSheetOpen, setManageSheetOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<any>(null);

  const categories = ["CRM", "Email", "Meeting Notes", "Communication", "Automation"];

  const handleConnect = (integration: any) => {
    setSelectedIntegration(integration);
    setConnectDialogOpen(true);
  };

  const handleManage = (integration: any) => {
    setSelectedIntegration(integration);
    setManageSheetOpen(true);
  };

  const filteredIntegrations = availableIntegrations.filter(int => {
    const matchesSearch = int.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      int.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      int.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab = activeTab === "all" ||
      (activeTab === "popular" && int.popular) ||
      int.category === activeTab;

    return matchesSearch && matchesTab;
  });

  const crmCount = availableIntegrations.filter(i => i.category === "CRM").length;
  const emailCount = availableIntegrations.filter(i => i.category === "Email").length;
  const meetingCount = availableIntegrations.filter(i => i.category === "Meeting Notes").length;
  const connectedCount = availableIntegrations.filter(i => i.isConnected).length;

  return (
    <div className="min-h-full bg-background">
      {/* Header Section */}
      <div className="border-b border-border bg-card px-6 py-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/integrations")}
                className="h-10 w-10"
              >
                <Icon icon="solar:arrow-left-linear" className="h-5 w-5" />
              </Button>
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center">
                <Icon icon="solar:widget-add-bold" className="h-6 w-6 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Integration Catalog</h1>
                <p className="text-sm text-muted-foreground">
                  Browse and connect apps to enhance your workflow
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {availableIntegrations.length} Integrations
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Icon icon="solar:user-id-linear" className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{crmCount}</p>
                  <p className="text-xs text-muted-foreground">CRM Platforms</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <Icon icon="solar:letter-linear" className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{emailCount}</p>
                  <p className="text-xs text-muted-foreground">Email Tools</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Icon icon="solar:video-frame-linear" className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{meetingCount}</p>
                  <p className="text-xs text-muted-foreground">Meeting Apps</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon icon="solar:check-circle-linear" className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{connectedCount}</p>
                  <p className="text-xs text-muted-foreground">Connected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Icon icon="solar:magnifer-linear" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search integrations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="all" className="gap-2">
              <Icon icon="solar:widget-5-linear" className="h-4 w-4" />
              All ({availableIntegrations.length})
            </TabsTrigger>
            <TabsTrigger value="popular" className="gap-2">
              <Icon icon="solar:star-linear" className="h-4 w-4" />
              Popular
            </TabsTrigger>
            {categories.map(cat => (
              <TabsTrigger key={cat} value={cat} className="gap-2">
                <Icon icon={categoryIcons[cat as keyof typeof categoryIcons]} className="h-4 w-4" />
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Integration Grid */}
          <TabsContent value={activeTab} className="mt-0">
            {filteredIntegrations.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                    <Icon icon="solar:magnifer-linear" className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No integrations found</h3>
                  <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
                    Try adjusting your search or browse a different category
                  </p>
                  <Button variant="outline" onClick={() => { setSearchQuery(""); setActiveTab("all"); }}>
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredIntegrations.map((integration) => (
                  <Card
                    key={integration.id}
                    className={cn(
                      "group hover:border-border/80 hover:shadow-sm transition-all",
                      integration.isConnected && "border-emerald-500/30 bg-emerald-500/5"
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                          <Icon icon={integration.icon} className="h-6 w-6" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-semibold text-sm">{integration.name}</h3>
                            {integration.popular && (
                              <Badge variant="secondary" className="text-[9px] bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20">
                                Popular
                              </Badge>
                            )}
                            {integration.isConnected && (
                              <Badge variant="secondary" className="text-[9px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20">
                                Connected
                              </Badge>
                            )}
                          </div>
                          <Badge
                            variant="outline"
                            className={cn("text-[10px] uppercase font-medium mb-2", categoryColors[integration.category as keyof typeof categoryColors])}
                          >
                            {integration.category}
                          </Badge>
                          <p className="text-xs text-muted-foreground line-clamp-2">{integration.description}</p>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="mt-4 pt-3 border-t border-border">
                        {integration.isConnected ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-xs"
                            onClick={() => handleManage(integration)}
                          >
                            <Icon icon="solar:settings-linear" className="h-3.5 w-3.5 mr-1.5" />
                            Manage Connection
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className="w-full text-xs"
                            onClick={() => handleConnect(integration)}
                          >
                            <Icon icon="solar:link-circle-linear" className="h-3.5 w-3.5 mr-1.5" />
                            Connect
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Request Integration CTA */}
        <Card className="mt-8">
          <CardContent className="p-6 text-center">
            <Icon icon="solar:chat-round-dots-bold" className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold mb-1">Don't see what you need?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Request a new integration and we'll prioritize it based on demand
            </p>
            <Button variant="outline">
              <Icon icon="solar:add-circle-linear" className="h-4 w-4 mr-2" />
              Request Integration
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <ConnectIntegrationDialog
        open={connectDialogOpen}
        onOpenChange={setConnectDialogOpen}
        integration={selectedIntegration}
      />

      <ManageIntegrationSheet
        open={manageSheetOpen}
        onOpenChange={setManageSheetOpen}
        integration={selectedIntegration}
      />
    </div>
  );
}
