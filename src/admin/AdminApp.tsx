import React, { useState, useEffect } from 'react';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { AdminSidebar, AdminPageType } from './components/AdminSidebar';
import { AdminHeader } from './components/AdminHeader';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminConsultations } from './pages/AdminConsultations';
import { AdminJobApplications } from './pages/AdminJobApplications';
import { AdminNewsletter } from './pages/AdminNewsletter';
import { AdminEmailLogs } from './pages/AdminEmailLogs';
import { RefreshCw } from 'lucide-react';

interface AdminAppProps {
  onExitToPublic: () => void;
}

const AdminContent: React.FC<AdminAppProps> = ({ onExitToPublic }) => {
  const { adminUser, isLoading, adminToken } = useAdminAuth();
  const [currentPage, setCurrentPage] = useState<AdminPageType>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [badgeCounts, setBadgeCounts] = useState<{
    consultations?: number;
    newConsultations?: number;
    jobs?: number;
    submittedJobs?: number;
    subscribers?: number;
  }>({});

  // Parse deep links in URL hash (e.g. #admin/consultations or #admin?page=consultations)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.includes('consultations')) setCurrentPage('consultations');
      else if (hash.includes('jobs') || hash.includes('careers')) setCurrentPage('job-applications');
      else if (hash.includes('newsletter')) setCurrentPage('newsletter');
      else if (hash.includes('email')) setCurrentPage('email-logs');
      else if (hash.includes('dashboard')) setCurrentPage('dashboard');
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Fetch summary counts for sidebar badges
  useEffect(() => {
    if (!adminToken) return;
    const fetchCounts = async () => {
      try {
        const res = await fetch('/api/admin/overview', {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setBadgeCounts({
              consultations: json.data.totals.consultations,
              newConsultations: json.data.consultationStatusCounts?.new,
              jobs: json.data.totals.jobs,
              submittedJobs: json.data.jobStatusCounts?.submitted,
              subscribers: json.data.totals.subscribers,
            });
          }
        }
      } catch (e) {
        // Soft fail
      }
    };
    fetchCounts();
  }, [adminToken, currentPage]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-300">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
          <span className="text-sm font-medium">Verifying Administrator Authorization...</span>
        </div>
      </div>
    );
  }

  // If not authenticated, show professional admin login screen
  if (!adminUser) {
    return <AdminLogin onExitToPublic={onExitToPublic} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <AdminDashboard onNavigate={(page) => setCurrentPage(page)} />;
      case 'consultations':
        return <AdminConsultations />;
      case 'job-applications':
        return <AdminJobApplications />;
      case 'newsletter':
        return <AdminNewsletter />;
      case 'email-logs':
        return <AdminEmailLogs />;
      default:
        return <AdminDashboard onNavigate={(page) => setCurrentPage(page)} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <AdminSidebar
          currentPage={currentPage}
          onNavigate={(page) => setCurrentPage(page)}
          onExitToPublic={onExitToPublic}
          counts={badgeCounts}
        />
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-64 bg-slate-900 h-full z-10 shadow-xl">
            <AdminSidebar
              currentPage={currentPage}
              onNavigate={(page) => {
                setCurrentPage(page);
                setMobileMenuOpen(false);
              }}
              onExitToPublic={onExitToPublic}
              counts={badgeCounts}
            />
          </div>
        </div>
      )}

      {/* Main Admin Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          currentPage={currentPage}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onNavigate={(page) => setCurrentPage(page)}
          onExitToPublic={onExitToPublic}
        />

        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export const AdminApp: React.FC<AdminAppProps> = (props) => {
  return (
    <AdminAuthProvider>
      <AdminContent {...props} />
    </AdminAuthProvider>
  );
};
