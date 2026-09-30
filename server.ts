import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { requireAuth, optionalAuth, AuthRequest } from './src/middleware/auth.ts';
import { getOrCreateUser, getUserByUid, getUserByEmail, getAllUsers } from './src/db/users.ts';
import { 
  insertConsultationRequest, 
  getConsultationRequests, 
  updateConsultationStatus,
  insertJobApplication, 
  getJobApplications, 
  insertNewsletterSubscription,
  insertMessage,
  getMessages,
  getDatabaseSummary 
} from './src/db/queries.ts';
import { adminRouter } from './src/server/adminRoutes.ts';
import { 
  sendConsultationNotification, 
  sendJobApplicationNotification, 
  sendNewsletterNotification 
} from './src/server/email.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON parsing middleware
  app.use(express.json());

  // --- API Routes ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', database: 'postgresql', region: 'asia-southeast1', timestamp: new Date().toISOString() });
  });

  // Mount Admin API Router
  app.use('/api/admin', adminRouter);

  // Get demo enterprise users directly from PostgreSQL
  app.get('/api/auth/demo-users', async (req, res) => {
    try {
      const usersList = await getAllUsers();
      res.json({ users: usersList });
    } catch (error: any) {
      console.error('Failed to get demo users:', error);
      res.status(500).json({ error: 'Failed to load demo accounts' });
    }
  });

  // 1-Click Demo Login against PostgreSQL
  app.post('/api/auth/login-demo', async (req, res) => {
    try {
      const { uid } = req.body;
      if (!uid) {
        return res.status(400).json({ error: 'UID is required' });
      }

      const user = await getUserByUid(uid);
      if (!user) {
        return res.status(404).json({ error: 'Demo user not found in database' });
      }

      const token = `demo-token-${user.uid}`;
      res.json({
        success: true,
        token,
        user,
      });
    } catch (error: any) {
      console.error('Demo login failed:', error);
      res.status(500).json({ error: error.message || 'Demo login failed' });
    }
  });

  // Email / Custom Login or Registration into PostgreSQL
  app.post('/api/auth/login-email', async (req, res) => {
    try {
      const { email, displayName, role } = req.body;
      if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'A valid email is required' });
      }

      const cleanEmail = email.trim().toLowerCase();
      let user = await getUserByEmail(cleanEmail);

      if (!user) {
        // Create new client user in PostgreSQL
        const generatedUid = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const name = displayName || cleanEmail.split('@')[0];
        user = await getOrCreateUser(
          generatedUid, 
          cleanEmail, 
          name, 
          `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
        );
      }

      const token = `demo-token-${user.uid}`;
      res.json({
        success: true,
        token,
        user,
      });
    } catch (error: any) {
      console.error('Email sign in failed:', error);
      res.status(500).json({ error: error.message || 'Email sign in failed' });
    }
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

  // Get current user profile from PostgreSQL
  app.get('/api/auth/me', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      if (!uid) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const user = await getUserByUid(uid);
      if (!user) {
        return res.status(404).json({ error: 'User profile not found in database' });
      }
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

      // Trigger admin email notification (non-blocking)
      sendConsultationNotification(record).catch(err => {
        console.error('Failed to dispatch consultation email notification:', err);
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
      const role = (req.user as any)?.role;
      const showAll = req.query.all === 'true' || role === 'admin' || role === 'architect';

      // If architect or admin, or showAll requested, allow viewing all
      const requests = await getConsultationRequests(showAll ? undefined : uid);
      res.json({ requests, role });
    } catch (error: any) {
      console.error('Error querying consultations:', error);
      res.status(500).json({ error: error.message || 'Failed to load consultation records' });
    }
  });

  // Update consultation status (useful in portal)
  app.patch('/api/consultations/:ticketId/status', requireAuth, async (req: AuthRequest, res) => {
    try {
      const { ticketId } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }

      const updated = await updateConsultationStatus(ticketId, status);
      if (!updated) {
        return res.status(404).json({ error: 'Consultation ticket not found' });
      }

      res.json({ success: true, record: updated });
    } catch (error: any) {
      console.error('Failed to update consultation status:', error);
      res.status(500).json({ error: error.message || 'Failed to update status' });
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

      // Trigger admin email notification (non-blocking)
      sendJobApplicationNotification(record).catch(err => {
        console.error('Failed to dispatch job application email notification:', err);
      });

      res.status(201).json({ success: true, application: record });
    } catch (error: any) {
      console.error('Error submitting job application:', error);
      res.status(500).json({ error: error.message || 'Unable to submit application' });
    }
  });

  // Submit Message from anywhere across the website (stored in PostgreSQL)
  app.post('/api/messages', optionalAuth, async (req: AuthRequest, res) => {
    try {
      const { senderName, senderEmail, senderPhone, content, channel } = req.body;
      if (!content || !content.trim()) {
        return res.status(400).json({ error: 'Message content cannot be empty.' });
      }

      const messageId = `MSG-${Math.floor(100000 + Math.random() * 900000)}`;
      const userId = req.user?.uid;
      const finalName = senderName || (req.user as any)?.name || (req.user as any)?.displayName || 'Anonymous Client';
      const finalEmail = senderEmail || req.user?.email || 'inquiry@client.cloud';

      const record = await insertMessage({
        messageId,
        senderName: finalName,
        senderEmail: finalEmail,
        senderPhone: senderPhone || undefined,
        content: content.trim(),
        channel: channel || 'quick_chat',
        userId: userId || undefined,
      });

      res.status(201).json({
        success: true,
        messageId: record.messageId,
        record,
      });
    } catch (error: any) {
      console.error('Error submitting message:', error);
      res.status(500).json({ error: error.message || 'Failed to record message in database' });
    }
  });

  // Get messages for current user or all messages for architects
  app.get('/api/messages', optionalAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      const role = (req.user as any)?.role;
      const showAll = role === 'admin' || role === 'architect' || req.query.all === 'true';
      const messagesList = await getMessages(showAll ? undefined : uid);
      res.json({ messages: messagesList });
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ error: error.message || 'Failed to load messages' });
    }
  });

  // Subscribe to Newsletter and store in PostgreSQL
  app.post('/api/newsletter/subscribe', optionalAuth, async (req: AuthRequest, res) => {
    try {
      const { email, source, subscriberName } = req.body;
      const finalEmail = (email || req.user?.email || '').trim().toLowerCase();
      if (!finalEmail || !finalEmail.includes('@')) {
        return res.status(400).json({ error: 'Valid email address is required.' });
      }

      const userId = req.user?.uid || undefined;
      const finalName = subscriberName || (req.user as any)?.name || (req.user as any)?.displayName || undefined;

      const record = await insertNewsletterSubscription(finalEmail, source || 'website_footer', finalName, userId);
      
      // Trigger optional admin newsletter notification
      sendNewsletterNotification({
        email: finalEmail,
        source: source || 'website_footer',
        subscriberName: finalName,
      }).catch(err => {
        console.error('Failed to dispatch newsletter email notification:', err);
      });

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
