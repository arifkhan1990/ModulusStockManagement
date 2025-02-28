import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Settings as SettingsIcon,
  User,
  CreditCard,
  Building,
  Globe,
  Bell,
  Lock,
  Save,
  FileText,
} from "lucide-react";
import { apiRequest } from "../../../utils/api";
import { useAuth } from "../../../hooks/useAuth";
import MainLayout from "../../../components/layout/MainLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Switch } from "../../../components/ui/switch";
import { useToast } from "../../../components/ui/use-toast";
import { FeatureToggle } from "../../../components/saas/FeatureToggle";

export default function Settings() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("profile");

  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ["settings", "profile"],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "/api/settings/profile");
        return response.data;
      } catch (error) {
        console.error("Failed to fetch profile settings", error);
        return {};
      }
    },
  });

  const { data: companyData, isLoading: companyLoading } = useQuery({
    queryKey: ["settings", "company"],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "/api/settings/company");
        return response.data;
      } catch (error) {
        console.error("Failed to fetch company settings", error);
        return {};
      }
    },
    enabled: activeTab === "company",
  });

  const { data: subscriptionData, isLoading: subscriptionLoading } = useQuery({
    queryKey: ["settings", "subscription"],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "/api/settings/subscription");
        return response.data;
      } catch (error) {
        console.error("Failed to fetch subscription settings", error);
        return {};
      }
    },
    enabled: activeTab === "subscription",
  });

  const { data: notificationData, isLoading: notificationLoading } = useQuery({
    queryKey: ["settings", "notifications"],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "/api/settings/notifications");
        return response.data;
      } catch (error) {
        console.error("Failed to fetch notification settings", error);
        return {};
      }
    },
    enabled: activeTab === "notifications",
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updatedData: any) => {
      const response = await apiRequest(
        "PUT",
        "/api/settings/profile",
        updatedData,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["settings", "profile"]);
      toast({
        title: t("profileUpdated"),
        description: t("yourProfileHasBeenUpdated"),
      });
    },
    onError: (error) => {
      toast({
        title: t("updateFailed"),
        description:
          error instanceof Error ? error.message : t("couldNotUpdateProfile"),
        variant: "destructive",
      });
    },
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Update form data when profile data is loaded
  if (profileData && !profileLoading && formData.name === "") {
    setFormData({
      name: profileData.name || "",
      email: profileData.email || "",
      phone: profileData.phone || "",
    });
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  // Format subscription expiry date
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <MainLayout>
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("settings")}</h1>
          <p className="text-muted-foreground">
            {t("manageYourAccountAndPreferences")}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              {t("profile")}
            </TabsTrigger>
            <TabsTrigger value="company">
              <Building className="h-4 w-4 mr-2" />
              {t("company")}
            </TabsTrigger>
            <TabsTrigger value="subscription">
              <CreditCard className="h-4 w-4 mr-2" />
              {t("subscription")}
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              {t("notifications")}
            </TabsTrigger>
            <TabsTrigger value="security">
              <Lock className="h-4 w-4 mr-2" />
              {t("security")}
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>{t("profileSettings")}</CardTitle>
                <CardDescription>
                  {t("manageYourProfileInformation")}
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleProfileUpdate}>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="name">{t("fullName")}</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="email">{t("emailAddress")}</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="phone">{t("phoneNumber")}</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    disabled={updateProfileMutation.isLoading}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {updateProfileMutation.isLoading
                      ? t("saving")
                      : t("saveChanges")}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          {/* Company Settings */}
          <TabsContent value="company">
            <Card>
              <CardHeader>
                <CardTitle>{t("companyInformation")}</CardTitle>
                <CardDescription>
                  {t("manageYourBusinessDetails")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {companyLoading ? (
                  <div>{t("loading")}...</div>
                ) : (
                  <>
                    <div className="space-y-1">
                      <Label htmlFor="companyName">{t("companyName")}</Label>
                      <Input
                        id="companyName"
                        defaultValue={companyData?.name || ""}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="companyAddress">{t("address")}</Label>
                      <Input
                        id="companyAddress"
                        defaultValue={companyData?.address || ""}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="companyCity">{t("city")}</Label>
                      <Input
                        id="companyCity"
                        defaultValue={companyData?.city || ""}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label htmlFor="companyCountry">{t("country")}</Label>
                        <Select defaultValue={companyData?.country || ""}>
                          <SelectTrigger id="companyCountry">
                            <SelectValue placeholder={t("selectCountry")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="us">United States</SelectItem>
                            <SelectItem value="ca">Canada</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                            <SelectItem value="au">Australia</SelectItem>
                            <SelectItem value="de">Germany</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="companyPostalCode">
                          {t("postalCode")}
                        </Label>
                        <Input
                          id="companyPostalCode"
                          defaultValue={companyData?.postalCode || ""}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="taxNumber">{t("taxNumber")}</Label>
                      <Input
                        id="taxNumber"
                        defaultValue={companyData?.taxNumber || ""}
                      />
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  {t("saveChanges")}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Subscription Settings */}
          <TabsContent value="subscription">
            <Card>
              <CardHeader>
                <CardTitle>{t("subscriptionDetails")}</CardTitle>
                <CardDescription>
                  {t("manageYourSubscriptionPlan")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {subscriptionLoading ? (
                  <div>{t("loading")}...</div>
                ) : (
                  <>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-1">
                        <div className="text-sm font-medium">
                          {t("currentPlan")}
                        </div>
                        <div className="text-2xl font-bold capitalize">
                          {subscriptionData?.plan || "Free"}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">{t("status")}</div>
                        <div className="flex items-center">
                          <div
                            className={`h-2 w-2 rounded-full mr-2 ${
                              subscriptionData?.status === "active"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          />
                          <span className="capitalize">
                            {subscriptionData?.status || "Inactive"}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">
                          {t("nextBillingDate")}
                        </div>
                        <div>
                          {formatDate(subscriptionData?.nextBillingDate || "")}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">{t("amount")}</div>
                        <div>
                          ${subscriptionData?.amount || "0"}/
                          {subscriptionData?.interval || "month"}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-2">
                        {t("billingHistory")}
                      </h3>
                      <div className="rounded-md border">
                        <div className="grid grid-cols-4 border-b px-4 py-2 font-medium">
                          <div>{t("date")}</div>
                          <div>{t("amount")}</div>
                          <div>{t("status")}</div>
                          <div>{t("invoice")}</div>
                        </div>
                        {subscriptionData?.billingHistory?.map((item: any) => (
                          <div
                            key={item.id}
                            className="grid grid-cols-4 px-4 py-3 border-b last:border-b-0"
                          >
                            <div>{formatDate(item.date)}</div>
                            <div>${item.amount}</div>
                            <div className="capitalize">{item.status}</div>
                            <div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2"
                              >
                                <FileText className="h-4 w-4 mr-1" />
                                {t("view")}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">{t("cancelSubscription")}</Button>
                <Button>{t("upgradePlan")}</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>{t("notificationSettings")}</CardTitle>
                <CardDescription>
                  {t("manageHowYouReceiveNotifications")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {notificationLoading ? (
                  <div>{t("loading")}...</div>
                ) : (
                  <>
                    <h3 className="text-lg font-medium mb-2">
                      {t("emailNotifications")}
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{t("orderUpdates")}</div>
                          <div className="text-sm text-muted-foreground">
                            {t("receiveNotificationsWhenOrderStatusChanges")}
                          </div>
                        </div>
                        <Switch
                          defaultChecked={notificationData?.email?.orderUpdates}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{t("stockAlerts")}</div>
                          <div className="text-sm text-muted-foreground">
                            {t("receiveAlertsWhenItemsRunLow")}
                          </div>
                        </div>
                        <Switch
                          defaultChecked={notificationData?.email?.stockAlerts}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">
                            {t("weeklyReports")}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {t("receiveWeeklyReports")}
                          </div>
                        </div>
                        <Switch
                          defaultChecked={
                            notificationData?.email?.weeklyReports
                          }
                        />
                      </div>
                    </div>

                    <FeatureToggle featureId="sms_notifications">
                      <div className="mt-6">
                        <h3 className="text-lg font-medium mb-2">
                          {t("smsNotifications")}
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">
                                {t("orderConfirmations")}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {t("receiveSmsWhenNewOrderIsPlaced")}
                              </div>
                            </div>
                            <Switch
                              defaultChecked={
                                notificationData?.sms?.orderConfirmations
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">
                                {t("criticalAlerts")}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {t("receiveSmsForCriticalStockIssues")}
                              </div>
                            </div>
                            <Switch
                              defaultChecked={
                                notificationData?.sms?.criticalAlerts
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </FeatureToggle>

                    <FeatureToggle featureId="discord_integration">
                      <div className="mt-6">
                        <h3 className="text-lg font-medium mb-2">
                          {t("discordNotifications")}
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">
                                {t("discordIntegration")}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {t("sendAlertsToDiscordChannel")}
                              </div>
                            </div>
                            <Switch
                              defaultChecked={
                                notificationData?.discord?.enabled
                              }
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="webhookUrl">
                              {t("webhookUrl")}
                            </Label>
                            <Input
                              id="webhookUrl"
                              defaultValue={
                                notificationData?.discord?.webhookUrl || ""
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </FeatureToggle>
                  </>
                )}
              </CardContent>
              <CardFooter>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  {t("saveChanges")}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>{t("securitySettings")}</CardTitle>
                <CardDescription>
                  {t("manageYourAccountSecurity")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="text-lg font-medium mb-2">
                  {t("changePassword")}
                </h3>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="currentPassword">
                      {t("currentPassword")}
                    </Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="newPassword">{t("newPassword")}</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="confirmPassword">
                      {t("confirmNewPassword")}
                    </Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">
                    {t("loginOptions")}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">
                          {t("twoFactorAuthentication")}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {t("improveYourAccountSecurity")}
                        </div>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">
                          {t("emailOnNewLogin")}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {t("receiveEmailWhenNewDeviceLogsIn")}
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">{t("sessions")}</h3>
                  <div className="text-sm text-muted-foreground mb-4">
                    {t("theseAreDevicesLoggedInToYourAccount")}
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">
                          {t("currentDevice")} -{" "}
                          {navigator.userAgent.includes("Windows")
                            ? "Windows"
                            : navigator.userAgent.includes("Mac")
                              ? "Mac"
                              : "Linux"}{" "}
                          /{" "}
                          {navigator.userAgent.includes("Chrome")
                            ? "Chrome"
                            : navigator.userAgent.includes("Firefox")
                              ? "Firefox"
                              : "Safari"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {t("activeNow")}
                        </div>
                      </div>
                      <div className="text-sm text-green-600">
                        {t("current")}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">{t("logoutAllDevices")}</Button>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  {t("updatePassword")}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
