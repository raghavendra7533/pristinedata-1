import { X, Building2, Users, Briefcase, Globe, TrendingUp, Mail, Linkedin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SearchMode } from "./SearchModeToggle";

interface QuickViewDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: SearchMode;
  itemId: string | null;
}

export default function QuickViewDrawer({ open, onOpenChange, mode, itemId }: QuickViewDrawerProps) {
  if (!itemId) return null;

  const isAccount = mode === "accounts";

  // Mock data
  const accountData = {
    name: "Acme Corporation",
    industry: "Technology",
    employees: "500-1000",
    revenue: "$50M-$100M",
    location: "San Francisco, CA",
    website: "acme.com",
    description: "Acme Corporation is a leading technology company specializing in cloud infrastructure and enterprise software solutions.",
    techs: ["Snowflake", "AWS", "HubSpot", "Salesforce", "Slack"],
    news: [
      { title: "Acme Raises $50M Series C", date: "2 days ago" },
      { title: "New CTO Announced", date: "1 week ago" },
    ],
    competitors: ["TechFlow Inc", "DataStream Solutions"],
  };

  const contactData = {
    name: "Sarah Chen",
    title: "VP of Marketing",
    company: "Acme Corporation",
    location: "San Francisco, CA",
    email: "s.chen@acme.com",
    linkedin: "linkedin.com/in/sarahchen",
    seniority: "VP",
    department: "Marketing",
    tenure: "3 years",
    summary: "Sarah leads the marketing team at Acme, focusing on demand generation and brand strategy. Previously at Google and HubSpot.",
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[520px] p-0 overflow-hidden">
        <SheetHeader className="p-4 pb-0 border-b">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {isAccount ? (
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold">
                  {accountData.name.charAt(0)}
                </div>
              ) : (
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                    {contactData.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
              )}
              <div>
                <SheetTitle className="text-lg">
                  {isAccount ? accountData.name : contactData.name}
                </SheetTitle>
                <p className="text-sm text-muted-foreground">
                  {isAccount ? accountData.industry : contactData.title}
                </p>
              </div>
            </div>
          </div>
        </SheetHeader>

        <Tabs defaultValue={isAccount ? "overview" : "contact"} className="flex-1">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent px-4 h-11">
            {isAccount ? (
              <>
                <TabsTrigger value="overview" className="data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="intelligence" className="data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                  Intelligence
                </TabsTrigger>
                <TabsTrigger value="contacts" className="data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                  Contacts
                </TabsTrigger>
              </>
            ) : (
              <>
                <TabsTrigger value="contact" className="data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                  Contact
                </TabsTrigger>
                <TabsTrigger value="account" className="data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                  Account
                </TabsTrigger>
                <TabsTrigger value="summary" className="data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                  Summary
                </TabsTrigger>
              </>
            )}
          </TabsList>

          <ScrollArea className="h-[calc(100vh-180px)]">
            {isAccount ? (
              <>
                <TabsContent value="overview" className="p-4 space-y-4 mt-0">
                  <Card>
                    <CardContent className="p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Employees:</span>
                          <span className="font-medium">{accountData.employees}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Revenue:</span>
                          <span className="font-medium">{accountData.revenue}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Location:</span>
                          <span className="font-medium">{accountData.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Industry:</span>
                          <span className="font-medium">{accountData.industry}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">About</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground">{accountData.description}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Technology Stack</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-2">
                        {accountData.techs.map((tech) => (
                          <Badge key={tech} variant="secondary">{tech}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Recent News</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-2">
                      {accountData.news.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span>{item.title}</span>
                          <span className="text-muted-foreground">{item.date}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="intelligence" className="p-4 mt-0">
                  <Card>
                    <CardContent className="p-4 text-center text-muted-foreground">
                      <Building2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Open full Intelligence view for detailed analysis</p>
                      <Button className="mt-4 gap-2">
                        Open Intelligence
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="contacts" className="p-4 mt-0">
                  <Card>
                    <CardContent className="p-4 text-center text-muted-foreground">
                      <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>View contacts at this company</p>
                      <Button variant="outline" className="mt-4 gap-2">
                        Find Contacts
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </>
            ) : (
              <>
                <TabsContent value="contact" className="p-4 space-y-4 mt-0">
                  <Card>
                    <CardContent className="p-4 space-y-3">
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Title:</span>
                          <span className="font-medium">{contactData.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Company:</span>
                          <span className="font-medium">{contactData.company}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Location:</span>
                          <span className="font-medium">{contactData.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Seniority:</span>
                          <Badge variant="outline">{contactData.seniority}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex gap-2">
                    <Button className="flex-1 gap-2">
                      <Mail className="h-4 w-4" />
                      Send Email
                    </Button>
                    <Button variant="outline" className="flex-1 gap-2">
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="account" className="p-4 space-y-4 mt-0">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold">
                          A
                        </div>
                        <div>
                          <p className="font-medium">{contactData.company}</p>
                          <p className="text-sm text-muted-foreground">Technology • San Francisco, CA</p>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full gap-2">
                        View Company Profile
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="summary" className="p-4 mt-0">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Professional Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground">{contactData.summary}</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </>
            )}
          </ScrollArea>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
