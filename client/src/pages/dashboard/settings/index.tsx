
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import { useCurrency } from "@/contexts/currency-context";
import { useTheme } from "@/contexts/theme-context";
import { Globe, PaintBucket, CreditCard, User, Bell, Shield } from "lucide-react";

export default function SettingsPage() {
  const { language, setLanguage, availableLanguages, t } = useLanguage();
  const { currency, setCurrency, availableCurrencies } = useCurrency();
  const { theme, setMode, setColor, availableColors, availableModes } = useTheme();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('settings')}</h1>
        <p className="text-muted-foreground">
          Manage your application preferences and system settings
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 h-auto">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden md:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="language" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden md:inline">Language</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <PaintBucket className="h-4 w-4" />
            <span className="hidden md:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="currency" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden md:inline">Currency</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden md:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden md:inline">Security</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage your basic account preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user-name">User Name</Label>
                <div className="text-sm text-muted-foreground">
                  Coming soon...
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="language">
          <Card>
            <CardHeader>
              <CardTitle>Language Settings</CardTitle>
              <CardDescription>
                Choose your preferred language for the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="language">Interface Language</Label>
                <Select value={language} onValueChange={(val) => setLanguage(val as any)}>
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="zh">中文</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end">
                <Button type="submit">Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize the look and feel of the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="theme-mode">Theme Mode</Label>
                <Select value={theme.mode} onValueChange={(val) => setMode(val as any)}>
                  <SelectTrigger id="theme-mode">
                    <SelectValue placeholder="Select theme mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="theme-color">Primary Color</Label>
                <Select value={theme.color} onValueChange={(val) => setColor(val as any)}>
                  <SelectTrigger id="theme-color">
                    <SelectValue placeholder="Select theme color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="purple">Purple</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                    <SelectItem value="red">Red</SelectItem>
                    <SelectItem value="gray">Gray</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end">
                <Button type="submit">Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="currency">
          <Card>
            <CardHeader>
              <CardTitle>Currency Settings</CardTitle>
              <CardDescription>
                Choose your preferred currency for the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="currency">Display Currency</Label>
                <Select value={currency.code} onValueChange={(val) => setCurrency(val as any)}>
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCurrencies.map((curr) => (
                      <SelectItem key={curr.code} value={curr.code}>
                        {curr.symbol} {curr.name} ({curr.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end">
                <Button type="submit">Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Notification settings coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security and privacy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Security settings coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
