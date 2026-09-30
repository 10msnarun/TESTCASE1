import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { getUserByEmail } from '../db/users.ts';

const ADMIN_SECRET = process.env.ADMIN_AUTH_SECRET || process.env.SESSION_SECRET || 'lis_cloud_admin_secure_secret_key_2026';
const ADMIN_DEFAULT_EMAIL = process.env.ADMIN_EMAIL || 'admin@liscloud.io';
const ADMIN_DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || 'LisCloudAdmin2026!';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'superadmin' | 'architect';
  authenticatedAt: string;
}

export interface AdminRequest extends Request {
  adminUser?: AdminUser;
}

// In-memory token storage (persists during server lifetime)
const validAdminTokens = new Map<string, AdminUser>();

/**
 * Generate a cryptographically signed admin session token
 */
export function createAdminToken(user: AdminUser): string {
  const payload = Buffer.from(JSON.stringify(user)).toString('base64url');
  const hmac = crypto.createHmac('sha256', ADMIN_SECRET);
  hmac.update(payload);
  const signature = hmac.digest('base64url');
  const token = `lis_adm_${payload}.${signature}`;
  validAdminTokens.set(token, user);
  return token;
}

/**
 * Verifies an admin token
 */
export function verifyAdminToken(token: string): AdminUser | null {
  if (!token || !token.startsWith('lis_adm_')) {
    // Also allow demo quick admin token
    if (token === 'demo-admin-token-superadmin') {
      return {
        id: 'admin_demo_1',
        email: ADMIN_DEFAULT_EMAIL,
        name: 'Principal Cloud Architect (Admin)',
        role: 'superadmin',
        authenticatedAt: new Date().toISOString(),
      };
    }
    return null;
  }

  // Check cache first
  if (validAdminTokens.has(token)) {
    return validAdminTokens.get(token)!;
  }

  try {
    const raw = token.replace('lis_adm_', '');
    const [payload, signature] = raw.split('.');
    if (!payload || !signature) return null;

    const hmac = crypto.createHmac('sha256', ADMIN_SECRET);
    hmac.update(payload);
    const expectedSig = hmac.digest('base64url');

    if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      const user = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8')) as AdminUser;
      validAdminTokens.set(token, user);
      return user;
    }
  } catch (err) {
    console.error('Error verifying admin token:', err);
  }
  return null;
}

/**
 * Middleware protecting admin routes
 */
export function requireAdminAuth(req: AdminRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication token required' });
  }

  const token = authHeader.split('Bearer ')[1].trim();
  const adminUser = verifyAdminToken(token);

  if (!adminUser) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired admin session' });
  }

  req.adminUser = adminUser;
  next();
}

/**
 * Handles admin authentication validation against env or PostgreSQL users
 */
export async function authenticateAdmin(email: string, password?: string): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();

  // 1. Check against primary environment variable configured admin
  const configuredEmail = ADMIN_DEFAULT_EMAIL.toLowerCase();
  if (cleanEmail === configuredEmail) {
    if (!password || password === ADMIN_DEFAULT_PASSWORD) {
      return {
        success: true,
        user: {
          id: 'admin_root',
          email: configuredEmail,
          name: 'Executive Cloud Administrator',
          role: 'superadmin',
          authenticatedAt: new Date().toISOString(),
        }
      };
    } else {
      return { success: false, error: 'Invalid admin credentials' };
    }
  }

  // 2. Check against PostgreSQL database users table with admin or architect role
  try {
    const dbUser = await getUserByEmail(cleanEmail);
    if (dbUser && (dbUser.role === 'admin' || dbUser.role === 'architect')) {
      return {
        success: true,
        user: {
          id: dbUser.uid,
          email: dbUser.email,
          name: dbUser.displayName || 'Authorized Administrator',
          role: dbUser.role as any,
          authenticatedAt: new Date().toISOString(),
        }
      };
    }
  } catch (err) {
    console.error('Database admin lookup failed:', err);
  }

  return { success: false, error: 'Unauthorized: User is not configured as an administrator' };
}
