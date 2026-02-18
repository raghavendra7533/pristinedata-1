import { useState } from "react";
import { ExtensionPopup } from "@/components/extension/ExtensionPopup";
import { ExtensionLogin } from "@/components/extension/ExtensionLogin";
import { LinkedInDrawer } from "@/components/extension/LinkedInDrawer";
import { EmptyState, LoadingState, ErrorState } from "@/components/extension/EmptyState";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ChromeExtension = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-background to-blue-50 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Chrome Extension UI Components</h1>
            <p className="text-muted-foreground">
              Modern, sales-friendly UI components for the Pristine Data AI browser extension
            </p>
          </div>

          {/* Component Showcase */}
          <Tabs defaultValue="drawer" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="drawer">LinkedIn Drawer</TabsTrigger>
              <TabsTrigger value="popup">Browser Popup</TabsTrigger>
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="states">States</TabsTrigger>
              <TabsTrigger value="combined">Combined View</TabsTrigger>
            </TabsList>

            {/* LinkedIn Drawer */}
            <TabsContent value="drawer" className="space-y-4">
              <div className="bg-card rounded-lg p-4 border">
                <h2 className="text-lg font-semibold mb-4">LinkedIn Profile Drawer</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Right-side drawer showing contact and account intelligence when viewing LinkedIn profiles
                </p>
                <div className="flex justify-center">
                  <div className="border rounded-xl overflow-hidden shadow-2xl">
                    <LinkedInDrawer />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Browser Popup */}
            <TabsContent value="popup" className="space-y-4">
              <div className="bg-card rounded-lg p-4 border">
                <h2 className="text-lg font-semibold mb-4">Browser Action Popup</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Quick access menu when clicking the extension icon in the browser toolbar
                </p>
                <div className="flex justify-center">
                  <ExtensionPopup />
                </div>
              </div>
            </TabsContent>

            {/* Login */}
            <TabsContent value="login" className="space-y-4">
              <div className="bg-card rounded-lg p-4 border">
                <h2 className="text-lg font-semibold mb-4">Login Panel</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Authentication screen for first-time users or logged-out state
                </p>
                <div className="flex justify-center">
                  <div className="w-full max-w-md">
                    <ExtensionLogin />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* States */}
            <TabsContent value="states" className="space-y-4">
              <div className="grid gap-6">
                {/* Empty State */}
                <div className="bg-card rounded-lg p-4 border">
                  <h2 className="text-lg font-semibold mb-4">Empty State</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Shown when no intelligence data is available yet
                  </p>
                  <div className="max-w-md mx-auto">
                    <EmptyState />
                  </div>
                </div>

                {/* Loading State */}
                <div className="bg-card rounded-lg p-4 border">
                  <h2 className="text-lg font-semibold mb-4">Loading State</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Skeleton loaders while AI research is in progress
                  </p>
                  <div className="max-w-md mx-auto">
                    <LoadingState />
                  </div>
                </div>

                {/* Error State */}
                <div className="bg-card rounded-lg p-4 border">
                  <h2 className="text-lg font-semibold mb-4">Error State</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Error banner with retry and help options
                  </p>
                  <div className="max-w-md mx-auto">
                    <ErrorState />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Combined View */}
            <TabsContent value="combined" className="space-y-4">
              <div className="bg-card rounded-lg p-4 border">
                <h2 className="text-lg font-semibold mb-4">Full Extension Experience</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Simulated LinkedIn page with extension drawer overlay
                </p>
                <div className="relative bg-gradient-to-br from-blue-50 to-slate-100 rounded-xl overflow-hidden" style={{ height: '800px' }}>
                  {/* Mock LinkedIn Content */}
                  <div className="p-8 space-y-4">
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600" />
                        <div className="flex-1 space-y-3">
                          <h1 className="text-2xl font-bold">Ashok Rajan</h1>
                          <p className="text-lg">CEO at Pristine Data AI | Ex-6sense, Oracle, Responsys alumni</p>
                          <p className="text-muted-foreground">San Mateo, California, United States</p>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>4,438 followers</span>
                            <span>500+ connections</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      <h2 className="text-xl font-semibold mb-4">About</h2>
                      <p className="text-muted-foreground">
                        Passionate about transforming enterprise sales through AI and data...
                      </p>
                    </div>
                  </div>

                  {/* Extension Drawer Overlay */}
                  <div className="absolute top-0 right-0 h-full">
                    <LinkedInDrawer />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
  );
};

export default ChromeExtension;
