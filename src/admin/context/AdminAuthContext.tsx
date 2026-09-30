import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'superadmin' | 'architect';
  authenticatedAt: string;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  adminToken: string | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  loginDemo: () => Promise<void>;
  logout: () => void;
  smtpConfigured: boolean;
  configuredEmail: string;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ADMIN_STORAGE_KEY = 'lis_admin_session_token';

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [smtpConfigured, setSmtpConfigured] = useState<boolean>(false);
  const [configuredEmail, setConfiguredEmail] = useState<string>('admin@liscloud.io');

  useEffect(() => {
    const restoreAdminSession = async () => {
      const savedToken = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (savedToken) {
        try {
          const res = await fetch('/api/admin/me', {
            headers: {
              'Authorization': `Bearer ${savedToken}`,
            },
          });

          if (res.ok) {
            const data = await res.json();
            setAdminUser(data.user);
            setAdminToken(savedToken);
            setSmtpConfigured(Boolean(data.smtpConfigured));
            if (data.configuredNotificationEmail) {
              setConfiguredEmail(data.configuredNotificationEmail);
            }
          } else {
            localStorage.removeItem(ADMIN_STORAGE_KEY);
          }
        } catch (err) {
          console.error('Failed to verify admin session:', err);
          localStorage.removeItem(ADMIN_STORAGE_KEY);
        }
      }
      setIsLoading(false);
    };

    restoreAdminSession();
  }, []);

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Admin authentication failed');
      }

      setAdminToken(data.token);
      setAdminUser(data.user);
      localStorage.setItem(ADMIN_STORAGE_KEY, data.token);
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginDemo = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDemo: true }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Demo login failed');
      }

      setAdminToken(data.token);
      setAdminUser(data.user);
      localStorage.setItem(ADMIN_STORAGE_KEY, data.token);
    } catch (error) {
      console.error('Demo admin login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    setAdminToken(null);
    setAdminUser(null);
    fetch('/api/admin/logout', { method: 'POST' }).catch(() => {});
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        adminToken,
        isLoading,
        login,
        loginDemo,
        logout,
        smtpConfigured,
        configuredEmail,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
