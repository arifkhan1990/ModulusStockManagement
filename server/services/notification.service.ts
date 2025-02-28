
import { Types } from 'mongoose';
import Notification from '../models/notification.model';
import NotificationPreference from '../models/notification-preference.model';
import Integration from '../models/integration.model';
import SystemLog from '../models/system-log.model';
import { emailService } from './email.service';

/**
 * Queue a notification for processing
 * @param notificationId Notification ID
 */
export const queueNotification = async (notificationId: Types.ObjectId | string): Promise<boolean> => {
  try {
    // In a production environment, this would be sent to a message queue
    // For now, we'll process it directly
    await processNotification(notificationId);
    return true;
  } catch (error) {
    console.error('Error queueing notification:', error);
    return false;
  }
};

/**
 * Process a notification
 * @param notificationId Notification ID
 */
export const processNotification = async (notificationId: Types.ObjectId | string): Promise<boolean> => {
  try {
    // Get notification
    const notification = await Notification.findById(notificationId);
    
    if (!notification) {
      throw new Error(`Notification not found: ${notificationId}`);
    }
    
    // Get notification preference
    const preference = await NotificationPreference.findOne({
      companyId: notification.companyId,
      eventType: notification.eventType,
      recipientType: notification.recipientType
    });
    
    // Skip if notifications are disabled for this event type
    if (preference && !preference.enabled) {
      notification.status = 'failed';
      notification.errorMessage = 'Notifications are disabled for this event type';
      await notification.save();
      return false;
    }
    
    // Skip if this channel is disabled
    if (preference && !preference.channels[notification.channel]) {
      notification.status = 'failed';
      notification.errorMessage = `${notification.channel} channel is disabled for this event type`;
      await notification.save();
      return false;
    }
    
    // Send notification based on channel
    let success = false;
    
    switch (notification.channel) {
      case 'email':
        success = await sendEmailNotification(notification, preference);
        break;
      case 'sms':
        success = await sendSmsNotification(notification, preference);
        break;
      case 'push':
        success = await sendPushNotification(notification, preference);
        break;
      case 'messenger':
        success = await sendMessengerNotification(notification, preference);
        break;
      case 'discord':
        success = await sendDiscordNotification(notification, preference);
        break;
      case 'whatsapp':
        success = await sendWhatsappNotification(notification, preference);
        break;
      case 'telegram':
        success = await sendTelegramNotification(notification, preference);
        break;
      default:
        notification.status = 'failed';
        notification.errorMessage = `Unsupported channel: ${notification.channel}`;
        await notification.save();
        return false;
    }
    
    // Update notification status
    if (success) {
      notification.status = 'sent';
      notification.sentAt = new Date();
    } else {
      notification.status = 'failed';
      notification.retryCount += 1;
    }
    
    notification.updatedAt = new Date();
    await notification.save();
    
    // Log the notification
    await SystemLog.create({
      companyId: notification.companyId,
      userId: notification.userId,
      action: `notification_${success ? 'sent' : 'failed'}`,
      entity: 'notification',
      entityId: notification._id,
      details: {
        channel: notification.channel,
        eventType: notification.eventType,
        recipientType: notification.recipientType,
        success
      },
      createdAt: new Date()
    });
    
    return success;
  } catch (error) {
    console.error('Error processing notification:', error);
    
    // Update notification status on error
    try {
      await Notification.findByIdAndUpdate(notificationId, {
        status: 'failed',
        errorMessage: error.message,
        retryCount: { $inc: 1 },
        updatedAt: new Date()
      });
    } catch (updateError) {
      console.error('Error updating notification status:', updateError);
    }
    
    return false;
  }
};

/**
 * Send an email notification
 * @param notification Notification object
 * @param preference Notification preference
 * @returns Success status
 */
const sendEmailNotification = async (notification, preference): Promise<boolean> => {
  try {
    // Get email integration
    const integration = await Integration.findOne({
      companyId: notification.companyId,
      type: 'email',
      isEnabled: true
    });
    
    if (!integration) {
      notification.errorMessage = 'Email integration not configured';
      return false;
    }
    
    // Get email template
    const subject = preference?.templates?.email?.subject || notification.title;
    const body = preference?.templates?.email?.body || notification.content;
    
    // Send email
    const result = await emailService.sendEmail({
      to: notification.recipientEmail,
      subject: interpolateVariables(subject, notification),
      html: interpolateVariables(body, notification),
      from: integration.config.fromEmail || 'noreply@example.com',
      attachments: notification.metadata.attachments || []
    });
    
    if (!result.success) {
      notification.errorMessage = result.error;
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Email notification error:', error);
    notification.errorMessage = error.message;
    return false;
  }
};

/**
 * Send an SMS notification
 * @param notification Notification object
 * @param preference Notification preference
 * @returns Success status
 */
const sendSmsNotification = async (notification, preference): Promise<boolean> => {
  try {
    // Get SMS integration
    const integration = await Integration.findOne({
      companyId: notification.companyId,
      type: 'sms',
      isEnabled: true
    });
    
    if (!integration) {
      notification.errorMessage = 'SMS integration not configured';
      return false;
    }
    
    // Get SMS template
    const body = preference?.templates?.sms?.body || notification.content;
    
    // In a real implementation, we would call the SMS provider API here
    // For now, just log it
    console.log('Sending SMS to:', notification.recipientPhone);
    console.log('SMS body:', interpolateVariables(body, notification));
    
    // Simulate success
    return true;
  } catch (error) {
    console.error('SMS notification error:', error);
    notification.errorMessage = error.message;
    return false;
  }
};

/**
 * Send a push notification
 * @param notification Notification object
 * @param preference Notification preference
 * @returns Success status
 */
const sendPushNotification = async (notification, preference): Promise<boolean> => {
  try {
    // Get push integration
    const integration = await Integration.findOne({
      companyId: notification.companyId,
      type: 'push',
      isEnabled: true
    });
    
    if (!integration) {
      notification.errorMessage = 'Push notification integration not configured';
      return false;
    }
    
    // Get push template
    const title = preference?.templates?.push?.title || notification.title;
    const body = preference?.templates?.push?.body || notification.content;
    
    // In a real implementation, we would call the FCM API here
    // For now, just log it
    console.log('Sending push notification to recipient:', notification.recipientId);
    console.log('Push title:', interpolateVariables(title, notification));
    console.log('Push body:', interpolateVariables(body, notification));
    
    // Simulate success
    return true;
  } catch (error) {
    console.error('Push notification error:', error);
    notification.errorMessage = error.message;
    return false;
  }
};

/**
 * Send a Facebook Messenger notification
 * @param notification Notification object
 * @param preference Notification preference
 * @returns Success status
 */
const sendMessengerNotification = async (notification, preference): Promise<boolean> => {
  try {
    // Get Messenger integration
    const integration = await Integration.findOne({
      companyId: notification.companyId,
      type: 'messenger',
      isEnabled: true
    });
    
    if (!integration) {
      notification.errorMessage = 'Messenger integration not configured';
      return false;
    }
    
    // Get Messenger template
    const body = preference?.templates?.messenger?.body || notification.content;
    
    // In a real implementation, we would call the Messenger API here
    // For now, just log it
    console.log('Sending Messenger notification to recipient:', notification.recipientId);
    console.log('Messenger body:', interpolateVariables(body, notification));
    
    // Simulate success
    return true;
  } catch (error) {
    console.error('Messenger notification error:', error);
    notification.errorMessage = error.message;
    return false;
  }
};

/**
 * Send a Discord notification
 * @param notification Notification object
 * @param preference Notification preference
 * @returns Success status
 */
const sendDiscordNotification = async (notification, preference): Promise<boolean> => {
  try {
    // Get Discord integration
    const integration = await Integration.findOne({
      companyId: notification.companyId,
      type: 'discord',
      isEnabled: true
    });
    
    if (!integration) {
      notification.errorMessage = 'Discord integration not configured';
      return false;
    }
    
    // Get Discord template
    const body = preference?.templates?.discord?.body || notification.content;
    
    // Decrypt webhook URL
    const credentials = await integration.getDecryptedCredentials();
    
    if (!credentials.webhookUrl) {
      notification.errorMessage = 'Discord webhook URL not configured';
      return false;
    }
    
    // In a real implementation, we would call the Discord webhook API here
    // For now, just log it
    console.log('Sending Discord notification to webhook');
    console.log('Discord body:', interpolateVariables(body, notification));
    
    // Simulate success
    return true;
  } catch (error) {
    console.error('Discord notification error:', error);
    notification.errorMessage = error.message;
    return false;
  }
};

/**
 * Send a WhatsApp notification
 * @param notification Notification object
 * @param preference Notification preference
 * @returns Success status
 */
const sendWhatsappNotification = async (notification, preference): Promise<boolean> => {
  try {
    // Get WhatsApp integration
    const integration = await Integration.findOne({
      companyId: notification.companyId,
      type: 'whatsapp',
      isEnabled: true
    });
    
    if (!integration) {
      notification.errorMessage = 'WhatsApp integration not configured';
      return false;
    }
    
    // Get WhatsApp template
    const body = preference?.templates?.whatsapp?.body || notification.content;
    
    // In a real implementation, we would call the WhatsApp Business API here
    // For now, just log it
    console.log('Sending WhatsApp notification to:', notification.recipientPhone);
    console.log('WhatsApp body:', interpolateVariables(body, notification));
    
    // Simulate success
    return true;
  } catch (error) {
    console.error('WhatsApp notification error:', error);
    notification.errorMessage = error.message;
    return false;
  }
};

/**
 * Send a Telegram notification
 * @param notification Notification object
 * @param preference Notification preference
 * @returns Success status
 */
const sendTelegramNotification = async (notification, preference): Promise<boolean> => {
  try {
    // Get Telegram integration
    const integration = await Integration.findOne({
      companyId: notification.companyId,
      type: 'telegram',
      isEnabled: true
    });
    
    if (!integration) {
      notification.errorMessage = 'Telegram integration not configured';
      return false;
    }
    
    // Get Telegram template
    const body = preference?.templates?.telegram?.body || notification.content;
    
    // In a real implementation, we would call the Telegram Bot API here
    // For now, just log it
    console.log('Sending Telegram notification to chat ID:', notification.metadata.telegramChatId);
    console.log('Telegram body:', interpolateVariables(body, notification));
    
    // Simulate success
    return true;
  } catch (error) {
    console.error('Telegram notification error:', error);
    notification.errorMessage = error.message;
    return false;
  }
};

/**
 * Interpolate variables in a template string
 * @param template Template string with variables like {{variableName}}
 * @param notification Notification object
 * @returns Interpolated string
 */
const interpolateVariables = (template: string, notification): string => {
  if (!template) return '';
  
  let result = template;
  
  // Basic variables
  const variables = {
    company: notification.metadata.companyName || 'Company',
    recipient: notification.metadata.recipientName || 'Customer',
    eventType: notification.eventType.replace(/_/g, ' '),
    details: notification.content,
    ...notification.metadata
  };
  
  // Replace variables
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }
  
  return result;
};

export const notificationService = {
  queueNotification,
  processNotification
};
