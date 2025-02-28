import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useState } from "react";
import {
  Card as Card2,
  CardContent as CardContent2,
  CardDescription as CardDescription2,
  CardHeader as CardHeader2,
  CardTitle as CardTitle2,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Save } from "lucide-react";


export default function SettingsPage() {
  const [selectedTab, setSelectedTab] = useState("profile");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and system preferences
        </p>
      </div>

      <Tabs
        defaultValue="profile"
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Manage your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" defaultValue="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="john@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input id="jobTitle" defaultValue="Inventory Manager" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" defaultValue="(555) 123-4567" />
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-end">
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Manage your account security and password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-end">
                <Button variant="outline">Change Password</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Low Stock Alerts</p>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications when stock levels fall below threshold
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New Stock Movements</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified about new stock transfers and adjustments
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">System Updates</p>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about system updates and maintenance
                    </p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive important notifications via email
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize the look and feel of the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Dark Mode</p>
                    <p className="text-sm text-muted-foreground">
                      Enable dark mode for the application
                    </p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Compact Mode</p>
                    <p className="text-sm text-muted-foreground">
                      Use a more compact display style
                    </p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Configure system-wide settings and defaults
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Automatic Stock Alerts</p>
                    <p className="text-sm text-muted-foreground">
                      Automatically generate alerts for low stock items
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto-Generate Purchase Orders</p>
                    <p className="text-sm text-muted-foreground">
                      Generate purchase orders for low stock items
                    </p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Default Location</p>
                    <p className="text-sm text-muted-foreground">
                      Set the default location for new stock items
                    </p>
                  </div>
                  <div className="w-40">
                    <select className="w-full rounded-md border p-2">
                      <option>Main Warehouse</option>
                      <option>Downtown Store</option>
                      <option>West Coast Distribution</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { useState } from "react";
import { Button as Button2 } from "@/components/ui/button";
import {
  Card as Card3,
  CardContent as CardContent3,
  CardDescription as CardDescription3,
  CardHeader as CardHeader3,
  CardTitle as CardTitle3,
} from "@/components/ui/card";
import { Input as Input2 } from "@/components/ui/input";
import { Label as Label2 } from "@/components/ui/label";
import { Tabs as Tabs2, TabsList as TabsList2, TabsTrigger as TabsTrigger2, TabsContent as TabsContent2 } from "@/components/ui/tabs";
import { Switch as Switch2 } from "@/components/ui/switch";
import { Textarea as Textarea2 } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/use-auth";

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  // Account settings
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [stockAlerts, setStockAlerts] = useState(true);
  const [activitySummary, setActivitySummary] = useState(false);

  const handleAccountUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    setTimeout(() => {
      setIsUpdating(false);
      toast({
        title: "Settings Updated",
        description: "Your account settings have been updated successfully.",
      });
    }, 1000);
  };

  const handleNotificationUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    setTimeout(() => {
      setIsUpdating(false);
      toast({
        title: "Notification Settings Updated",
        description: "Your notification preferences have been saved.",
      });
    }, 1000);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application settings
        </p>
      </div>

      <Tabs2 defaultValue="account" className="space-y-4">
        <TabsList2>
          <TabsTrigger2 value="account">Account</TabsTrigger2>
          <TabsTrigger2 value="notifications">Notifications</TabsTrigger2>
          <TabsTrigger2 value="security">Security</TabsTrigger2>
          <TabsTrigger2 value="appearance">Appearance</TabsTrigger2>
        </TabsList2>

        <TabsContent2 value="account">
          <Card3>
            <CardHeader3>
              <CardTitle3>Account Settings</CardTitle3>
              <CardDescription3>
                Update your personal information and preferences
              </CardDescription3>
            </CardHeader3>
            <CardContent3>
              <form onSubmit={handleAccountUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label2 htmlFor="name">Full Name</Label2>
                  <Input2
                    id="name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label2 htmlFor="email">Email Address</Label2>
                  <Input2
                    id="email"
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label2 htmlFor="company">Company Name (Optional)</Label2>
                  <Input2 id="company" placeholder="Your company name" />
                </div>
                <div className="space-y-2">
                  <Label2 htmlFor="bio">Bio (Optional)</Label2>
                  <Textarea2
                    id="bio"
                    placeholder="A brief description about yourself"
                    className="resize-none"
                  />
                </div>
                <Button2 type="submit" disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update Account"}
                </Button2>
              </form>
            </CardContent3>
          </Card3>
        </TabsContent2>

        <TabsContent2 value="notifications">
          <Card3>
            <CardHeader3>
              <CardTitle3>Notification Settings</CardTitle3>
              <CardDescription3>
                Configure how and when you receive notifications
              </CardDescription3>
            </CardHeader3>
            <CardContent3>
              <form onSubmit={handleNotificationUpdate} className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label2>Email Notifications</Label2>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch2
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label2>Low Stock Alerts</Label2>
                      <p className="text-sm text-muted-foreground">
                        Get notified when products reach low stock levels
                      </p>
                    </div>
                    <Switch2
                      checked={stockAlerts}
                      onCheckedChange={setStockAlerts}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label2>Weekly Activity Summary</Label2>
                      <p className="text-sm text-muted-foreground">
                        Receive a weekly summary of inventory activities
                      </p>
                    </div>
                    <Switch2
                      checked={activitySummary}
                      onCheckedChange={setActivitySummary}
                    />
                  </div>
                </div>
                <Button2 type="submit" disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save Preferences"}
                </Button2>
              </form>
            </CardContent3>
          </Card3>
        </TabsContent2>

        <TabsContent2 value="security">
          <Card3>
            <CardHeader3>
              <CardTitle3>Security Settings</CardTitle3>
              <CardDescription3>
                Manage your password and security preferences
              </CardDescription3>
            </CardHeader3>
            <CardContent3>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label2 htmlFor="current-password">Current Password</Label2>
                  <Input2
                    id="current-password"
                    type="password"
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <Label2 htmlFor="new-password">New Password</Label2>
                  <Input2
                    id="new-password"
                    type="password"
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <Label2 htmlFor="confirm-password">Confirm New Password</Label2>
                  <Input2
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                  />
                </div>
                <Button2 type="submit">Change Password</Button2>
              </form>
            </CardContent3>
          </Card3>
        </TabsContent2>

        <TabsContent2 value="appearance">
          <Card3>
            <CardHeader3>
              <CardTitle3>Appearance Settings</CardTitle3>
              <CardDescription3>
                Customize the look and feel of your dashboard
              </CardDescription3>
            </CardHeader3>
            <CardContent3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label2>Theme</Label2>
                  <div className="flex space-x-2">
                    <Button2 variant="outline" className="flex-1">Light</Button2>
                    <Button2 variant="outline" className="flex-1">Dark</Button2>
                    <Button2 variant="default" className="flex-1">System</Button2>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label2>Dashboard Layout</Label2>
                  <div className="flex space-x-2">
                    <Button2 variant="outline" className="flex-1">Compact</Button2>
                    <Button2 variant="default" className="flex-1">Default</Button2>
                    <Button2 variant="outline" className="flex-1">Comfortable</Button2>
                  </div>
                </div>
                <Button2>Save Preferences</Button2>
              </div>
            </CardContent3>
          </Card3>
        </TabsContent2>
      </Tabs2>
    </div>
  );
}