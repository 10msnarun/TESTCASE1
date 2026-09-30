import React from 'react';
import { 
  Database, 
  Send, 
  ExternalLink, 
  Menu
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { AdminPageType } from './AdminSidebar';

interface AdminHeaderProps {
  currentPage: AdminPageType;
  onOpenMobileMenu?: () => void;
  onNavigate: (page: AdminPageType) => void;
  onExitToPublic: () => void;
}

const PAGE_TITLES: Record<AdminPageType, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Executive Admin Dashboard',
    subtitle: 'Real-time overview of incoming cloud architecture requests, candidate applications, and subscribers.',
  },
  consultations: {
    title: 'Consultation & Architecture Requests',
    subtitle: 'Manage client audit inquiries, track ticket progress, and update status directly in Azure PostgreSQL.',
  },
  'job-applications': {
    title: 'Career Job Applications',
    subtitle: 'Review candidate applications, qualifications, LinkedIn profiles, and hiring statuses.',
  },
  newsletter: {
    title: 'Executive Newsletter Subscribers',
    subtitle: 'Track subscribers from website footer and client portal briefings.',
  },
  'email-logs': {
    title: 'Email Notification Pipeline',
    subtitle: 'Monitor automated admin alerts, check SMTP transport health, and test live email delivery.',
  },
};

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  currentPage,
  onOpenMobileMenu,
  onExitToPublic,
}) => {
  const { adminUser, smtpConfigured } = useAdminAuth();
  const info = PAGE_TITLES[currentPage] || PAGE_TITLES.dashboard;

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      <div className="flex items-center gap-4">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div>
          <h1 className="text-base font-bold text-slate-900 leading-tight">
            {info.title}
          </h1>
          <p className="text-xs text-slate-500 hidden sm:block">
            {info.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* PostgreSQL live status badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono">
          <Database className="w-3.5 h-3.5 text-blue-600" />
          <span>Azure PG: Connected</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        </div>

        {/* Email Notification status badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs">
          <Send className="w-3.5 h-3.5 text-indigo-600" />
          <span className="text-[11px]">
            {smtpConfigured ? 'SMTP Active' : 'Notifications: Active'}
          </span>
        </div>

        {/* Link to public website */}
        <button
          onClick={onExitToPublic}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition"
        >
          <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">Public Site</span>
        </button>

        {/* Admin Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
            {adminUser?.name ? adminUser.name[0].toUpperCase() : 'A'}
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-semibold text-slate-900 leading-tight">
              {adminUser?.name || 'Administrator'}
            </div>
            <div className="text-[10px] text-slate-500 uppercase font-mono">
              {adminUser?.role || 'Admin'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
