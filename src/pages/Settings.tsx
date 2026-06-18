import { useState } from "react";
import { Icon } from "@iconify/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SubscriptionHub from "@/pages/SubscriptionHub";
import Integrations from "@/pages/Integrations";
import LinkTableSettings from "@/components/settings/LinkTableSettings";

const TEAM_MEMBERS = [
  { name: "Single Grain", email: "admin@singlegrain.com", role: "Owner" },
  { name: "Jamie Rivera", email: "jamie@singlegrain.com", role: "Admin" },
  { name: "Priya Nair", email: "priya@singlegrain.com", role: "Member" },
];

function ProfileTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Profile</CardTitle>
        <CardDescription>Update your personal information and password.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 max-w-md">
        <div className="space-y-2">
          <Label htmlFor="settings-name">Full name</Label>
          <Input id="settings-name" defaultValue="Single Grain" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="settings-email">Email</Label>
          <Input id="settings-email" type="email" defaultValue="admin@singlegrain.com" />
        </div>
        <div className="border-t border-border pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="settings-current-password">Current password</Label>
            <Input id="settings-current-password" type="password" placeholder="••••••••" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="settings-new-password">New password</Label>
            <Input id="settings-new-password" type="password" placeholder="••••••••" />
          </div>
        </div>
        <Button>Save changes</Button>
      </CardContent>
    </Card>
  );
}

function UsersTeamsTab() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-lg">Users &amp; Teams</CardTitle>
          <CardDescription>Manage who has access to your workspace.</CardDescription>
        </div>
        <Button size="sm" className="gap-2">
          <Icon icon="solar:user-plus-linear" className="h-4 w-4" />
          Invite member
        </Button>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-border">
          {TEAM_MEMBERS.map((member) => (
            <div key={member.email} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-foreground text-xs font-bold">
                    {member.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.email}</p>
                </div>
              </div>
              <Badge variant="secondary">{member.role}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function NotificationsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Notifications</CardTitle>
        <CardDescription>Control how you hear from us.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Coming soon</p>
      </CardContent>
    </Card>
  );
}

const SETTINGS_TABS = [
  { value: "profile", label: "Profile" },
  { value: "users-teams", label: "Users & Teams" },
  { value: "billing-credits", label: "Billing & Credits" },
  { value: "integrations", label: "Integrations" },
  { value: "link-table", label: "Link Table" },
  { value: "notifications", label: "Notifications" },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-full max-w-7xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your profile, team, billing, and integrations.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          {SETTINGS_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="profile">
          <ProfileTab />
        </TabsContent>
        <TabsContent value="users-teams">
          <UsersTeamsTab />
        </TabsContent>
        <TabsContent value="billing-credits" className="-mx-6">
          <SubscriptionHub />
        </TabsContent>
        <TabsContent value="integrations" className="-mx-6">
          <Integrations />
        </TabsContent>
        <TabsContent value="link-table">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Link Table</CardTitle>
              <CardDescription>
                Keywords here automatically become hyperlinks whenever they appear in an email or
                opportunity playbook, across Outbound OS and Sales Intelligence.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LinkTableSettings />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
