import { useState } from "react";
import { Plus, RefreshCw, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ActiveIntegrationRow } from "@/components/integrations/ActiveIntegrationRow";
import { ManageIntegrationSheet } from "@/components/integrations/ManageIntegrationSheet";

const activeIntegrations = [
  { id: "sf", name: "Salesforce", category: "CRM", status: "Connected" as const, lastSync: "Today 2:14 PM", env: "Production" },
  { id: "hubspot", name: "HubSpot", category: "CRM", status: "Connected" as const, lastSync: "Today 9:02 AM", env: "Production" },
  { id: "instantly", name: "Instantly", category: "Email", status: "Needs attention" as const, lastSync: "Yesterday 6:41 PM", env: "Production" }
];

export default function Integrations() {
  const navigate = useNavigate();
  const [manageSheetOpen, setManageSheetOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<any>(null);

  const handleManage = (integration: any) => {
    setSelectedIntegration(integration);
    setManageSheetOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <section className="relative bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="integration-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M0 32V0h32" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#integration-grid)"/>
          </svg>
        </div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-3">Integrations</h1>
              <p className="text-white/90 text-lg max-w-2xl">
                Manage your connected CRM, email tools, and meeting note apps.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <RefreshCw className="mr-2 h-4 w-4" />
                Sync All
              </Button>
              <Button onClick={() => navigate("/integrations/add")} className="bg-white text-primary hover:bg-white/90">
                <Plus className="mr-2 h-4 w-4" />
                Add Integration
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeIntegrations.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="max-w-md mx-auto">
                <div className="h-24 w-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                  <Plus className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No integrations yet</h3>
                <p className="text-muted-foreground mb-6">
                  Connect your first integration to sync data and enhance your workflow.
                </p>
                <Button onClick={() => navigate("/integrations/add")} size="lg">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Integration
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Active Integrations</h2>
                <p className="text-muted-foreground">
                  {activeIntegrations.length} {activeIntegrations.length === 1 ? 'integration' : 'integrations'} connected
                </p>
              </div>
              <Button variant="outline" onClick={() => navigate("/integrations/add")} className="gap-2">
                Browse More
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            {activeIntegrations.map((integration) => (
              <Card key={integration.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <ActiveIntegrationRow 
                    integration={integration}
                    onManage={handleManage}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
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
