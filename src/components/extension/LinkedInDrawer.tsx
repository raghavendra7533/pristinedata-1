import { useState } from "react";
import { X, Minus, Power, RefreshCw, User, Building2, BookOpen, MessageSquare, ChevronDown, Mail, Copy, Upload } from "lucide-react";
import pristineDataLogo from "@/assets/pristine-data-logo.svg";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContactIntelligence } from "./ContactIntelligence";
import { AccountIntelligence } from "./AccountIntelligence";
import { PlaybookIntelligence } from "./PlaybookIntelligence";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const LinkedInDrawer = () => {
  const [activeTab, setActiveTab] = useState("contact");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  return (
    <div className="w-[680px] h-screen bg-muted border-l shadow-2xl flex flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-muted border-b">
        <div className="p-4 space-y-4">
          {/* Top Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img 
                src={pristineDataLogo} 
                alt="Pristine Data AI" 
                className="h-8 w-auto"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                    >
                      <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Refresh intelligence</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button variant="ghost" size="icon">
                <Minus className="h-4 w-4" />
              </Button>
              
              <Button variant="ghost" size="icon">
                <Power className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Profile Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full p-3 rounded-xl border bg-card hover:bg-accent transition-colors flex items-center justify-between">
                <span className="text-sm font-medium text-primary">CEO and Founder - Pristine Data AI</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[640px]">
              <DropdownMenuItem>
                <span className="text-sm">CEO and Founder - Pristine Data AI</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Contact Identity Chip */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/50">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
              AR
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm">Ashok Rajan</div>
              <div className="text-xs text-muted-foreground truncate">CEO at Pristine Data AI • San Mateo, CA</div>
            </div>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-shrink-0 text-blue-600 hover:text-blue-700"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="sticky top-0 z-10 bg-muted border-b px-4">
            <TabsList className="w-full grid grid-cols-3 h-12">
              <TabsTrigger value="contact" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Contact</span>
              </TabsTrigger>
              <TabsTrigger value="account" className="gap-2">
                <Building2 className="h-4 w-4" />
                <span className="hidden sm:inline">Account</span>
              </TabsTrigger>
              <TabsTrigger value="playbook" className="gap-2">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Playbook</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="contact" className="p-4 space-y-4 mt-0">
            <ContactIntelligence />
          </TabsContent>

          <TabsContent value="account" className="p-4 space-y-4 mt-0">
            <AccountIntelligence />
          </TabsContent>

          <TabsContent value="playbook" className="p-4 space-y-4 mt-0">
            <PlaybookIntelligence />
          </TabsContent>
        </Tabs>
      </div>

      {/* Sticky Action Bar */}
      <div className="sticky bottom-0 border-t bg-muted p-4">
        <div className="flex items-center gap-2">
          <Button className="flex-1 gap-2" size="lg">
            <MessageSquare className="h-4 w-4" />
            Send LinkedIn Message
          </Button>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="lg" className="gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="hidden sm:inline">Send Email</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Send email</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="lg" className="gap-2">
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">Push to CRM</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Salesforce</DropdownMenuItem>
              <DropdownMenuItem>HubSpot</DropdownMenuItem>
              <DropdownMenuItem>Outreach</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
