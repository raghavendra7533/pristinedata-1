import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";

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
    },
    {
      id: 4,
      title: "3rd Follow-up",
      subject: `One More Thing for ${contact.company}`,
      content: `Hi ${contact.name},

I know your inbox is probably overflowing, so I'll keep this brief.

I came across some recent news about ${contact.company} and thought our platform could be particularly relevant given your current initiatives.

If you're open to a quick 10-minute call, I'd love to share how we've helped similar companies achieve:
• 3x faster partner onboarding
• 90% reduction in manual data entry
• Real-time compliance monitoring

No pressure at all - just wanted to make sure you had all the information.

Best,
Pristine Data Team`
    },
    {
      id: 5,
      title: "Final Touch",
      subject: `Closing the Loop - ${contact.company}`,
      content: `Hi ${contact.name},

This will be my last email on this topic.

I genuinely believe our platform could help ${contact.company} streamline operations and save significant time on partner integrations.

If the timing isn't right now, no worries at all. Feel free to reach out whenever you're ready to explore this further.

Wishing you and the team at ${contact.company} continued success.

Warm regards,
Pristine Data Team`
    }
  ];

  return stages[stage - 1];
};

const CampaignPreview = ({ data }: CampaignPreviewProps) => {
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
    <div className="space-y-4 animate-fade-in">
      {/* Email Preview Card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon icon="solar:letter-linear" className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-semibold">Email Preview</CardTitle>
            </div>
            <Badge variant="outline" className="text-xs">
              {data.stages} {data.stages === 1 ? "Stage" : "Stages"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-4">
          {/* Contact Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Preview Contact</Label>
              <div className="relative">
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowEmailSearch(true)}
                  className="h-7 w-40 text-xs"
                />
                <Icon icon="solar:magnifer-linear" className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />

                {showEmailSearch && searchQuery && (
                  <div className="absolute top-full mt-1 right-0 w-64 bg-card border border-border rounded-lg shadow-lg z-10 max-h-40 overflow-auto">
                    {filteredContacts.map((contact) => (
                      <button
                        key={contact.email}
                        onClick={() => {
                          setSelectedEmail(contact.email);
                          setSearchQuery("");
                          setShowEmailSearch(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-muted text-xs"
                      >
                        {contact.email}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Contact chips */}
            <div className="flex items-center gap-1">
              {mockContacts.map((contact) => (
                <button
                  key={contact.email}
                  onClick={() => setSelectedEmail(contact.email)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    selectedEmail === contact.email
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {contact.name}
                </button>
              ))}
            </div>
          </div>

          {/* Email Stage Tabs */}
          <Tabs defaultValue="1" className="w-full">
            <TabsList className="w-full justify-start h-8 gap-1 bg-muted/30 p-1">
              {stages.map((stage) => (
                <TabsTrigger
                  key={stage.id}
                  value={stage.id.toString()}
                  className="text-xs px-3 py-1 data-[state=active]:bg-card data-[state=active]:shadow-sm"
                >
                  {stage.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {stages.map((stage) => (
              <TabsContent key={stage.id} value={stage.id.toString()} className="mt-3">
                <div className="border border-border rounded-lg overflow-hidden">
                  {/* Email header */}
                  <div className="bg-muted/30 px-4 py-2 border-b border-border space-y-1">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">To:</span> {selectedEmail}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">From:</span> Pristine Data
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">Subject:</span> {stage.subject}
                    </p>
                  </div>

                  {/* Email body */}
                  <div className="p-4 max-h-64 overflow-y-auto scrollbar-minimal">
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
                      {stage.content}
                    </pre>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Summary Stats Card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Icon icon="solar:chart-linear" className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-semibold">Campaign Summary</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Campaign</p>
              <p className="text-sm font-medium text-foreground">{data.name || "Untitled"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Theme</p>
              <p className="text-sm font-medium text-foreground capitalize">{data.theme?.replace("-", " ") || "Not selected"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Stages</p>
              <p className="text-sm font-medium text-foreground">{data.stages}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Contacts</p>
              <p className="text-sm font-medium text-foreground">{mockContacts.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignPreview;
