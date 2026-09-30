import React, { useState, useEffect } from 'react';
import { 
  Send, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Info, 
  Mail, 
  Server
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

export interface EmailLog {
  id: string;
  type: 'consultation' | 'job_application' | 'newsletter' | 'test';
  to: string;
  subject: string;
  summary: string;
  sentAt: string;
  status: 'sent' | 'simulated' | 'failed';
  error?: string;
}

export const AdminEmailLogs: React.FC = () => {
  const { adminToken } = useAdminAuth();
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [smtpConfigured, setSmtpConfigured] = useState(false);
  const [configuredEmail, setConfiguredEmail] = useState('');
  const [smtpHostStatus, setSmtpHostStatus] = useState('');
  const [testingEmail, setTestingEmail] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/email-logs', {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
      });

      if (!res.ok) throw new Error('Failed to load email logs');

      const data = await res.json();
      setLogs(data.logs || []);
      setSmtpConfigured(data.smtpConfigured);
      setConfiguredEmail(data.configuredEmail);
      setSmtpHostStatus(data.smtpHost);
    } catch (err: any) {
      console.error('Error fetching email logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [adminToken]);

  const handleSendTestEmail = async () => {
    setTestingEmail(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/admin/send-test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
        },
        body: JSON.stringify({}),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to dispatch test email');

      setTestResult(data.message || 'Test email dispatched successfully!');
      fetchLogs();
    } catch (err: any) {
      setTestResult(`Error: ${err.message}`);
    } finally {
      setTestingEmail(false);
    }
  };

  const getStatusBadge = (status: EmailLog['status']) => {
    switch (status) {
      case 'sent':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Sent via SMTP
          </span>
        );
      case 'simulated':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
            <Info className="w-3 h-3" /> Logged (Simulated)
          </span>
        );
      case 'failed':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Failed
          </span>
        );
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Email Notification Pipeline
            <span className="text-xs font-mono font-medium px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
              System Service
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Real-time inbound submission notifications sent to the executive administrator.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSendTestEmail}
            disabled={testingEmail}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition shadow-2xs disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{testingEmail ? 'Sending Test...' : 'Send Test Notification'}</span>
          </button>

          <button
            onClick={fetchLogs}
            className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-600 transition"
            title="Refresh logs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {testResult && (
        <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
          testResult.startsWith('Error') 
            ? 'bg-rose-50 border border-rose-200 text-rose-700' 
            : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
        }`}>
          {testResult.startsWith('Error') ? <AlertTriangle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
          <span>{testResult}</span>
        </div>
      )}

      {/* Environment & Configuration Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Configured Admin Recipient
          </div>
          <div className="font-mono text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-blue-600" />
            <span className="truncate">{configuredEmail || 'admin@liscloud.io'}</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Env variable: <code className="font-mono text-slate-700 font-semibold">ADMIN_NOTIFICATION_EMAIL</code>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Transport Engine
          </div>
          <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Server className="w-4 h-4 text-indigo-600" />
            <span>{smtpConfigured ? 'Nodemailer (SMTP Active)' : 'Graceful Fallback Mode'}</span>
          </div>
          <div className="text-[11px] text-slate-500">
            {smtpHostStatus}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Automated Triggers
          </div>
          <div className="text-xs text-slate-700 space-y-0.5 pt-0.5">
            <div className="flex items-center gap-1 text-emerald-600 font-medium">
              <CheckCircle2 className="w-3 h-3" /> Consultation Requests
            </div>
            <div className="flex items-center gap-1 text-emerald-600 font-medium">
              <CheckCircle2 className="w-3 h-3" /> Job Applications
            </div>
            <div className="flex items-center gap-1 text-blue-600 font-medium">
              <CheckCircle2 className="w-3 h-3" /> Newsletter Subscriptions
            </div>
          </div>
        </div>
      </div>

      {/* Dispatched Notification History */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-900">
              Notification Dispatch History ({logs.length})
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            In-Memory / SMTP Event Log
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
              <span>Loading notification logs...</span>
            </div>
          ) : logs.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No notifications dispatched yet. Submit a consultation inquiry on the public site or click "Send Test Notification".
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="p-4 sm:px-6 hover:bg-slate-50/80 transition space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      {log.subject}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                      {log.type.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(log.status)}
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(log.sentAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-600">
                  {log.summary}
                </div>

                <div className="text-[11px] text-slate-400 font-mono">
                  Recipient: <span className="text-slate-700">{log.to}</span>
                  {log.error && <span className="text-rose-600 ml-2 font-sans font-medium">({log.error})</span>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
