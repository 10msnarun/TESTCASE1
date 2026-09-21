import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { requireAuth, optionalAuth, AuthRequest } from './src/middleware/auth.ts';
import { getOrCreateUser, getUserByUid } from './src/db/users.ts';
import { 
  insertConsultationRequest, 
  getConsultationRequests, 
  insertJobApplication, 
  getJobApplications, 
  insertNewsletterSubscription,
  getDatabaseSummary 
} from './src/db/queries.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON parsing middleware
  app.use(express.json());

  // --- API Routes ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', database: 'postgresql', timestamp: new Date().toISOString() });
  });

  // Synchronize authenticated Firebase user with PostgreSQL
  app.post('/api/auth/sync', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      const email = req.user?.email || '';
      const name = (req.user as any)?.name || req.body.displayName || '';
      const picture = (req.user as any)?.picture || req.body.photoURL || '';

      if (!uid || !email) {
        return res.status(400).json({ error: 'Missing UID or email in token' });
      }

      const user = await getOrCreateUser(uid, email, name, picture);
      res.json({ success: true, user });
    } catch (error: any) {
      console.error('Failed to synchronize user:', error);
      res.status(500).json({ error: error.message || 'User synchronization failed' });
    }
  });

  // Get current user profile
  app.get('/api/auth/me', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      if (!uid) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const user = await getUserByUid(uid);
      res.json({ user });
    } catch (error: any) {
      console.error('Failed to get user:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch user' });
    }
  });

  // Submit Consultation / Architecture Audit Request
  app.post('/api/consultations', optionalAuth, async (req: AuthRequest, res) => {
    try {
      const { fullName, email, company, phone, cloudPlatform, monthlySpend, serviceType, message } = req.body;

      if (!fullName || !email || !company) {
        return res.status(400).json({ error: 'Full name, email, and company are required fields.' });
      }

      const ticketId = `LIS-${Math.floor(100000 + Math.random() * 900000)}`;
      const userId = req.user?.uid;

      const record = await insertConsultationRequest({
        ticketId,
        fullName,
        email,
        company,
        phone,
        cloudPlatform: cloudPlatform || 'AWS',
        monthlySpend: monthlySpend || 'Not Specified',
        serviceType: serviceType || 'Cloud Architecture & Security Audit',
        message,
        userId,
      });

      res.status(201).json({
        success: true,
        ticketId: record.ticketId,
        record,
      });
    } catch (error: any) {
      console.error('Error submitting consultation request:', error);
      res.status(500).json({ error: error.message || 'Unable to record consultation request' });
    }
  });

  // Get list of consultations (requires login)
  app.get('/api/consultations', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      // In a multi-tenant or role-based app, pass user UID
      const requests = await getConsultationRequests(uid);
      res.json({ requests });
    } catch (error: any) {
      console.error('Error querying consultations:', error);
      res.status(500).json({ error: error.message || 'Failed to load consultation records' });
    }
  });

  // Submit Career Job Application
  app.post('/api/careers/apply', async (req, res) => {
    try {
      const { jobId, jobTitle, applicantName, email, phone, linkedIn, notes } = req.body;

      if (!applicantName || !email || !jobId) {
        return res.status(400).json({ error: 'Name, email, and job ID are required.' });
      }

      const record = await insertJobApplication({
        jobId,
        jobTitle: jobTitle || 'Cloud Consultant',
        applicantName,
        email,
        phone,
        linkedIn,
        notes,
      });

      res.status(201).json({ success: true, application: record });
    } catch (error: any) {
      console.error('Error submitting job application:', error);
      res.status(500).json({ error: error.message || 'Unable to submit application' });
    }
  });

  // Subscribe to Newsletter
  app.post('/api/newsletter/subscribe', async (req, res) => {
    try {
      const { email, source } = req.body;
      if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Valid email address is required.' });
      }

      const record = await insertNewsletterSubscription(email, source);
      res.json({ success: true, record });
    } catch (error: any) {
      console.error('Error subscribing to newsletter:', error);
      res.status(500).json({ error: error.message || 'Failed to subscribe' });
    }
  });

  // Client Portal & Database Summary (for portal view)
  app.get('/api/portal/summary', async (req, res) => {
    try {
      const summary = await getDatabaseSummary();
      res.json({ summary });
    } catch (error: any) {
      console.error('Error fetching portal summary:', error);
      res.status(500).json({ error: error.message || 'Failed to load summary' });
    }
  });

  // --- Vite Middleware (Development) & Static Serving (Production) ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LIS Cloud Consulting server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
