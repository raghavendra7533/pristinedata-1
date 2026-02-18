import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";

interface PlanDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planName: string;
  companyName: string;
}

export function PlanDetailsDialog({ open, onOpenChange, planName, companyName }: PlanDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{planName} - Plan Details</DialogTitle>
        </DialogHeader>
        
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Plan Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plan Name:</span>
                    <span className="font-medium">{planName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Company:</span>
                    <span className="font-medium">{companyName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plan Users:</span>
                    <span className="font-medium">3</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Monthly Allowances</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Targets:</span>
                    <span className="font-medium">4,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sales Enrichments:</span>
                    <span className="font-medium">600</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Campaign Emails:</span>
                    <span className="font-medium">9,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rollover:</span>
                    <span className="font-medium">One month</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Includes Unlimited</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                <div>• Account and Contact Searching</div>
                <div>• Saved ICPs, Personas, and Searches</div>
                <div>• Uploaded Account Files and Contact Files</div>
                <div>• Account and Contact Lists</div>
                <div>• Campaigns</div>
                <div>• Individual Messages (Email and LinkedIn)</div>
                <div>• Campaign LinkedIn Messages</div>
                <div>• Marketing/Selling Content Files & Keyword Links</div>
                <div>• Standard Integrations & Chrome Extension</div>
              </div>
            </div>
            
            <div className="pt-4 border-t text-xs text-muted-foreground">
              <p>* Only counted as Targets once opened individually or saved to List</p>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}