import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Mail, Search, Sparkles, CheckCircle, XCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CampaignPreviewProps {
  data: {
    name: string;
    theme: string;
    stages: number;
    contactList: string;
    instructions: string;
  };
  onNext: () => void;
  onBack: () => void;
}

// Mock preview data
const mockContacts = [
  { email: "josh@compscience.com", name: "Josh", company: "CompScience" },
  { email: "thamilton@unitedfiregroup.com", name: "T. Hamilton", company: "United Fire Group" },
  { email: "michael.celi@springventuregroup.com", name: "Michael", company: "Spring Venture Group" }
];

const generateEmailContent = (contact: { name: string; company: string }, stage: number) => {
  const stages = [
    {
      id: 1,
      title: "Initial Outreach",
      subject: `Transform ${contact.company}'s Partner Onboarding Process`,
      content: `Hi ${contact.name},

As a leader at ${contact.company}, you're likely navigating the complexities of integrating a diverse range of plan providers and TPAs. Each has unique data formats and protocols, making the onboarding process lengthy and challenging.

We simplify this with our no-code, AI-powered integration platform, which accelerates partner onboarding and ensures compliance. Can we schedule a brief call to discuss how we can help streamline your processes at ${contact.company}?

Regards,
Pristine Data Team`
    },
    {
      id: 2,
      title: "1st Follow-up",
      subject: `Quick Question About ${contact.company}'s Integration Strategy`,
      content: `Hi ${contact.name},

I wanted to follow up on my previous message about streamlining your partner onboarding process.

I understand you're busy, but I'd love to share some quick insights on how companies similar to ${contact.company} have reduced their integration time by 60%.

Would a 15-minute call next week work for you?

Best regards,
Pristine Data Team`
    },
    {
      id: 3,
      title: "2nd Follow-up",
      subject: `Final Follow-up: Integration Solutions for ${contact.company}`,
      content: `Hi ${contact.name},

This is my final follow-up regarding our AI-powered integration platform.

I respect your time and inbox, but I wanted to make sure you had the opportunity to learn about how we can help ${contact.company}:
• Reduce onboarding time by 60%
• Ensure compliance across all integrations
• Eliminate manual data mapping

If now isn't the right time, I completely understand. Feel free to reach out when you're ready.

Best,
Pristine Data Team`
    }
  ];
  
  return stages[stage - 1];
};

const CampaignPreview = ({ data, onNext, onBack }: CampaignPreviewProps) => {
  const [selectedEmail, setSelectedEmail] = useState(mockContacts[0].email);
  const [searchQuery, setSearchQuery] = useState("");
  const [showEmailSearch, setShowEmailSearch] = useState(false);

  const filteredContacts = mockContacts.filter(contact =>
    contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedContact = mockContacts.find(c => c.email === selectedEmail) || mockContacts[0];

  const stages = Array.from({ length: data.stages }, (_, i) => 
    generateEmailContent(selectedContact, i + 1)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Preview Your Campaign</h2>
        <p className="text-muted-foreground">
          Review email content for each stage and test with specific contacts
        </p>
      </div>

      <Card className="border-border/50 shadow-lg">
        <CardHeader className="border-b border-border/50 bg-muted/30">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Campaign Preview</CardTitle>
            <Badge variant="outline" className="text-sm">
              <Mail className="h-3.5 w-3.5 mr-1.5" />
              {data.stages} {data.stages === 1 ? "Stage" : "Stages"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Email Selector */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              Preview Email (max 5) <span className="text-destructive">*</span>
            </Label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Input
                  placeholder="Search Email"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowEmailSearch(true)}
                  className="h-11"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                
                {showEmailSearch && searchQuery && (
                  <div className="absolute top-full mt-2 w-full bg-card border border-border rounded-lg shadow-lg z-10 max-h-48 overflow-auto">
                    {filteredContacts.map((contact) => (
                      <button
                        key={contact.email}
                        onClick={() => {
                          setSelectedEmail(contact.email);
                          setSearchQuery("");
                          setShowEmailSearch(false);
                        }}
                        className="w-full px-4 py-2.5 text-left hover:bg-muted text-sm"
                      >
                        {contact.email}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Button className="bg-primary hover:bg-primary/90 px-6">
                Preview Email
              </Button>
            </div>
            
            {/* Selected emails list */}
            <div className="flex flex-wrap gap-2 mt-3">
              {mockContacts.map((contact) => (
                <button
                  key={contact.email}
                  onClick={() => setSelectedEmail(contact.email)}
                  className="group"
                >
                  <Badge
                    variant={selectedEmail === contact.email ? "default" : "secondary"}
                    className={`px-3 py-1.5 text-sm transition-all cursor-pointer ${
                      selectedEmail === contact.email
                        ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary/20"
                        : "hover:bg-secondary/80"
                    }`}
                  >
                    {contact.email}
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          {/* Email Stage Tabs */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Email Preview</Label>
            
            <Tabs defaultValue="1" className="w-full">
              <TabsList className="w-full justify-start h-auto gap-2 bg-transparent p-0">
                {stages.map((stage) => (
                  <TabsTrigger
                    key={stage.id}
                    value={stage.id.toString()}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-2.5"
                  >
                    {stage.title}
                  </TabsTrigger>
                ))}
              </TabsList>

              {stages.map((stage) => (
                <TabsContent key={stage.id} value={stage.id.toString()} className="mt-6">
                  <Card className="border-border/50">
                    <div className="bg-muted/50 px-6 py-3 border-b border-border/50 flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                      </div>
                    </div>
                    <CardContent className="p-6 space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          <span className="font-semibold">To:</span> {selectedEmail}
                        </p>
                        <p className="text-sm text-muted-foreground mb-1">
                          <span className="font-semibold">From:</span> Pristine Data
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-semibold">Subject:</span> {stage.subject}
                        </p>
                      </div>
                      
                      <div className="border-t border-border/50 pt-4">
                        <div className="prose prose-sm max-w-none">
                          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                            {stage.content}
                          </pre>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4 pb-8">
        <Button
          variant="outline"
          size="lg"
          onClick={onBack}
          className="px-8 border-2 hover:bg-destructive/10 hover:border-destructive hover:text-destructive"
        >
          <XCircle className="h-5 w-5 mr-2" />
          Reject Campaign
        </Button>
        <Button
          size="lg"
          onClick={onNext}
          className="px-8 bg-primary hover:bg-primary/90"
        >
          <CheckCircle className="h-5 w-5 mr-2" />
          Approve Campaign
        </Button>
      </div>
    </div>
  );
};

export default CampaignPreview;
