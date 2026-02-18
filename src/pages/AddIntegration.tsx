import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IntegrationCard } from "@/components/integrations/IntegrationCard";
import { ConnectIntegrationDialog } from "@/components/integrations/ConnectIntegrationDialog";
import { ManageIntegrationSheet } from "@/components/integrations/ManageIntegrationSheet";

const availableIntegrations = [
  { id: "sf", name: "Salesforce", category: "CRM", description: "Sync accounts, contacts, leads, and opportunities", isConnected: true },
  { id: "hubspot", name: "HubSpot", category: "CRM", description: "Connect companies, contacts, and deals", isConnected: true },
  { id: "zoho", name: "Zoho CRM", category: "CRM", description: "Integrate accounts, contacts, leads, and deals", isConnected: false },
  { id: "instantly", name: "Instantly", category: "Email", description: "Automate cold email outreach campaigns", isConnected: true },
  { id: "smartlead", name: "SmartLead", category: "Email", description: "Scale cold email with unlimited sending accounts", isConnected: false },
  { id: "fathom", name: "Fathom", category: "Meeting notes", description: "Auto-import meeting recordings and notes", isConnected: false },
  { id: "tactiq", name: "Tactiq", category: "Meeting notes", description: "Capture meeting transcripts automatically", isConnected: false }
];

export default function AddIntegration() {
  const navigate = useNavigate();
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [manageSheetOpen, setManageSheetOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<any>(null);

  const categories = [
    { name: "CRM", integrations: availableIntegrations.filter(i => i.category === "CRM") },
    { name: "Email", integrations: availableIntegrations.filter(i => i.category === "Email") },
    { name: "Meeting notes", integrations: availableIntegrations.filter(i => i.category === "Meeting notes") }
  ];

  const handleConnect = (integration: any) => {
    setSelectedIntegration(integration);
    setConnectDialogOpen(true);
  };

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
          <div className="flex flex-col gap-4">
            <Button 
              variant="ghost" 
              className="w-fit text-white hover:bg-white/10"
              onClick={() => navigate("/integrations")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Integrations
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-white mb-3">Add Integration</h1>
              <p className="text-white/90 text-lg max-w-2xl">
                Browse and connect CRM, email tools, and meeting note apps to enhance your workflow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {categories.map((category) => (
            <Card key={category.name}>
              <CardHeader>
                <CardTitle>{category.name}</CardTitle>
                <CardDescription>
                  {category.name === "CRM" && "Connect your customer relationship management platform"}
                  {category.name === "Email" && "Link your email outreach tools"}
                  {category.name === "Meeting notes" && "Import meeting recordings and transcripts"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.integrations.map((integration) => (
                    <IntegrationCard 
                      key={integration.id}
                      integration={integration}
                      onConnect={handleConnect}
                      onManage={handleManage}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
