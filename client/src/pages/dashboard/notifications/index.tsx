
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  Bell,
  Mail,
  MessageSquare,
  SmartphoneIcon,
  Settings,
  Shield
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FeatureToggle } from '@/components/saas/FeatureToggle';
import { useApi } from '@/utils/api';

export default function NotificationsPage() {
  const { t } = useTranslation();
  const api = useApi();
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState({
    email: {
      enabled: true,
      events: {
        new_order: true,
        low_stock: true,
        payment_received: true,
        document_shared: true,
        account_activity: false
      }
    },
    push: {
      enabled: false,
      events: {
        new_order: true,
        low_stock: true,
        payment_received: false,
        document_shared: false,
        account_activity: false
      }
    },
    sms: {
      enabled: false,
      events: {
        new_order: false,
        low_stock: false,
        payment_received: true,
        document_shared: false,
        account_activity: true
      }
    },
    discord: {
      enabled: false,
      connected: false
    },
    slack: {
      enabled: false,
      connected: false
    }
  });

  const fetchPreferences = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/notifications/preferences');
      if (response.data?.preferences) {
        setPreferences(response.data.preferences);
      }
    } catch (error) {
      console.error('Failed to fetch notification preferences:', error);
      toast.error(t('errorFetchingNotificationPreferences'));
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    try {
      setLoading(true);
      await api.put('/api/notifications/preferences', { preferences });
      toast.success(t('notificationPreferencesSaved'));
    } catch (error) {
      console.error('Failed to save notification preferences:', error);
      toast.error(t('errorSavingNotificationPreferences'));
    } finally {
      setLoading(false);
    }
  };

  const toggleChannel = (channel, value) => {
    setPreferences({
      ...preferences,
      [channel]: {
        ...preferences[channel],
        enabled: value
      }
    });
  };

  const toggleEvent = (channel, event, value) => {
    setPreferences({
      ...preferences,
      [channel]: {
        ...preferences[channel],
        events: {
          ...preferences[channel].events,
          [event]: value
        }
      }
    });
  };

  const connectIntegration = async (platform) => {
    toast.info(`Connecting to ${platform}...`);
    // This would typically redirect to an OAuth flow
  };

  useEffect(() => {
    fetchPreferences();
  }, []);

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('notifications')}</h1>
          <p className="text-muted-foreground">{t('manageNotificationPreferences')}</p>
        </div>
        <Button onClick={savePreferences} disabled={loading}>
          {loading ? t('saving') : t('savePreferences')}
        </Button>
      </div>

      <Tabs defaultValue="channels">
        <TabsList className="mb-4">
          <TabsTrigger value="channels">{t('notificationChannels')}</TabsTrigger>
          <TabsTrigger value="history">{t('notificationHistory')}</TabsTrigger>
          <TabsTrigger value="templates">{t('notificationTemplates')}</TabsTrigger>
        </TabsList>

        <TabsContent value="channels">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Email Notifications */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Mail className="h-6 w-6" />
                <div>
                  <CardTitle>{t('emailNotifications')}</CardTitle>
                  <CardDescription>{t('receiveUpdatesViaEmail')}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <Label htmlFor="email-toggle">{t('enableEmailNotifications')}</Label>
                  <Switch
                    id="email-toggle"
                    checked={preferences.email.enabled}
                    onCheckedChange={(value) => toggleChannel('email', value)}
                  />
                </div>
                <Separator className="my-4" />
                <div className="space-y-4">
                  {Object.entries(preferences.email.events).map(([event, enabled]) => (
                    <div key={event} className="flex items-center space-x-2">
                      <Checkbox
                        id={`email-${event}`}
                        checked={enabled}
                        disabled={!preferences.email.enabled}
                        onCheckedChange={(value) => toggleEvent('email', event, !!value)}
                      />
                      <Label htmlFor={`email-${event}`}>
                        {t(`event_${event}`)}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Push Notifications */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Bell className="h-6 w-6" />
                <div>
                  <CardTitle>{t('pushNotifications')}</CardTitle>
                  <CardDescription>{t('receiveUpdatesViaBrowser')}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <Label htmlFor="push-toggle">{t('enablePushNotifications')}</Label>
                  <Switch
                    id="push-toggle"
                    checked={preferences.push.enabled}
                    onCheckedChange={(value) => toggleChannel('push', value)}
                  />
                </div>
                <Separator className="my-4" />
                <div className="space-y-4">
                  {Object.entries(preferences.push.events).map(([event, enabled]) => (
                    <div key={event} className="flex items-center space-x-2">
                      <Checkbox
                        id={`push-${event}`}
                        checked={enabled}
                        disabled={!preferences.push.enabled}
                        onCheckedChange={(value) => toggleEvent('push', event, !!value)}
                      />
                      <Label htmlFor={`push-${event}`}>
                        {t(`event_${event}`)}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* SMS Notifications */}
            <FeatureToggle featureId="sms_notifications">
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <SmartphoneIcon className="h-6 w-6" />
                  <div>
                    <CardTitle>{t('smsNotifications')}</CardTitle>
                    <CardDescription>{t('receiveUpdatesViaSMS')}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <Label htmlFor="sms-toggle">{t('enableSmsNotifications')}</Label>
                    <Switch
                      id="sms-toggle"
                      checked={preferences.sms.enabled}
                      onCheckedChange={(value) => toggleChannel('sms', value)}
                    />
                  </div>
                  <Separator className="my-4" />
                  <div className="space-y-4">
                    {Object.entries(preferences.sms.events).map(([event, enabled]) => (
                      <div key={event} className="flex items-center space-x-2">
                        <Checkbox
                          id={`sms-${event}`}
                          checked={enabled}
                          disabled={!preferences.sms.enabled}
                          onCheckedChange={(value) => toggleEvent('sms', event, !!value)}
                        />
                        <Label htmlFor={`sms-${event}`}>
                          {t(`event_${event}`)}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </FeatureToggle>

            {/* Integration Cards */}
            <FeatureToggle featureId="integrations">
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Settings className="h-6 w-6" />
                  <div>
                    <CardTitle>{t('integrations')}</CardTitle>
                    <CardDescription>{t('connectWithThirdPartyServices')}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <MessageSquare className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Discord</p>
                        <p className="text-sm text-muted-foreground">
                          {preferences.discord.connected ? t('connected') : t('notConnected')}
                        </p>
                      </div>
                    </div>
                    {preferences.discord.connected ? (
                      <Switch
                        checked={preferences.discord.enabled}
                        onCheckedChange={(value) => toggleChannel('discord', value)}
                      />
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => connectIntegration('Discord')}>
                        {t('connect')}
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <MessageSquare className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Slack</p>
                        <p className="text-sm text-muted-foreground">
                          {preferences.slack.connected ? t('connected') : t('notConnected')}
                        </p>
                      </div>
                    </div>
                    {preferences.slack.connected ? (
                      <Switch
                        checked={preferences.slack.enabled}
                        onCheckedChange={(value) => toggleChannel('slack', value)}
                      />
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => connectIntegration('Slack')}>
                        {t('connect')}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </FeatureToggle>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>{t('notificationHistory')}</CardTitle>
              <CardDescription>{t('recentNotificationsSentToYou')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{t('lowStockAlert')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('product')} "Wireless Headphones" {t('isLowInStock')}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">2 {t('hoursAgo')}</span>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{t('newOrder')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('newOrderReceived')}: #ORD-12345
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">{t('yesterday')}</span>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{t('paymentReceived')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('paymentReceivedFor')} #INV-56789
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">3 {t('daysAgo')}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">{t('viewAllNotifications')}</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>{t('notificationTemplates')}</CardTitle>
              <CardDescription>{t('customizeNotificationMessages')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-6">
                {t('customizeTheContentOfNotificationMessages')}
              </p>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">{t('newOrderTemplate')}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {t('currentTemplate')}: "{t('newOrderReceived')}: {{order_id}}. {t('totalAmount')}: {{amount}}"
                  </p>
                  <Button variant="outline" size="sm">{t('customize')}</Button>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">{t('lowStockTemplate')}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {t('currentTemplate')}: "{t('product')} {{product_name}} {t('isLowInStock')}. {t('currentQuantity')}: {{quantity}}"
                  </p>
                  <Button variant="outline" size="sm">{t('customize')}</Button>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">{t('paymentReceivedTemplate')}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {t('currentTemplate')}: "{t('paymentReceivedFor')} {{invoice_id}}. {t('amount')}: {{amount}}"
                  </p>
                  <Button variant="outline" size="sm">{t('customize')}</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
