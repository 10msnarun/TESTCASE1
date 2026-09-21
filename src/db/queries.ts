import { db } from './index.ts';
import { consultationRequests, jobApplications, newsletterSubscriptions, users } from './schema.ts';
import { desc, eq } from 'drizzle-orm';

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

export async function insertNewsletterSubscription(email: string, source = 'footer') {
  try {
    const result = await db.insert(newsletterSubscriptions)
      .values({
        email: email.trim().toLowerCase(),
        source,
      })
      .onConflictDoNothing()
      .returning();

    return result[0] || { email, status: 'already_subscribed' };
  } catch (error) {
    console.error("Failed to subscribe newsletter:", error);
    throw new Error("Failed to register subscription. Please try again later.", { cause: error });
  }
}

export async function getDatabaseSummary() {
  try {
    const inquiries = await db.select().from(consultationRequests);
    const jobs = await db.select().from(jobApplications);
    const subscribers = await db.select().from(newsletterSubscriptions);
    const userList = await db.select().from(users);

    return {
      inquiriesCount: inquiries.length,
      jobApplicationsCount: jobs.length,
      subscribersCount: subscribers.length,
      usersCount: userList.length,
      recentInquiries: inquiries.slice(-5).reverse(),
    };
  } catch (error) {
    console.error("Failed to fetch database summary:", error);
    throw new Error("Database query failed.", { cause: error });
  }
}
