
import nodemailer from 'nodemailer';
import Integration from '../models/integration.model';
import config from '../config';

// Email sending interface
interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: any[];
}

// Email result interface
interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send an email
 * @param options Email options
 * @returns Email result
 */
export const sendEmail = async (options: EmailOptions): Promise<EmailResult> => {
  try {
    // Get email transport
    const transport = await getEmailTransport();
    
    // Set default from address if not provided
    if (!options.from) {
      options.from = config.email?.defaultFrom || 'noreply@example.com';
    }
    
    // Set plain text version if not provided
    if (!options.text && options.html) {
      // This is a very basic conversion, in a real app you'd use a proper HTML to text converter
      options.text = options.html.replace(/<[^>]*>/g, '');
    }
    
    // Send email
    const result = await transport.sendMail(options);
    
    return {
      success: true,
      messageId: result.messageId
    };
  } catch (error) {
    console.error('Email sending error:', error);
    
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get email transport
 * @returns Nodemailer transport
 */
const getEmailTransport = async () => {
  // In production, you would use a real SMTP server or email service
  // For development, we'll use a test account from Ethereal
  
  // Check if we have configured SMTP settings
  if (config.email?.smtp?.host) {
    return nodemailer.createTransport({
      host: config.email.smtp.host,
      port: config.email.smtp.port || 587,
      secure: config.email.smtp.secure || false,
      auth: {
        user: config.email.smtp.user,
        pass: config.email.smtp.pass
      }
    });
  }
  
  // If no SMTP settings, create a test account
  const testAccount = await nodemailer.createTestAccount();
  
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });
};

/**
 * Send a template email
 * @param templateName Template name
 * @param to Recipient email
 * @param data Template data
 * @param options Additional email options
 * @returns Email result
 */
export const sendTemplateEmail = async (
  templateName: string,
  to: string | string[],
  data: any,
  options: Partial<EmailOptions> = {}
): Promise<EmailResult> => {
  try {
    // In a real app, you would render a template here
    // For now, we'll use a simple implementation
    
    let subject = '';
    let html = '';
    
    // Set subject and html based on template name
    switch (templateName) {
      case 'welcome':
        subject = `Welcome to ${data.companyName || 'our platform'}`;
        html = `<h1>Welcome, ${data.name}!</h1><p>Thanks for joining us.</p>`;
        break;
      case 'invoice':
        subject = `Invoice #${data.invoiceNumber} from ${data.companyName}`;
        html = `<h1>Invoice #${data.invoiceNumber}</h1><p>Amount: ${data.amount}</p>`;
        break;
      case 'password_reset':
        subject = 'Password Reset Request';
        html = `<h1>Reset Your Password</h1><p>Click <a href="${data.resetLink}">here</a> to reset your password.</p>`;
        break;
      default:
        subject = options.subject || 'Notification';
        html = `<p>${JSON.stringify(data)}</p>`;
    }
    
    // Send email
    return sendEmail({
      to,
      subject: options.subject || subject,
      html: options.html || html,
      ...options
    });
  } catch (error) {
    console.error('Template email sending error:', error);
    
    return {
      success: false,
      error: error.message
    };
  }
};

export const emailService = {
  sendEmail,
  sendTemplateEmail
};
