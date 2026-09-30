import { Router } from 'express';
import { 
  requireAdminAuth, 
  authenticateAdmin, 
  createAdminToken, 
  AdminRequest 
} from './adminAuth.ts';
import { 
  getAdminConsultations, 
  getConsultationByTicketId, 
  updateConsultationStatus, 
  getAdminJobApplications, 
  getJobApplicationById, 
  updateJobApplicationStatus, 
  getAdminNewsletterSubscribers, 
  getAdminOverview 
} from '../db/queries.ts';
import { 
  getRecentEmailLogs, 
  sendTestEmail 
} from './email.ts';

export const adminRouter = Router();

// --- Admin Authentication ---

// Admin Login
adminRouter.post('/login', async (req, res) => {
  try {
    const { email, password, isDemo } = req.body;

    if (isDemo) {
      const demoUser = {
        id: 'admin_demo_superadmin',
        email: process.env.ADMIN_EMAIL || 'admin@liscloud.io',
        name: 'Principal Cloud Architect (Admin)',
        role: 'superadmin' as const,
        authenticatedAt: new Date().toISOString(),
      };
      const token = createAdminToken(demoUser);
      return res.json({ success: true, token, user: demoUser });
    }

    if (!email) {
      return res.status(400).json({ error: 'Admin email is required.' });
    }

    const authResult = await authenticateAdmin(email, password);
    if (!authResult.success || !authResult.user) {
      return res.status(401).json({ error: authResult.error || 'Invalid admin credentials' });
    }

    const token = createAdminToken(authResult.user);
    res.json({
      success: true,
      token,
      user: authResult.user,
    });
  } catch (error: any) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: error.message || 'Admin authentication failed' });
  }
});

// Admin Verify Profile
adminRouter.get('/me', requireAdminAuth, (req: AdminRequest, res) => {
  res.json({
    authenticated: true,
    user: req.adminUser,
    configuredNotificationEmail: process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || 'admin@liscloud.io',
    smtpConfigured: Boolean(process.env.SMTP_HOST && process.env.SMTP_USER),
  });
});

// Admin Logout
adminRouter.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// --- Protected Admin Dashboard Endpoints ---

// 1. Overview & Summary metrics
adminRouter.get('/overview', requireAdminAuth, async (req: AdminRequest, res) => {
  try {
    const data = await getAdminOverview();
    res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error('Failed to get admin overview:', error);
    res.status(500).json({ error: error.message || 'Failed to load metrics' });
  }
});

// 2. Consultation Requests (Search, Filter, Pagination)
adminRouter.get('/consultations', requireAdminAuth, async (req: AdminRequest, res) => {
  try {
    const { search, status, cloudPlatform, page, limit } = req.query;
    const result = await getAdminConsultations({
      search: typeof search === 'string' ? search : undefined,
      status: typeof status === 'string' ? status : undefined,
      cloudPlatform: typeof cloudPlatform === 'string' ? cloudPlatform : undefined,
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 10,
    });

    res.json({
      success: true,
      records: result.records,
      pagination: result.pagination,
    });
  } catch (error: any) {
    console.error('Admin query consultations failed:', error);
    res.status(500).json({ error: error.message || 'Failed to load consultation records' });
  }
});

// Single Consultation Detail
adminRouter.get('/consultations/:ticketId', requireAdminAuth, async (req: AdminRequest, res) => {
  try {
    const { ticketId } = req.params;
    const record = await getConsultationByTicketId(ticketId);
    if (!record) {
      return res.status(404).json({ error: 'Consultation request not found' });
    }
    res.json({ success: true, record });
  } catch (error: any) {
    console.error('Admin get consultation details failed:', error);
    res.status(500).json({ error: error.message || 'Failed to load record details' });
  }
});

// Update Consultation Status
adminRouter.patch('/consultations/:ticketId/status', requireAdminAuth, async (req: AdminRequest, res) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const updated = await updateConsultationStatus(ticketId, status);
    if (!updated) {
      return res.status(404).json({ error: 'Consultation request not found' });
    }

    res.json({ success: true, record: updated });
  } catch (error: any) {
    console.error('Admin update consultation status failed:', error);
    res.status(500).json({ error: error.message || 'Failed to update status' });
  }
});

// 3. Job Applications (Search, Filter, Pagination)
adminRouter.get('/job-applications', requireAdminAuth, async (req: AdminRequest, res) => {
  try {
    const { search, status, page, limit } = req.query;
    const result = await getAdminJobApplications({
      search: typeof search === 'string' ? search : undefined,
      status: typeof status === 'string' ? status : undefined,
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 10,
    });

    res.json({
      success: true,
      records: result.records,
      pagination: result.pagination,
    });
  } catch (error: any) {
    console.error('Admin query job applications failed:', error);
    res.status(500).json({ error: error.message || 'Failed to load job applications' });
  }
});

// Single Job Application Detail
adminRouter.get('/job-applications/:id', requireAdminAuth, async (req: AdminRequest, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid application ID' });
    }

    const record = await getJobApplicationById(id);
    if (!record) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json({ success: true, record });
  } catch (error: any) {
    console.error('Admin get job application failed:', error);
    res.status(500).json({ error: error.message || 'Failed to load application details' });
  }
});

// Update Job Application Status
adminRouter.patch('/job-applications/:id/status', requireAdminAuth, async (req: AdminRequest, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;

    if (isNaN(id) || !status) {
      return res.status(400).json({ error: 'Valid ID and status are required' });
    }

    const updated = await updateJobApplicationStatus(id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json({ success: true, record: updated });
  } catch (error: any) {
    console.error('Admin update job status failed:', error);
    res.status(500).json({ error: error.message || 'Failed to update job status' });
  }
});

// 4. Newsletter Subscribers (Search, Filter, Pagination)
adminRouter.get('/newsletter-subscribers', requireAdminAuth, async (req: AdminRequest, res) => {
  try {
    const { search, source, page, limit } = req.query;
    const result = await getAdminNewsletterSubscribers({
      search: typeof search === 'string' ? search : undefined,
      source: typeof source === 'string' ? source : undefined,
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 10,
    });

    res.json({
      success: true,
      records: result.records,
      pagination: result.pagination,
    });
  } catch (error: any) {
    console.error('Admin query newsletter subscribers failed:', error);
    res.status(500).json({ error: error.message || 'Failed to load subscribers' });
  }
});

// 5. Email Logs & Status Diagnostics
adminRouter.get('/email-logs', requireAdminAuth, (req: AdminRequest, res) => {
  const logs = getRecentEmailLogs();
  res.json({
    success: true,
    logs,
    smtpConfigured: Boolean(process.env.SMTP_HOST && process.env.SMTP_USER),
    configuredEmail: process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || 'admin@liscloud.io',
    smtpHost: process.env.SMTP_HOST ? 'Configured' : 'Not configured (Simulated/Console logging mode active)',
  });
});

// 6. Test Email Trigger
adminRouter.post('/send-test-email', requireAdminAuth, async (req: AdminRequest, res) => {
  try {
    const { recipient } = req.body;
    const result = await sendTestEmail(recipient);
    res.json({
      success: true,
      result,
      message: result.simulated
        ? 'Test notification processed in simulated mode (credentials unset). Logged successfully!'
        : 'Test email dispatched via SMTP successfully!',
    });
  } catch (error: any) {
    console.error('Failed to send test email:', error);
    res.status(500).json({ error: error.message || 'Failed to trigger test email' });
  }
});
