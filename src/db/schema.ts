import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Users table authenticated via Firebase Auth (Google Sign-In)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  displayName: text('display_name'),
  photoUrl: text('photo_url'),
  role: text('role').default('client').notNull(), // 'client' | 'architect' | 'admin'
  createdAt: timestamp('created_at').defaultNow(),
});

// Enterprise Consultation Inquiries & Architecture Audits
export const consultationRequests = pgTable('consultation_requests', {
  id: serial('id').primaryKey(),
  ticketId: text('ticket_id').notNull().unique(),
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  company: text('company').notNull(),
  phone: text('phone'),
  cloudPlatform: text('cloud_platform').notNull(),
  monthlySpend: text('monthly_spend').notNull(),
  serviceType: text('service_type').notNull(),
  message: text('message'),
  status: text('status').default('new').notNull(), // 'new' | 'reviewed' | 'scheduled' | 'closed'
  userId: text('user_id'), // Optional link to Firebase UID if authenticated
  createdAt: timestamp('created_at').defaultNow(),
});

// Career Job Applications
export const jobApplications = pgTable('job_applications', {
  id: serial('id').primaryKey(),
  jobId: text('job_id').notNull(),
  jobTitle: text('job_title').notNull(),
  applicantName: text('applicant_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  linkedIn: text('linkedin'),
  notes: text('notes'),
  status: text('status').default('submitted').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Executive Cloud Newsletter Subscriptions
export const newsletterSubscriptions = pgTable('newsletter_subscriptions', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  source: text('source').default('footer').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
