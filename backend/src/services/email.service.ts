import nodemailer from 'nodemailer';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';

// Create transporter
const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: false, // true for 465, false for other ports
  auth: {
    user: config.smtp.user,
    pass: config.smtp.appPassword,
  },
});

// Verify connection
transporter.verify((error) => {
  if (error) {
    logger.error('SMTP connection failed', { error: error.message });
  } else {
    logger.info('SMTP server ready');
  }
});

// =============================================
// Email Templates
// =============================================

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

function getAdminNotificationEmail(
  type: string,
  data: Record<string, unknown>
): EmailTemplate {
  const fields = Object.entries(data)
    .map(([key, value]) => `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>${key}:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${value || 'N/A'}</td></tr>`)
    .join('');

  return {
    subject: `[Bits&Bytes Prayagraj] New ${type}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">Bits&Bytes Prayagraj</h1>
        </div>
        <div style="background: #ffffff; padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">New ${type} Received</h2>
          <table style="width: 100%; border-collapse: collapse;">
            ${fields}
            <tr>
              <td style="padding: 8px;"><strong>Submitted At:</strong></td>
              <td style="padding: 8px;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
            </tr>
          </table>
          <p style="margin-top: 20px; color: #666; font-size: 14px;">
            This is an automated notification from the Bits&Bytes Prayagraj website.
          </p>
        </div>
      </body>
      </html>
    `,
    text: `New ${type} Received\n\n${Object.entries(data).map(([k, v]) => `${k}: ${v || 'N/A'}`).join('\n')}\n\nSubmitted At: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`,
  };
}

function getUserConfirmationEmail(
  type: string,
  name: string
): EmailTemplate {
  const messages: Record<string, { title: string; message: string }> = {
    'Contact Form': {
      title: 'We received your message!',
      message: 'Thank you for reaching out to us. Our team will review your message and get back to you as soon as possible.',
    },
    'Join Application': {
      title: 'Application Received!',
      message: 'Thank you for your interest in joining Bits&Bytes Prayagraj! We\'ve received your application and will review it shortly. We\'ll be in touch soon with next steps.',
    },
    'Event Registration': {
      title: 'Registration Confirmed!',
      message: 'You\'ve successfully registered for the event. We\'ll send you more details closer to the event date. Get ready for an amazing experience!',
    },
    'Role Application': {
      title: 'Application Submitted!',
      message: 'Thank you for applying! We appreciate your interest in this role. Our team will review your application and contact you if your profile matches our requirements.',
    },
    'Feedback': {
      title: 'Thank you for your feedback!',
      message: 'We appreciate you taking the time to share your thoughts with us. Your feedback helps us improve and serve you better.',
    },
  };

  const content = messages[type] || {
    title: 'Submission Received',
    message: 'Thank you for your submission. We\'ll get back to you soon.',
  };

  return {
    subject: `[Bits&Bytes Prayagraj] ${content.title}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">Bits&Bytes Prayagraj</h1>
        </div>
        <div style="background: #ffffff; padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Hi ${name || 'there'},</h2>
          <p style="color: #555; font-size: 16px; line-height: 1.6;">${content.message}</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 14px; margin-bottom: 10px;">Best regards,</p>
            <p style="color: #667eea; font-weight: bold; margin: 0;">The Bits&Bytes Prayagraj Team</p>
          </div>
          <p style="margin-top: 20px; color: #999; font-size: 12px;">
            Bits&Bytes Prayagraj - Building a thriving developer community
          </p>
        </div>
      </body>
      </html>
    `,
    text: `Hi ${name || 'there'},\n\n${content.message}\n\nBest regards,\nThe Bits&Bytes Prayagraj Team\n\nBits&Bytes Prayagraj - Building a thriving developer community`,
  };
}

// =============================================
// Email Sending Functions
// =============================================

export async function sendAdminNotification(
  type: string,
  data: Record<string, unknown>
): Promise<boolean> {
  try {
    const template = getAdminNotificationEmail(type, data);
    
    await transporter.sendMail({
      from: `"Bits&Bytes Prayagraj" <${config.smtp.user}>`,
      to: config.adminEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    logger.info('Admin notification sent', { type });
    return true;
  } catch (error) {
    logger.error('Failed to send admin notification', { 
      type, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    return false;
  }
}

export async function sendUserConfirmation(
  type: string,
  email: string,
  name: string
): Promise<boolean> {
  try {
    const template = getUserConfirmationEmail(type, name);
    
    await transporter.sendMail({
      from: `"Bits&Bytes Prayagraj" <${config.smtp.user}>`,
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    logger.info('User confirmation sent', { type, email });
    return true;
  } catch (error) {
    logger.error('Failed to send user confirmation', { 
      type, 
      email,
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    return false;
  }
}

// Combined function for form submissions
export async function sendFormEmails(
  type: string,
  data: Record<string, unknown>,
  userEmail: string,
  userName: string
): Promise<{ adminSent: boolean; userSent: boolean }> {
  const [adminSent, userSent] = await Promise.all([
    sendAdminNotification(type, data),
    sendUserConfirmation(type, userEmail, userName),
  ]);

  return { adminSent, userSent };
}