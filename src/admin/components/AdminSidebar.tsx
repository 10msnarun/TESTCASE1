import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  Mail, 
  Send, 
  ExternalLink, 
  LogOut, 
  ShieldCheck, 
  Database,
  Layers
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

export type AdminPageType = 
  | 'dashboard' 
  | 'consultations' 
  | 'job-applications' 
  | 'newsletter' 
  | 'email-logs';

interface AdminSidebarProps {
  currentPage: AdminPageType;
  onNavigate: (page: AdminPageType) => void;
  onExitToPublic: () => void;
  counts?: {
    consultations?: number;
    newConsultations?: number;
    jobs?: number;
    submittedJobs?: number;
    subscribers?: number;
  };
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentPage,
  onNavigate,
  onExitToPublic,
  counts,
}) => {
  const { adminUser, logout } = useAdminAuth();

  const navItems: Array<{
    id: AdminPageType;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    badgeColor?: string;
  }> = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'consultations',
      label: 'Consultation Requests',
      icon: <FileText className="w-4 h-4" />,
      badge: counts?.newConsultations,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'job-applications',
      label: 'Job Applications',
      icon: <Briefcase className="w-4 h-4" />,
      badge: counts?.submittedJobs,
      badgeColor: 'bg-purple-600 text-white',
    },
    {
      id: 'newsletter',
      label: 'Newsletter Subscribers',
      icon: <Mail className="w-4 h-4" />,
      badge: counts?.subscribers,
      badgeColor: 'bg-slate-700 text-slate-200',
    },
    {
      id: 'email-logs',
      label: 'Email Notifications',
      icon: <Send className="w-4 h-4" />,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0 text-slate-300 select-none z-30">
      {/* Top Branding */}
      <div>
        <div className="p-5 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-base tracking-tight leading-tight flex items-center gap-1.5">
                LIS Admin
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Console
                </span>
              </div>
              <div className="text-xs text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Azure PostgreSQL
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Operations & Data
          </div>

          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-white text-blue-600' : (item.badgeColor || 'bg-slate-700 text-slate-300')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Database & Environment Info Widget */}
        <div className="px-4 py-2">
          <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
            <div className="flex items-center justify-between text-slate-300 font-semibold">
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-blue-400" />
                Azure DB
              </span>
              <span className="text-emerald-400 text-[10px] font-mono">ONLINE</span>
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              Region: <span className="text-slate-300">asia-southeast1</span>
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              Tables: <span className="text-slate-300 font-mono">4 connected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom User Profile & Actions */}
      <div className="p-3 border-t border-slate-800/80 space-y-2">
        {/* Switch to Public Website */}
        <button
          onClick={onExitToPublic}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition"
        >
          <div className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            <span>Public Website</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">/</span>
        </button>

        {/* Admin User Card */}
        <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 border border-blue-500/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-white truncate">
                {adminUser?.name || 'Administrator'}
              </div>
              <div className="text-[10px] text-slate-400 truncate font-mono">
                {adminUser?.email || 'admin@liscloud.io'}
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition shrink-0 ml-1"
            title="Log Out of Admin Console"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
