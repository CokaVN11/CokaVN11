/**
ABOUTME: Email service module for sending contact form notifications
Handles email composition and delivery via Resend API
*/

import { Resend } from 'resend';
import type { ContactPayload } from '@/schemas/contact';

const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL;
const FROM_EMAIL = process.env.FROM_EMAIL;

// Initialize Resend client only when API key is available
function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('RESEND_API_KEY not configured - email notifications disabled');
    return null;
  }
  return new Resend(apiKey);
}

interface EmailTemplate {
  subject: string;
  html: string;
}

export function createContactEmail(data: ContactPayload): EmailTemplate {
  const subject = `New Portfolio Message from ${data.name}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Form Message</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .message-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
        .field { margin: 15px 0; }
        .label { font-weight: 600; color: #555; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📬 New Contact Form Submission</h1>
          <p>Someone has reached out through your portfolio!</p>
        </div>

        <div class="content">
          <div class="message-box">
            <div class="field">
              <span class="label">From:</span> ${data.name} &lt;${data.email}&gt;
            </div>
            <div class="field">
              <span class="label">Sent:</span> ${new Date().toLocaleString()}
            </div>
          </div>

          <div class="message-box">
            <h3>💬 Message:</h3>
            <p style="white-space: pre-wrap; font-size: 16px;">${data.message}</p>
          </div>

          <div class="footer">
            <p>This message was sent from your portfolio contact form.</p>
            <p style="font-size: 12px; color: #999;">
              Please respond in a timely manner to maintain professional relationships.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, html };
}

export async function sendContactNotificationEmail(data: ContactPayload): Promise<void> {
  // Check if email configuration is available
  if (!RECIPIENT_EMAIL || !FROM_EMAIL) {
    console.warn('Email environment variables not configured - skipping email notification');
    return;
  }

  // Get Resend client (returns null if API key not configured)
  const resend = getResendClient();
  if (!resend) {
    console.warn('Resend not available - skipping email notification');
    return;
  }

  const email = createContactEmail(data);

  try {
    const { data: result, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [RECIPIENT_EMAIL],
      subject: email.subject,
      html: email.html,
      replyTo: data.email, // Allow direct replies to the sender
    });

    if (error) {
      console.error('Resend API error:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log('Email sent successfully:', result.id);
  } catch (error) {
    console.error('Error sending contact notification email:', error);
    // Don't throw the error - let the API continue even if email fails
    // The contact message is still saved to the database
  }
}
