import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Building2, Mail, Video, FlaskConical, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ConnectIntegrationSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  integration: any;
}

const categoryIcons: Record<string, any> = {
  CRM: Building2,
  Email: Mail,
  "Meeting notes": Video,
};

export function ConnectIntegrationDialog({ open, onOpenChange, integration }: ConnectIntegrationSheetProps) {
  const [testing, setTesting] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [testPassed, setTestPassed] = useState(false);
  const { toast } = useToast();
  
  if (!integration) return null;

  const Icon = categoryIcons[integration.category] || Building2;

  const handleTest = async () => {
    setTesting(true);
    setTimeout(() => {
      setTesting(false);
      setTestPassed(true);
      toast({
        title: "Connection successful",
        description: `Successfully connected to ${integration.name}`,
      });
    }, 1500);
  };

  const handleConnect = async () => {
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      onOpenChange(false);
      toast({
        title: "Integration connected",
        description: `${integration.name} is now connected. First sync will start in a few minutes.`,
      });
    }, 1500);
  };

  const renderFields = () => {
    const isCRM = integration.category === "CRM";
    const isEmail = integration.category === "Email";
    const isMeeting = integration.category === "Meeting notes";

    // OAuth-based integrations
    const oauthIntegrations = ["sf", "hubspot", "zoho", "fathom", "tactiq"];
    const isOAuth = oauthIntegrations.includes(integration.id);

    if (isOAuth) {
      return (
        <div className="space-y-4">
          <Button className="w-full" variant="outline" size="lg">
            Sign in with {integration.name}
          </Button>
          
          {isCRM && (
            <>
              <div className="space-y-2">
                <Label>Environment</Label>
                <RadioGroup defaultValue="production">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="production" id="production" />
                    <Label htmlFor="production" className="font-normal">Production</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sandbox" id="sandbox" />
                    <Label htmlFor="sandbox" className="font-normal">Sandbox</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Objects to Sync</Label>
                <div className="space-y-2">
                  {["Accounts", "Contacts", "Leads", "Opportunities"].map((obj) => (
                    <div key={obj} className="flex items-center space-x-2">
                      <Checkbox id={obj} defaultChecked />
                      <Label htmlFor={obj} className="font-normal">{obj}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Sync Direction</Label>
                <RadioGroup defaultValue="import">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="import" id="import" />
                    <Label htmlFor="import" className="font-normal">Import → PDAI</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="export" id="export" />
                    <Label htmlFor="export" className="font-normal">Export from PDAI</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bidirectional" id="bidirectional" />
                    <Label htmlFor="bidirectional" className="font-normal">Bi-directional</Label>
                  </div>
                </RadioGroup>
              </div>
            </>
          )}

          {isMeeting && (
            <>
              <div className="space-y-2">
                <Label htmlFor="workspace">Workspace</Label>
                <Select>
                  <SelectTrigger id="workspace">
                    <SelectValue placeholder="Select workspace" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Main Workspace</SelectItem>
                    <SelectItem value="sales">Sales Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="auto-import">Auto-import new recordings</Label>
                <Switch id="auto-import" defaultChecked />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="frequency">Sync Frequency</Label>
            <Select defaultValue="hourly">
              <SelectTrigger id="frequency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    }

    // API Key integrations (Instantly, SmartLead)
    if (isEmail) {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <Input id="api-key" type="password" placeholder="Enter your API key" />
            <p className="text-xs text-muted-foreground">
              Find your API key in {integration.name} settings
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="workspace">Workspace</Label>
            <Select>
              <SelectTrigger id="workspace">
                <SelectValue placeholder="Select workspace" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="main">Main Workspace</SelectItem>
                <SelectItem value="sales">Sales Workspace</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sending-account">Default Sending Account</Label>
            <Select>
              <SelectTrigger id="sending-account">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="account1">sales@company.com</SelectItem>
                <SelectItem value="account2">outreach@company.com</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">Sync Frequency</Label>
            <Select defaultValue="hourly">
              <SelectTrigger id="frequency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
              <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <SheetTitle>Connect {integration.name}</SheetTitle>
              <SheetDescription className="flex items-center gap-1 mt-1">
                {integration.category}
                <a href="#" className="inline-flex items-center gap-1 text-primary hover:underline">
                  Setup guide <ExternalLink className="h-3 w-3" />
                </a>
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-6">
            {integration.description}
          </p>
          {renderFields()}
        </div>

        <SheetFooter className="gap-2 flex-col sm:flex-row mt-6">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button 
            variant="outline" 
            onClick={handleTest}
            disabled={testing}
            className="w-full sm:w-auto"
          >
            <FlaskConical className="mr-2 h-4 w-4" />
            {testing ? "Testing..." : "Test Connection"}
          </Button>
          <Button 
            onClick={handleConnect}
            disabled={connecting}
            className="w-full sm:w-auto"
          >
            {connecting ? "Connecting..." : "Connect"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
