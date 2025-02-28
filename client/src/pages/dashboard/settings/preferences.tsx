
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
  Button, Switch, Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
  Tabs, TabsContent, TabsList, TabsTrigger,
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage
} from '../../../components/ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Bell, Mail, MessageSquare, Phone, Settings, Shield, AlertTriangle } from 'lucide-react';
import { apiRequest } from '../../../utils/api';
import FeatureToggle from '../../../components/saas/FeatureToggle';

const notificationSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  discordNotifications: z.boolean(),
  lowStockAlerts: z.boolean(),
  paymentReceipts: z.boolean(),
  orderUpdates: z.boolean(),
  marketingEmails: z.boolean(),
});

const appearanceSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  density: z.enum(['compact', 'default', 'comfortable']),
  defaultView: z.enum(['dashboard', 'inventory', 'pos', 'customers']),
  language: z.enum(['en', 'es', 'fr', 'de', 'ja', 'zh']),
});

const featureSchema = z.object({
  inventoryManagement: z.boolean(),
  posSystem: z.boolean(),
  invoiceSystem: z.boolean(),
  customerManagement: z.boolean(),
  analytics: z.boolean(),
  notifications: z.boolean(),
  sharing: z.boolean(),
  downloads: z.boolean(),
});

export default function PreferencesPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('notifications');

  const notificationForm = useForm<z.infer<typeof notificationSchema>>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      discordNotifications: false,
      lowStockAlerts: true,
      paymentReceipts: true,
      orderUpdates: true,
      marketingEmails: false,
    },
  });

  const appearanceForm = useForm<z.infer<typeof appearanceSchema>>({
    resolver: zodResolver(appearanceSchema),
    defaultValues: {
      theme: 'system',
      density: 'default',
      defaultView: 'dashboard',
      language: 'en',
    },
  });

  const featureForm = useForm<z.infer<typeof featureSchema>>({
    resolver: zodResolver(featureSchema),
    defaultValues: {
      inventoryManagement: true,
      posSystem: true,
      invoiceSystem: true,
      customerManagement: true,
      analytics: true,
      notifications: true,
      sharing: true,
      downloads: true,
    },
  });

  const saveNotificationPreferences = async (values: z.infer<typeof notificationSchema>) => {
    try {
      const response = await apiRequest('PUT', '/api/preferences/notifications', values);
      if (response.error) {
        console.error('Failed to save notification preferences:', response.error);
      } else {
        console.log('Notification preferences saved successfully');
      }
    } catch (error) {
      console.error('Error saving notification preferences:', error);
    }
  };

  const saveAppearancePreferences = async (values: z.infer<typeof appearanceSchema>) => {
    try {
      const response = await apiRequest('PUT', '/api/preferences/appearance', values);
      if (response.error) {
        console.error('Failed to save appearance preferences:', response.error);
      } else {
        console.log('Appearance preferences saved successfully');
      }
    } catch (error) {
      console.error('Error saving appearance preferences:', error);
    }
  };

  const saveFeaturePreferences = async (values: z.infer<typeof featureSchema>) => {
    try {
      const response = await apiRequest('PUT', '/api/preferences/features', values);
      if (response.error) {
        console.error('Failed to save feature preferences:', response.error);
      } else {
        console.log('Feature preferences saved successfully');
      }
    } catch (error) {
      console.error('Error saving feature preferences:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('preferences')}</h1>
        <p className="text-muted-foreground">
          {t('preferencesDescription')}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            {t('notifications')}
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Settings className="mr-2 h-4 w-4" />
            {t('appearance')}
          </TabsTrigger>
          <TabsTrigger value="features">
            <Shield className="mr-2 h-4 w-4" />
            {t('features')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="mt-6">
          <FeatureToggle featureId="notifications">
            <Card>
              <CardHeader>
                <CardTitle>{t('notificationPreferences')}</CardTitle>
                <CardDescription>
                  {t('notificationPreferencesDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...notificationForm}>
                  <form onSubmit={notificationForm.handleSubmit(saveNotificationPreferences)} className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">{t('channels')}</h3>
                      <div className="grid gap-6">
                        <FormField
                          control={notificationForm.control}
                          name="emailNotifications"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <div className="flex items-center">
                                  <Mail className="mr-2 h-4 w-4" />
                                  <FormLabel className="text-base">
                                    {t('emailNotifications')}
                                  </FormLabel>
                                </div>
                                <FormDescription>
                                  {t('emailNotificationsDescription')}
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={notificationForm.control}
                          name="pushNotifications"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <div className="flex items-center">
                                  <Bell className="mr-2 h-4 w-4" />
                                  <FormLabel className="text-base">
                                    {t('pushNotifications')}
                                  </FormLabel>
                                </div>
                                <FormDescription>
                                  {t('pushNotificationsDescription')}
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={notificationForm.control}
                          name="smsNotifications"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <div className="flex items-center">
                                  <Phone className="mr-2 h-4 w-4" />
                                  <FormLabel className="text-base">
                                    {t('smsNotifications')}
                                  </FormLabel>
                                </div>
                                <FormDescription>
                                  {t('smsNotificationsDescription')}
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={notificationForm.control}
                          name="discordNotifications"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <div className="flex items-center">
                                  <MessageSquare className="mr-2 h-4 w-4" />
                                  <FormLabel className="text-base">
                                    {t('discordNotifications')}
                                  </FormLabel>
                                </div>
                                <FormDescription>
                                  {t('discordNotificationsDescription')}
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">{t('events')}</h3>
                      <div className="grid gap-6">
                        <FormField
                          control={notificationForm.control}
                          name="lowStockAlerts"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <div className="flex items-center">
                                  <AlertTriangle className="mr-2 h-4 w-4" />
                                  <FormLabel className="text-base">
                                    {t('lowStockAlerts')}
                                  </FormLabel>
                                </div>
                                <FormDescription>
                                  {t('lowStockAlertsDescription')}
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={notificationForm.control}
                          name="paymentReceipts"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  {t('paymentReceipts')}
                                </FormLabel>
                                <FormDescription>
                                  {t('paymentReceiptsDescription')}
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={notificationForm.control}
                          name="orderUpdates"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  {t('orderUpdates')}
                                </FormLabel>
                                <FormDescription>
                                  {t('orderUpdatesDescription')}
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Button type="submit">{t('saveChanges')}</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </FeatureToggle>
        </TabsContent>

        <TabsContent value="appearance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('appearancePreferences')}</CardTitle>
              <CardDescription>
                {t('appearancePreferencesDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...appearanceForm}>
                <form onSubmit={appearanceForm.handleSubmit(saveAppearancePreferences)} className="space-y-8">
                  <div className="grid gap-6">
                    <FormField
                      control={appearanceForm.control}
                      name="theme"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('theme')}</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t('selectTheme')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="light">{t('light')}</SelectItem>
                              <SelectItem value="dark">{t('dark')}</SelectItem>
                              <SelectItem value="system">{t('system')}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            {t('themeDescription')}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={appearanceForm.control}
                      name="density"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('density')}</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t('selectDensity')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="compact">{t('compact')}</SelectItem>
                              <SelectItem value="default">{t('default')}</SelectItem>
                              <SelectItem value="comfortable">{t('comfortable')}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            {t('densityDescription')}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={appearanceForm.control}
                      name="defaultView"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('defaultView')}</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t('selectDefaultView')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="dashboard">{t('dashboard')}</SelectItem>
                              <SelectItem value="inventory">{t('inventory')}</SelectItem>
                              <SelectItem value="pos">{t('pos')}</SelectItem>
                              <SelectItem value="customers">{t('customers')}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            {t('defaultViewDescription')}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={appearanceForm.control}
                      name="language"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('language')}</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t('selectLanguage')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="es">Español</SelectItem>
                              <SelectItem value="fr">Français</SelectItem>
                              <SelectItem value="de">Deutsch</SelectItem>
                              <SelectItem value="ja">日本語</SelectItem>
                              <SelectItem value="zh">中文</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            {t('languageDescription')}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit">{t('saveChanges')}</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('featurePreferences')}</CardTitle>
              <CardDescription>
                {t('featurePreferencesDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...featureForm}>
                <form onSubmit={featureForm.handleSubmit(saveFeaturePreferences)} className="space-y-8">
                  <div className="grid gap-6">
                    <FormField
                      control={featureForm.control}
                      name="inventoryManagement"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              {t('inventoryManagement')}
                            </FormLabel>
                            <FormDescription>
                              {t('inventoryManagementDescription')}
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={featureForm.control}
                      name="posSystem"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              {t('posSystem')}
                            </FormLabel>
                            <FormDescription>
                              {t('posSystemDescription')}
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={featureForm.control}
                      name="invoiceSystem"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              {t('invoiceSystem')}
                            </FormLabel>
                            <FormDescription>
                              {t('invoiceSystemDescription')}
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={featureForm.control}
                      name="customerManagement"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              {t('customerManagement')}
                            </FormLabel>
                            <FormDescription>
                              {t('customerManagementDescription')}
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={featureForm.control}
                      name="analytics"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              {t('analytics')}
                            </FormLabel>
                            <FormDescription>
                              {t('analyticsDescription')}
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit">{t('saveChanges')}</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
