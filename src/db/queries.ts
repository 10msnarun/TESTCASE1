import { db } from './index.ts';
import { consultationRequests, jobApplications, newsletterSubscriptions, users, messages } from './schema.ts';
import { desc, eq, sql } from 'drizzle-orm';

export interface CreateConsultationInput {
  ticketId: string;
  fullName: string;
  email: string;
  company: string;
  phone?: string;
  cloudPlatform: string;
  monthlySpend: string;
  serviceType: string;
  message?: string;
  userId?: string;
}

export async function insertConsultationRequest(data: CreateConsultationInput) {
  try {
    const inserted = await db.insert(consultationRequests).values({
      ticketId: data.ticketId,
      fullName: data.fullName,
      email: data.email,
      company: data.company,
      phone: data.phone || null,
      cloudPlatform: data.cloudPlatform,
      monthlySpend: data.monthlySpend,
      serviceType: data.serviceType,
      message: data.message || null,
      userId: data.userId || null,
      status: 'new',
    }).returning();

    return inserted[0];
  } catch (error) {
    console.error("Failed to insert consultation request:", error);
    throw new Error("Failed to record consultation request. Please try again later.", { cause: error });
  }
}

export async function getConsultationRequests(userUid?: string) {
  try {
    if (userUid) {
      return await db.select()
        .from(consultationRequests)
        .where(eq(consultationRequests.userId, userUid))
        .orderBy(desc(consultationRequests.createdAt));
    }
    return await db.select()
      .from(consultationRequests)
      .orderBy(desc(consultationRequests.createdAt));
  } catch (error) {
    console.error("Failed to fetch consultation requests:", error);
    throw new Error("Database query failed. Please try again later.", { cause: error });
  }
}

export async function updateConsultationStatus(ticketId: string, status: string) {
  try {
    const updated = await db.update(consultationRequests)
      .set({ status })
      .where(eq(consultationRequests.ticketId, ticketId))
      .returning();

    return updated[0] || null;
  } catch (error) {
    console.error("Failed to update consultation status:", error);
    throw new Error("Failed to update status in database.", { cause: error });
  }
}

export interface CreateJobApplicationInput {
  jobId: string;
  jobTitle: string;
  applicantName: string;
  email: string;
  phone?: string;
  linkedIn?: string;
  notes?: string;
}

export async function insertJobApplication(data: CreateJobApplicationInput) {
  try {
    const inserted = await db.insert(jobApplications).values({
      jobId: data.jobId,
      jobTitle: data.jobTitle,
      applicantName: data.applicantName,
      email: data.email,
      phone: data.phone || null,
      linkedIn: data.linkedIn || null,
      notes: data.notes || null,
      status: 'submitted',
    }).returning();

    return inserted[0];
  } catch (error) {
    console.error("Failed to insert job application:", error);
    throw new Error("Failed to submit job application. Please try again later.", { cause: error });
  }
}

export async function getJobApplications() {
  try {
    return await db.select()
      .from(jobApplications)
      .orderBy(desc(jobApplications.createdAt));
  } catch (error) {
    console.error("Failed to fetch job applications:", error);
    throw new Error("Database query failed. Please try again later.", { cause: error });
  }
}

export async function insertNewsletterSubscription(
  email: string, 
  source = 'footer',
  subscriberName?: string,
  userId?: string
) {
  try {
    const result = await db.insert(newsletterSubscriptions)
      .values({
        email: email.trim().toLowerCase(),
        source,
        subscriberName: subscriberName || null,
        userId: userId || null,
      })
      .onConflictDoNothing()
      .returning();

    return result[0] || { email, status: 'already_subscribed' };
  } catch (error) {
    console.error("Failed to subscribe newsletter:", error);
    throw new Error("Failed to register subscription. Please try again later.", { cause: error });
  }
}

export interface CreateMessageInput {
  messageId: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  content: string;
  channel?: string;
  userId?: string;
}

export async function insertMessage(data: CreateMessageInput) {
  try {
    const inserted = await db.insert(messages).values({
      messageId: data.messageId,
      senderName: data.senderName,
      senderEmail: data.senderEmail,
      senderPhone: data.senderPhone || null,
      content: data.content,
      channel: data.channel || 'quick_chat',
      userId: data.userId || null,
      status: 'received',
    }).returning();

    return inserted[0];
  } catch (error) {
    console.error("Failed to insert message:", error);
    throw new Error("Failed to record message in database.", { cause: error });
  }
}

export async function getMessages(userId?: string) {
  try {
    if (userId) {
      return await db.select()
        .from(messages)
        .where(eq(messages.userId, userId))
        .orderBy(desc(messages.createdAt));
    }
    return await db.select()
      .from(messages)
      .orderBy(desc(messages.createdAt));
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    throw new Error("Database query failed.", { cause: error });
  }
}

export async function getDatabaseSummary() {
  try {
    const inquiries = await db.select().from(consultationRequests);
    const jobs = await db.select().from(jobApplications);
    const subscribers = await db.select().from(newsletterSubscriptions);
    const userList = await db.select().from(users);
    const messageList = await db.select().from(messages);

    return {
      inquiriesCount: inquiries.length,
      jobApplicationsCount: jobs.length,
      subscribersCount: subscribers.length,
      usersCount: userList.length,
      messagesCount: messageList.length,
      recentInquiries: inquiries.slice(-5).reverse(),
      recentMessages: messageList.slice(-5).reverse(),
    };
  } catch (error) {
    console.error("Failed to fetch database summary:", error);
    throw new Error("Database query failed.", { cause: error });
  }
}

// --- Admin Queries with Pagination, Filtering, and Full Search ---

export interface ConsultationFilterOptions {
  search?: string;
  status?: string;
  cloudPlatform?: string;
  page?: number;
  limit?: number;
}

export async function getAdminConsultations(options: ConsultationFilterOptions = {}) {
  try {
    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, Math.min(100, options.limit || 10));
    const offset = (page - 1) * limit;

    // Load all to perform robust in-memory / SQL filtering and sorting
    let rows = await db.select().from(consultationRequests).orderBy(desc(consultationRequests.createdAt));

    if (options.status && options.status !== 'all') {
      rows = rows.filter(r => r.status.toLowerCase() === options.status?.toLowerCase());
    }

    if (options.cloudPlatform && options.cloudPlatform !== 'all') {
      rows = rows.filter(r => r.cloudPlatform.toLowerCase().includes(options.cloudPlatform!.toLowerCase()));
    }

    if (options.search && options.search.trim()) {
      const q = options.search.trim().toLowerCase();
      rows = rows.filter(r => 
        r.fullName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.company.toLowerCase().includes(q) ||
        r.ticketId.toLowerCase().includes(q) ||
        (r.message && r.message.toLowerCase().includes(q))
      );
    }

    const total = rows.length;
    const paginated = rows.slice(offset, offset + limit);

    return {
      records: paginated,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      }
    };
  } catch (error) {
    console.error("Failed to fetch admin consultations:", error);
    throw new Error("Failed to load consultation records.", { cause: error });
  }
}

export async function getConsultationByTicketId(ticketId: string) {
  try {
    const records = await db.select()
      .from(consultationRequests)
      .where(eq(consultationRequests.ticketId, ticketId))
      .limit(1);
    return records[0] || null;
  } catch (error) {
    console.error("Failed to get consultation by ticketId:", error);
    throw new Error("Failed to load consultation details.", { cause: error });
  }
}

export interface JobFilterOptions {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export async function getAdminJobApplications(options: JobFilterOptions = {}) {
  try {
    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, Math.min(100, options.limit || 10));
    const offset = (page - 1) * limit;

    let rows = await db.select().from(jobApplications).orderBy(desc(jobApplications.createdAt));

    if (options.status && options.status !== 'all') {
      rows = rows.filter(r => r.status.toLowerCase() === options.status?.toLowerCase());
    }

    if (options.search && options.search.trim()) {
      const q = options.search.trim().toLowerCase();
      rows = rows.filter(r => 
        r.applicantName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.jobTitle.toLowerCase().includes(q) ||
        r.jobId.toLowerCase().includes(q) ||
        (r.notes && r.notes.toLowerCase().includes(q))
      );
    }

    const total = rows.length;
    const paginated = rows.slice(offset, offset + limit);

    return {
      records: paginated,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      }
    };
  } catch (error) {
    console.error("Failed to fetch admin job applications:", error);
    throw new Error("Failed to load job applications.", { cause: error });
  }
}

export async function getJobApplicationById(id: number) {
  try {
    const records = await db.select()
      .from(jobApplications)
      .where(eq(jobApplications.id, id))
      .limit(1);
    return records[0] || null;
  } catch (error) {
    console.error("Failed to get job application by id:", error);
    throw new Error("Failed to load job application details.", { cause: error });
  }
}

export async function updateJobApplicationStatus(id: number, status: string) {
  try {
    const updated = await db.update(jobApplications)
      .set({ status })
      .where(eq(jobApplications.id, id))
      .returning();
    return updated[0] || null;
  } catch (error) {
    console.error("Failed to update job application status:", error);
    throw new Error("Failed to update status in database.", { cause: error });
  }
}

export interface NewsletterFilterOptions {
  search?: string;
  source?: string;
  page?: number;
  limit?: number;
}

export async function getAdminNewsletterSubscribers(options: NewsletterFilterOptions = {}) {
  try {
    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, Math.min(100, options.limit || 10));
    const offset = (page - 1) * limit;

    let rows = await db.select().from(newsletterSubscriptions).orderBy(desc(newsletterSubscriptions.createdAt));

    if (options.source && options.source !== 'all') {
      rows = rows.filter(r => r.source.toLowerCase() === options.source?.toLowerCase());
    }

    if (options.search && options.search.trim()) {
      const q = options.search.trim().toLowerCase();
      rows = rows.filter(r => 
        r.email.toLowerCase().includes(q) ||
        (r.subscriberName && r.subscriberName.toLowerCase().includes(q))
      );
    }

    const total = rows.length;
    const paginated = rows.slice(offset, offset + limit);

    return {
      records: paginated,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      }
    };
  } catch (error) {
    console.error("Failed to fetch admin newsletter subscribers:", error);
    throw new Error("Failed to load subscribers.", { cause: error });
  }
}

export async function getAdminOverview() {
  try {
    const consultations = await db.select().from(consultationRequests).orderBy(desc(consultationRequests.createdAt));
    const jobs = await db.select().from(jobApplications).orderBy(desc(jobApplications.createdAt));
    const subscribers = await db.select().from(newsletterSubscriptions).orderBy(desc(newsletterSubscriptions.createdAt));
    const allUsers = await db.select().from(users);

    // Compute status counts for consultations
    const consultationStatusCounts = {
      new: consultations.filter(c => c.status === 'new').length,
      reviewed: consultations.filter(c => c.status === 'reviewed').length,
      scheduled: consultations.filter(c => c.status === 'scheduled').length,
      closed: consultations.filter(c => c.status === 'closed').length,
    };

    // Compute status counts for jobs
    const jobStatusCounts = {
      submitted: jobs.filter(j => j.status === 'submitted').length,
      reviewed: jobs.filter(j => j.status === 'reviewed').length,
      interviewing: jobs.filter(j => j.status === 'interviewing').length,
      accepted: jobs.filter(j => j.status === 'accepted').length,
      rejected: jobs.filter(j => j.status === 'rejected').length,
    };

    // Platform breakdown
    const platformBreakdown = {
      AWS: consultations.filter(c => c.cloudPlatform.includes('AWS')).length,
      Azure: consultations.filter(c => c.cloudPlatform.includes('Azure')).length,
      Both: consultations.filter(c => c.cloudPlatform.includes('Both') || c.cloudPlatform.includes('Multi')).length,
      Other: consultations.filter(c => !c.cloudPlatform.includes('AWS') && !c.cloudPlatform.includes('Azure') && !c.cloudPlatform.includes('Both')).length,
    };

    // Combined recent activity feed (sorted newest first)
    const activityItems: Array<{
      id: string;
      type: 'consultation' | 'job_application' | 'subscriber';
      title: string;
      subtitle: string;
      date: Date | null;
      status?: string;
      meta?: any;
    }> = [];

    consultations.slice(0, 8).forEach(c => {
      activityItems.push({
        id: `c_${c.id}`,
        type: 'consultation',
        title: `Consultation: ${c.fullName} (${c.company})`,
        subtitle: `${c.cloudPlatform} &bull; ${c.serviceType}`,
        date: c.createdAt,
        status: c.status,
        meta: { ticketId: c.ticketId, email: c.email, monthlySpend: c.monthlySpend }
      });
    });

    jobs.slice(0, 8).forEach(j => {
      activityItems.push({
        id: `j_${j.id}`,
        type: 'job_application',
        title: `Application: ${j.applicantName}`,
        subtitle: `Role: ${j.jobTitle} (${j.jobId})`,
        date: j.createdAt,
        status: j.status,
        meta: { email: j.email, id: j.id }
      });
    });

    subscribers.slice(0, 5).forEach(s => {
      activityItems.push({
        id: `s_${s.id}`,
        type: 'subscriber',
        title: `Subscriber: ${s.email}`,
        subtitle: `Source: ${s.source}${s.subscriberName ? ` (${s.subscriberName})` : ''}`,
        date: s.createdAt,
        meta: { email: s.email }
      });
    });

    activityItems.sort((a, b) => {
      const da = a.date ? new Date(a.date).getTime() : 0;
      const db = b.date ? new Date(b.date).getTime() : 0;
      return db - da;
    });

    return {
      totals: {
        consultations: consultations.length,
        jobs: jobs.length,
        subscribers: subscribers.length,
        users: allUsers.length,
      },
      consultationStatusCounts,
      jobStatusCounts,
      platformBreakdown,
      recentActivity: activityItems.slice(0, 10),
      recentConsultations: consultations.slice(0, 5),
      recentJobs: jobs.slice(0, 5),
    };
  } catch (error) {
    console.error("Failed to get admin overview:", error);
    throw new Error("Failed to load dashboard metrics.", { cause: error });
  }
}


