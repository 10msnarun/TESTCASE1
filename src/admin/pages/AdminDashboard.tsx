import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Briefcase, 
  Mail, 
  ArrowUpRight, 
  Clock, 
  TrendingUp, 
  RefreshCw, 
  Sparkles,
  Cloud,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { AdminPageType } from '../components/AdminSidebar';

interface DashboardData {
  totals: {
    consultations: number;
    jobs: number;
    subscribers: number;
    users: number;
  };
  consultationStatusCounts: {
    new: number;
    reviewed: number;
    scheduled: number;
    closed: number;
  };
  jobStatusCounts: {
    submitted: number;
    reviewed: number;
    interviewing: number;
    accepted: number;
    rejected: number;
  };
  platformBreakdown: {
    AWS: number;
    Azure: number;
    Both: number;
    Other: number;
  };
  recentActivity: Array<{
    id: string;
    type: 'consultation' | 'job_application' | 'subscriber';
    title: string;
    subtitle: string;
    date: string | null;
    status?: string;
    meta?: any;
  }>;
  recentConsultations: Array<any>;
  recentJobs: Array<any>;
}

interface AdminDashboardProps {
  onNavigate: (page: AdminPageType) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { adminToken } = useAdminAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOverview = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await fetch('/api/admin/overview', {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to load dashboard overview');
      }

      const resData = await res.json();
      setData(resData.data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching admin overview:', err);
      setError(err.message || 'Unable to connect to admin API');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, [adminToken]);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">New</span>;
      case 'reviewed':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800 border border-blue-200">Reviewed</span>;
      case 'scheduled':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">Scheduled</span>;
      case 'closed':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">Closed</span>;
      case 'submitted':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-100 text-purple-800 border border-purple-200">Submitted</span>;
      case 'interviewing':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">Interviewing</span>;
      case 'accepted':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">Accepted</span>;
      case 'rejected':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-100 text-rose-800 border border-rose-200">Rejected</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Recent';
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading && !data) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-slate-500 text-sm">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span>Loading Azure PostgreSQL metrics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header bar with refresh & status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Operations & Inbound Overview
            <span className="text-[11px] font-normal px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200 font-mono">
              Live DB
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Aggregated metrics directly from Azure Database for PostgreSQL (Server-side queries only).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchOverview(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition shadow-2xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-blue-600' : 'text-slate-500'}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <div>
            <div className="font-semibold">Unable to fetch dashboard metrics</div>
            <div>{error}</div>
          </div>
        </div>
      )}

      {/* Primary 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Consultations */}
        <div 
          onClick={() => onNavigate('consultations')}
          className="p-5 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Consultation Requests
            </span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {data?.totals.consultations ?? 0}
            </span>
            <div className="flex items-center gap-1 text-xs text-blue-600 font-medium">
              <span>View all</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Needs review:</span>
            <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-[11px]">
              {data?.consultationStatusCounts.new ?? 0} new
            </span>
          </div>
        </div>

        {/* Total Job Applications */}
        <div 
          onClick={() => onNavigate('job-applications')}
          className="p-5 rounded-xl bg-white border border-slate-200 hover:border-purple-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Job Applications
            </span>
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {data?.totals.jobs ?? 0}
            </span>
            <div className="flex items-center gap-1 text-xs text-purple-600 font-medium">
              <span>View all</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Pending review:</span>
            <span className="font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded text-[11px]">
              {data?.jobStatusCounts.submitted ?? 0} submitted
            </span>
          </div>
        </div>

        {/* Total Newsletter Subscribers */}
        <div 
          onClick={() => onNavigate('newsletter')}
          className="p-5 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Newsletter Subscribers
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {data?.totals.subscribers ?? 0}
            </span>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <span>View list</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Channel source:</span>
            <span className="font-semibold text-slate-700 text-[11px]">
              Footer & Briefings
            </span>
          </div>
        </div>

        {/* Total Registered Users */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Enterprise Users
            </span>
            <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {data?.totals.users ?? 0}
            </span>
            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              Active
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Database table:</span>
            <span className="font-mono text-slate-700 text-[11px]">users</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Activity Feed + Cloud Distribution Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Timeline (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-sm text-slate-900">
                Recent Submissions & Activity
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              Latest Inbound Events
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {(!data?.recentActivity || data.recentActivity.length === 0) ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No recent activity recorded yet in the database.
              </div>
            ) : (
              data.recentActivity.map((item) => (
                <div 
                  key={item.id} 
                  className="px-6 py-3.5 flex items-center justify-between hover:bg-slate-50/80 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      item.type === 'consultation'
                        ? 'bg-blue-50 text-blue-600'
                        : item.type === 'job_application'
                        ? 'bg-purple-50 text-purple-600'
                        : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {item.type === 'consultation' && <FileText className="w-4 h-4" />}
                      {item.type === 'job_application' && <Briefcase className="w-4 h-4" />}
                      {item.type === 'subscriber' && <Mail className="w-4 h-4" />}
                    </div>

                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-900 truncate">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate" dangerouslySetInnerHTML={{ __html: item.subtitle }} />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    {item.status && getStatusBadge(item.status)}
                    <span className="text-[11px] text-slate-400 whitespace-nowrap font-mono">
                      {formatDate(item.date)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
            <button
              onClick={() => onNavigate('consultations')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition"
            >
              View Full Consultation Submissions &rarr;
            </button>
          </div>
        </div>

        {/* Cloud Distribution & Status Overview (1 Column) */}
        <div className="space-y-6">
          {/* Cloud Platform Breakdown */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-indigo-600" />
                <h4 className="font-bold text-sm text-slate-900">Cloud Platform Interest</h4>
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Consultations</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>AWS (Amazon Web Services)</span>
                  <span className="font-bold font-mono">{data?.platformBreakdown.AWS ?? 0}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                    style={{ width: `${((data?.platformBreakdown.AWS ?? 0) / Math.max(1, data?.totals.consultations ?? 1)) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Microsoft Azure</span>
                  <span className="font-bold font-mono">{data?.platformBreakdown.Azure ?? 0}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full transition-all duration-500" 
                    style={{ width: `${((data?.platformBreakdown.Azure ?? 0) / Math.max(1, data?.totals.consultations ?? 1)) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Multi-Cloud / Both</span>
                  <span className="font-bold font-mono">{data?.platformBreakdown.Both ?? 0}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className="h-full bg-purple-600 rounded-full transition-all duration-500" 
                    style={{ width: `${((data?.platformBreakdown.Both ?? 0) / Math.max(1, data?.totals.consultations ?? 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-slate-900 text-white rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              Direct Actions
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Open records, inspect customer audit parameters, review applicants, and test automated emails.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => onNavigate('consultations')}
                className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium transition text-left"
              >
                Inquiries ({data?.totals.consultations ?? 0})
              </button>
              <button
                onClick={() => onNavigate('job-applications')}
                className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium transition text-left"
              >
                Candidates ({data?.totals.jobs ?? 0})
              </button>
              <button
                onClick={() => onNavigate('newsletter')}
                className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium transition text-left"
              >
                Subscribers ({data?.totals.subscribers ?? 0})
              </button>
              <button
                onClick={() => onNavigate('email-logs')}
                className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium transition text-left text-blue-300"
              >
                Email Alerts &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
