import nodemailer, { type Transporter } from 'nodemailer';

// Email transporter configuration from environment variables
const smtpHost = process.env.SMTP_HOST;
const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpSecure = process.env.SMTP_SECURE === 'true' || smtpPort === 465;

const adminNotificationEmail = 
  process.env.ADMIN_NOTIFICATION_EMAIL || 
  process.env.ADMIN_EMAIL || 
  'admin@liscloud.io';

const emailFrom = process.env.EMAIL_FROM || `"LIS Cloud Consulting" <${smtpUser || 'notifications@liscloud.io'}>`;

// Notification log store for previewing in dev or admin UI
export interface EmailLogEntry {
  id: string;
  type: 'consultation' | 'job_application' | 'newsletter' | 'test';
  to: string;
  subject: string;
  summary: string;
  sentAt: string;
  status: 'sent' | 'simulated' | 'failed';
  error?: string;
}

const recentEmailLogs: EmailLogEntry[] = [];

export function getRecentEmailLogs(): EmailLogEntry[] {
  return recentEmailLogs.slice(0, 50);
}

function recordEmailLog(entry: EmailLogEntry) {
  recentEmailLogs.unshift(entry);
  if (recentEmailLogs.length > 100) {
    recentEmailLogs.pop();
  }
}

// Create nodemailer transporter if credentials are provided
let transporter: Transporter | null = null;

if (smtpHost && smtpUser && smtpPass) {
  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
}

/**
 * Dispatches an email, using SMTP if configured, or logs the full email safely
 * to console and the notification log if SMTP credentials are not yet set in environment.
 */
async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
  text: string;
  type: EmailLogEntry['type'];
  summary: string;
}): Promise<{ success: boolean; simulated: boolean; messageId?: string }> {
  const logId = `eml_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: emailFrom,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });

      console.log(`[Email Service] Email sent successfully (${options.type}) to ${options.to}, messageId: ${info.messageId}`);
      recordEmailLog({
        id: logId,
        type: options.type,
        to: options.to,
        subject: options.subject,
        summary: options.summary,
        sentAt: new Date().toISOString(),
        status: 'sent',
      });
      return { success: true, simulated: false, messageId: info.messageId };
    } catch (error: any) {
      console.error(`[Email Service] Failed to send email via SMTP:`, error);
      recordEmailLog({
        id: logId,
        type: options.type,
        to: options.to,
        subject: options.subject,
        summary: options.summary,
        sentAt: new Date().toISOString(),
        status: 'failed',
        error: error.message || 'SMTP delivery failed',
      });
      return { success: false, simulated: false };
    }
  } else {
    // Graceful fallback when SMTP credentials are not set in environment
    console.log(`[Email Service] (Simulated Mode - No SMTP configured)`);
    console.log(`[Email Service] To: ${options.to}`);
    console.log(`[Email Service] Subject: ${options.subject}`);
    console.log(`[Email Service] Summary: ${options.summary}`);

    recordEmailLog({
      id: logId,
      type: options.type,
      to: options.to,
      subject: options.subject,
      summary: options.summary,
      sentAt: new Date().toISOString(),
      status: 'simulated',
    });

    return { success: true, simulated: true };
  }
}

/**
 * Triggers admin email notification for a new consultation request
 */
export async function sendConsultationNotification(record: {
  ticketId: string;
  fullName: string;
  email: string;
  company: string;
  phone?: string | null;
  cloudPlatform: string;
  monthlySpend: string;
  serviceType: string;
  message?: string | null;
  createdAt?: Date | string | null;
}) {
  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  const adminDashboardUrl = `${appUrl}/admin#consultations?ticket=${record.ticketId}`;

  const subject = `[New Consultation Request] ${record.ticketId} - ${record.company} (${record.fullName})`;
  const summary = `New consultation request from ${record.fullName} at ${record.company} for ${record.cloudPlatform} (${record.serviceType})`;

  const text = `
NEW ARCHITECTURE CONSULTATION REQUEST
------------------------------------
Ticket ID: ${record.ticketId}
Full Name: ${record.fullName}
Email: ${record.email}
Company: ${record.company}
Phone: ${record.phone || 'N/A'}
Cloud Platform: ${record.cloudPlatform}
Monthly Spend: ${record.monthlySpend}
Service Type: ${record.serviceType}
Message: ${record.message || 'No additional message provided'}

View in Admin Dashboard:
${adminDashboardUrl}
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; }
    .header { background: #0f172a; color: #ffffff; padding: 24px; text-align: left; }
    .header h1 { margin: 0 0 4px 0; font-size: 20px; font-weight: 700; color: #38bdf8; }
    .header p { margin: 0; font-size: 13px; color: #94a3b8; }
    .body { padding: 24px; }
    .badge { display: inline-block; padding: 4px 10px; background: #eff6ff; color: #1d4ed8; font-weight: 600; font-size: 12px; border-radius: 4px; margin-bottom: 16px; }
    .field-row { margin-bottom: 12px; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; }
    .label { font-size: 12px; font-weight: 600; text-transform: uppercase; color: #64748b; margin-bottom: 2px; }
    .value { font-size: 14px; color: #0f172a; font-weight: 500; }
    .message-box { background: #f8fafc; border-left: 4px solid #3b82f6; padding: 12px 16px; margin: 16px 0; font-size: 14px; color: #334155; line-height: 1.5; }
    .btn { display: inline-block; background: #2563eb; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 14px; margin-top: 16px; }
    .footer { background: #f1f5f9; padding: 16px 24px; font-size: 12px; color: #64748b; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>LIS Cloud Consulting</h1>
      <p>Enterprise Solutions Architecture Inbound Alert</p>
    </div>
    <div class="body">
      <span class="badge">Ticket #${record.ticketId}</span>
      <h2 style="margin: 0 0 16px; font-size: 18px; color: #0f172a;">New Consultation Request Received</h2>
      
      <div class="field-row">
        <div class="label">Client Name</div>
        <div class="value">${record.fullName}</div>
      </div>
      <div class="field-row">
        <div class="label">Work Email</div>
        <div class="value"><a href="mailto:${record.email}" style="color: #2563eb;">${record.email}</a></div>
      </div>
      <div class="field-row">
        <div class="label">Organization / Company</div>
        <div class="value">${record.company}</div>
      </div>
      <div class="field-row">
        <div class="label">Phone</div>
        <div class="value">${record.phone || 'Not provided'}</div>
      </div>
      <div class="field-row">
        <div class="label">Cloud Ecosystem</div>
        <div class="value"><strong>${record.cloudPlatform}</strong></div>
      </div>
      <div class="field-row">
        <div class="label">Estimated Monthly Spend</div>
        <div class="value">${record.monthlySpend}</div>
      </div>
      <div class="field-row">
        <div class="label">Requested Practice</div>
        <div class="value">${record.serviceType}</div>
      </div>

      <div class="label" style="margin-top: 16px;">Client Objectives & Architecture Scope</div>
      <div class="message-box">
        ${record.message ? record.message.replace(/\n/g, '<br/>') : '<em>No message supplied.</em>'}
      </div>

      <div style="text-align: center; margin: 24px 0 8px;">
        <a href="${adminDashboardUrl}" class="btn">Open in Admin Dashboard &rarr;</a>
      </div>
    </div>
    <div class="footer">
      Connected to Azure PostgreSQL (asia-southeast1) &bull; LIS Cloud Consulting Enterprise Admin
    </div>
  </div>
</body>
</html>
  `.trim();

  return await sendEmail({
    to: adminNotificationEmail,
    subject,
    summary,
    text,
    html,
    type: 'consultation',
  });
}

/**
 * Triggers admin email notification for a new career job application
 */
export async function sendJobApplicationNotification(record: {
  id: number;
  jobId: string;
  jobTitle: string;
  applicantName: string;
  email: string;
  phone?: string | null;
  linkedIn?: string | null;
  notes?: string | null;
}) {
  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  const adminDashboardUrl = `${appUrl}/admin#careers?appId=${record.id}`;

  const subject = `[New Job Application] ${record.applicantName} - ${record.jobTitle}`;
  const summary = `New application from ${record.applicantName} for ${record.jobTitle} (${record.email})`;

  const text = `
NEW CAREER APPLICATION RECEIVED
-------------------------------
Role: ${record.jobTitle} (Job ID: ${record.jobId})
Applicant Name: ${record.applicantName}
Email: ${record.email}
Phone: ${record.phone || 'N/A'}
LinkedIn: ${record.linkedIn || 'N/A'}
Notes: ${record.notes || 'None'}

View in Admin Dashboard:
${adminDashboardUrl}
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; }
    .header { background: #0f172a; color: #ffffff; padding: 24px; text-align: left; }
    .header h1 { margin: 0 0 4px 0; font-size: 20px; font-weight: 700; color: #a855f7; }
    .header p { margin: 0; font-size: 13px; color: #94a3b8; }
    .body { padding: 24px; }
    .badge { display: inline-block; padding: 4px 10px; background: #faf5ff; color: #7e22ce; font-weight: 600; font-size: 12px; border-radius: 4px; margin-bottom: 16px; }
    .field-row { margin-bottom: 12px; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; }
    .label { font-size: 12px; font-weight: 600; text-transform: uppercase; color: #64748b; margin-bottom: 2px; }
    .value { font-size: 14px; color: #0f172a; font-weight: 500; }
    .btn { display: inline-block; background: #7e22ce; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 14px; margin-top: 16px; }
    .footer { background: #f1f5f9; padding: 16px 24px; font-size: 12px; color: #64748b; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>LIS Cloud Consulting &bull; Talent Acquisition</h1>
      <p>Engineering & Solutions Architect Application Alert</p>
    </div>
    <div class="body">
      <span class="badge">${record.jobTitle}</span>
      <h2 style="margin: 0 0 16px; font-size: 18px; color: #0f172a;">Candidate Application: ${record.applicantName}</h2>
      
      <div class="field-row">
        <div class="label">Applicant Name</div>
        <div class="value">${record.applicantName}</div>
      </div>
      <div class="field-row">
        <div class="label">Email Address</div>
        <div class="value"><a href="mailto:${record.email}" style="color: #7e22ce;">${record.email}</a></div>
      </div>
      <div class="field-row">
        <div class="label">Phone</div>
        <div class="value">${record.phone || 'Not provided'}</div>
      </div>
      <div class="field-row">
        <div class="label">LinkedIn Profile</div>
        <div class="value">${record.linkedIn ? `<a href="${record.linkedIn}" target="_blank" style="color: #7e22ce;">${record.linkedIn}</a>` : 'Not provided'}</div>
      </div>

      <div class="label" style="margin-top: 16px;">Candidate Background & Notes</div>
      <div style="background: #f8fafc; border-left: 4px solid #a855f7; padding: 12px 16px; margin: 8px 0 16px; font-size: 14px; color: #334155;">
        ${record.notes ? record.notes.replace(/\n/g, '<br/>') : '<em>No notes supplied.</em>'}
      </div>

      <div style="text-align: center; margin: 24px 0 8px;">
        <a href="${adminDashboardUrl}" class="btn">Review Application in Admin &rarr;</a>
      </div>
    </div>
    <div class="footer">
      Connected to Azure PostgreSQL &bull; LIS Cloud Consulting Talent Acquisition
    </div>
  </div>
</body>
</html>
  `.trim();

  return await sendEmail({
    to: adminNotificationEmail,
    subject,
    summary,
    text,
    html,
    type: 'job_application',
  });
}

/**
 * Triggers optional admin email notification for a new newsletter subscriber
 */
export async function sendNewsletterNotification(record: {
  email: string;
  source?: string;
  subscriberName?: string | null;
}) {
  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  const adminDashboardUrl = `${appUrl}/admin#newsletter`;

  const subject = `[New Newsletter Subscriber] ${record.email}`;
  const summary = `New newsletter subscriber: ${record.email} (Source: ${record.source || 'footer'})`;

  const text = `
NEW NEWSLETTER SUBSCRIBER
-------------------------
Email: ${record.email}
Name: ${record.subscriberName || 'Not provided'}
Source: ${record.source || 'website'}

View in Admin Dashboard:
${adminDashboardUrl}
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; padding: 20px; color: #1e293b;">
  <div style="max-width: 500px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;">
    <h3 style="color: #0f172a; margin-top: 0;">New Executive Cloud Briefing Subscriber</h3>
    <p><strong>Email:</strong> ${record.email}</p>
    <p><strong>Name:</strong> ${record.subscriberName || 'N/A'}</p>
    <p><strong>Source:</strong> ${record.source || 'footer'}</p>
    <p style="margin-top: 20px;"><a href="${adminDashboardUrl}" style="background: #0f172a; color: #ffffff; padding: 8px 16px; text-decoration: none; border-radius: 4px;">View Subscribers in Admin</a></p>
  </div>
</body>
</html>
  `.trim();

  return await sendEmail({
    to: adminNotificationEmail,
    subject,
    summary,
    text,
    html,
    type: 'newsletter',
  });
}

/**
 * Sends a test email to verify SMTP configuration
 */
export async function sendTestEmail(recipientEmail?: string) {
  const target = recipientEmail || adminNotificationEmail;
  return await sendEmail({
    to: target,
    subject: `[LIS Admin Test] Email System Diagnostic (${new Date().toLocaleTimeString()})`,
    summary: `Diagnostic test email sent to ${target}`,
    text: `LIS Cloud Consulting admin email test delivered successfully. System is operational.`,
    html: `<div style="font-family: sans-serif; padding: 20px;"><h3>LIS Cloud Consulting Admin Email Test</h3><p>Your email notification pipeline is properly connected and operating.</p></div>`,
    type: 'test',
  });
}
