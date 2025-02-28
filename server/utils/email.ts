
import nodemailer from 'nodemailer';
import config from '../config';

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    content?: any;
    path?: string;
    contentType?: string;
  }>;
}

/**
 * Send an email
 * @param options Email options
 * @returns Promise that resolves when email is sent
 */
export async function sendEmail(options: EmailOptions): Promise<any> {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: config.mail.host,
    port: config.mail.port,
    secure: config.mail.secure,
    auth: {
      user: config.mail.auth.user,
      pass: config.mail.auth.pass,
    },
  });

  // Prepare email options
  const mailOptions = {
    from: options.from || config.mail.from,
    to: options.to,
    cc: options.cc,
    bcc: options.bcc,
    subject: options.subject,
    html: options.html,
    attachments: options.attachments,
  };

  // Send the email
  return transporter.sendMail(mailOptions);
}

/**
 * Send a template email
 * @param template Template name
 * @param data Template data
 * @param options Email options
 * @returns Promise that resolves when email is sent
 */
export async function sendTemplateEmail(
  template: string,
  data: Record<string, any>,
  options: EmailOptions
): Promise<any> {
  // This would typically use a template engine like handlebars or ejs
  // For now, we'll just use a simple function to simulate template rendering
  const renderedHtml = renderTemplate(template, data);
  
  return sendEmail({
    ...options,
    html: renderedHtml,
  });
}

/**
 * Render a template with data
 * @param template Template name
 * @param data Template data
 * @returns Rendered HTML
 */
function renderTemplate(template: string, data: Record<string, any>): string {
  // This is a very simple template renderer
  // In a real application, you would use a proper template engine
  let html = '';
  
  switch (template) {
    case 'welcome':
      html = `
        <h1>Welcome, ${data.name}!</h1>
        <p>Thank you for joining our platform.</p>
        <p>Click <a href="${data.verificationUrl}">here</a> to verify your email.</p>
      `;
      break;
    case 'password-reset':
      html = `
        <h1>Password Reset</h1>
        <p>You have requested a password reset.</p>
        <p>Click <a href="${data.resetUrl}">here</a> to reset your password.</p>
        <p>If you did not request this, please ignore this email.</p>
      `;
      break;
    case 'ticket-created':
      html = `
        <h1>Support Ticket Created</h1>
        <p>Your ticket #${data.ticketId} has been created.</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Priority:</strong> ${data.priority}</p>
        <p>We will get back to you as soon as possible.</p>
      `;
      break;
    default:
      html = `<p>No template found for "${template}"</p>`;
  }
  
  return html;
}
