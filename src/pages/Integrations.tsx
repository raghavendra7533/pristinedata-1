import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { ManageIntegrationSheet } from "@/components/integrations/ManageIntegrationSheet";

const activeIntegrations = [
  {
    id: "sf",
    name: "Salesforce",
    category: "CRM",
    status: "Connected" as const,
    lastSync: "Today 2:14 PM",
    env: "Production",
    icon: "logos:salesforce",
    description: "Sync contacts, accounts, and opportunities"
  },
  {
    id: "hubspot",
    name: "HubSpot",
    category: "CRM",
    status: "Connected" as const,
    lastSync: "Today 9:02 AM",
    env: "Production",
    icon: "logos:hubspot",
    description: "Marketing automation and CRM sync"
  },
  {
    id: "instantly",
    name: "Instantly",
    category: "Email",
    status: "Needs attention" as const,
    lastSync: "Yesterday 6:41 PM",
    env: "Production",
    icon: "solar:letter-bold",
    description: "Cold email outreach automation"
  },
  {
    id: "outreach",
    name: "Outreach",
    category: "Email",
    status: "Connected" as const,
    lastSync: "Today 11:30 AM",
    env: "Production",
    icon: "solar:mailbox-bold",
    description: "Sales engagement platform"
  },
  {
    id: "slack",
    name: "Slack",
    category: "Communication",
    status: "Connected" as const,
    lastSync: "Today 3:45 PM",
    env: "Production",
    icon: "logos:slack-icon",
    description: "Real-time notifications and alerts"
  }
];

const availableIntegrations = [
  { id: "zapier", name: "Zapier", category: "Automation", icon: "logos:zapier-icon", description: "Connect 5000+ apps" },
  { id: "gong", name: "Gong", category: "Sales Intel", icon: "solar:microphone-bold", description: "Revenue intelligence platform" },
  { id: "chorus", name: "Chorus", category: "Sales Intel", icon: "solar:music-notes-bold", description: "Conversation intelligence" },
  { id: "zoom", name: "Zoom", category: "Meetings", icon: "logos:zoom-icon", description: "Video conferencing sync" }
];

const statusColors = {
  Connected: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  "Needs attention": "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  Disconnected: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
};

const categoryColors = {
  CRM: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  Email: "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20",
  Communication: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  Automation: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  "Sales Intel": "bg-primary/10 text-primary border-primary/20",
  Meetings: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20"
};

export default function Integrations() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [manageSheetOpen, setManageSheetOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<any>(null);

  const handleManage = (integration: any) => {
    setSelectedIntegration(integration);
    setManageSheetOpen(true);
  };

  const connectedCount = activeIntegrations.filter(i => i.status === "Connected").length;
  const needsAttentionCount = activeIntegrations.filter(i => i.status === "Needs attention").length;

  const filteredIntegrations = activeIntegrations.filter(int =>
    int.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    int.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAvailable = availableIntegrations.filter(int =>
    int.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    int.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-full bg-background">
      {/* Header Section */}
      <div className="border-b border-border bg-card px-6 py-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon icon="solar:link-circle-bold" className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Integrations</h1>
                <p className="text-sm text-muted-foreground">
                  Connect your CRM, email tools, and sales platforms
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Icon icon="solar:refresh-linear" className="h-4 w-4 mr-2" />
                Sync All
              </Button>
              <Button size="sm" onClick={() => navigate("/integrations/add")}>
                <Icon icon="solar:add-circle-linear" className="h-4 w-4 mr-2" />
                Add Integration
              </Button>
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
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon icon="solar:link-circle-linear" className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeIntegrations.length}</p>
                  <p className="text-xs text-muted-foreground">Total Integrations</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Icon icon="solar:check-circle-linear" className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{connectedCount}</p>
                  <p className="text-xs text-muted-foreground">Connected</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Icon icon="solar:danger-triangle-linear" className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{needsAttentionCount}</p>
                  <p className="text-xs text-muted-foreground">Needs Attention</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <Icon icon="solar:widget-add-linear" className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{availableIntegrations.length}+</p>
                  <p className="text-xs text-muted-foreground">Available</p>
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
              <Button variant="outline" size="default">
                <Icon icon="solar:filter-linear" className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="active" className="gap-2">
              <Icon icon="solar:check-circle-linear" className="h-4 w-4" />
              Active ({activeIntegrations.length})
            </TabsTrigger>
            <TabsTrigger value="available" className="gap-2">
              <Icon icon="solar:widget-add-linear" className="h-4 w-4" />
              Available ({availableIntegrations.length})
            </TabsTrigger>
          </TabsList>

          {/* Active Integrations Tab */}
          <TabsContent value="active" className="space-y-3 mt-0">
            {filteredIntegrations.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                    <Icon icon="solar:link-circle-linear" className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No integrations found</h3>
                  <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
                    {searchQuery ? "Try adjusting your search" : "Connect your first integration to get started"}
                  </p>
                  <Button onClick={() => navigate("/integrations/add")}>
                    <Icon icon="solar:add-circle-linear" className="h-4 w-4 mr-2" />
                    Add Integration
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredIntegrations.map((integration) => (
                <Card
                  key={integration.id}
                  className="group hover:border-border/80 transition-all"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                        <Icon icon={integration.icon} className="h-6 w-6" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-sm">{integration.name}</h3>
                          <Badge
                            variant="secondary"
                            className={cn("text-[10px] uppercase font-bold tracking-wide border", statusColors[integration.status])}
                          >
                            {integration.status}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={cn("text-[10px] uppercase font-medium", categoryColors[integration.category as keyof typeof categoryColors])}
                          >
                            {integration.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{integration.description}</p>
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Icon icon="solar:clock-circle-linear" className="h-3.5 w-3.5" />
                            Last sync: {integration.lastSync}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Icon icon="solar:server-linear" className="h-3.5 w-3.5" />
                            {integration.env}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-3 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleManage(integration)}
                        >
                          <Icon icon="solar:settings-linear" className="h-3.5 w-3.5 mr-1.5" />
                          Manage
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-3 text-xs"
                        >
                          <Icon icon="solar:refresh-linear" className="h-3.5 w-3.5 mr-1.5" />
                          Sync
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Available Integrations Tab */}
          <TabsContent value="available" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAvailable.map((integration) => (
                <Card
                  key={integration.id}
                  className="group hover:border-border/80 hover:shadow-sm transition-all cursor-pointer"
                  onClick={() => navigate("/integrations/add")}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                        <Icon icon={integration.icon} className="h-6 w-6" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm">{integration.name}</h3>
                          <Badge
                            variant="outline"
                            className={cn("text-[10px] uppercase font-medium", categoryColors[integration.category as keyof typeof categoryColors])}
                          >
                            {integration.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{integration.description}</p>
                      </div>

                      {/* Connect Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 text-xs flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Icon icon="solar:add-circle-linear" className="h-3.5 w-3.5 mr-1.5" />
                        Connect
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Browse More CTA */}
            <Card className="mt-6">
              <CardContent className="p-6 text-center">
                <Icon icon="solar:widget-5-bold" className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Explore More Integrations</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect with 50+ tools to power your sales workflow
                </p>
                <Button onClick={() => navigate("/integrations/add")}>
                  <Icon icon="solar:arrow-right-up-linear" className="h-4 w-4 mr-2" />
                  Browse Integration Catalog
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Manage Sheet */}
      <ManageIntegrationSheet
        open={manageSheetOpen}
        onOpenChange={setManageSheetOpen}
        integration={selectedIntegration}
      />
    </div>
  );
}
