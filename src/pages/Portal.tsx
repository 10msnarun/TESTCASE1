import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { PageType } from '../types';
import { 
  Cloud, 
  ShieldCheck, 
  Layers, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  PlusCircle, 
  RefreshCw, 
  LogOut, 
  Download, 
  TrendingDown, 
  Server, 
  ExternalLink,
  ChevronRight,
  User,
  Filter,
  BarChart3,
  Award,
  Sparkles,
  Database,
  MessageSquare,
  Send,
  Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PortalProps {
  onNavigate: (page: PageType) => void;
}

interface ConsultationRecord {
  id: number;
  ticketId: string;
  fullName: string;
  email: string;
  company: string;
  phone: string | null;
  cloudPlatform: string;
  monthlySpend: string;
  serviceType: string;
  message: string | null;
  status: 'new' | 'reviewed' | 'scheduled' | 'closed';
  userId: string | null;
  createdAt: string;
}

interface MessageRecord {
  id: number;
  messageId: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string | null;
  content: string;
  channel: string;
  userId: string | null;
  status: string;
  createdAt: string;
}

export const Portal: React.FC<PortalProps> = ({ onNavigate }) => {
  const { user, dbUser, idToken, signOut } = useAuth();
  const [tickets, setTickets] = useState<ConsultationRecord[]>([]);
  const [portalMessages, setPortalMessages] = useState<MessageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'tickets' | 'messages' | 'deliverables' | 'finops' | 'profile'>('tickets');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTicket, setSelectedTicket] = useState<ConsultationRecord | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);
  
  // Quick new ticket modal
  const [showNewModal, setShowNewModal] = useState(false);
  const [newServiceType, setNewServiceType] = useState('AWS Multi-Account Landing Zone');
  const [newCloudPlatform, setNewCloudPlatform] = useState<'AWS' | 'Azure' | 'Both'>('AWS');
  const [newMonthlySpend, setNewMonthlySpend] = useState('$50k - $100k');
  const [newMessage, setNewMessage] = useState('');
  const [submittingTicket, setSubmittingTicket] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Quick message sending from portal
  const [newChatText, setNewChatText] = useState('');
  const [sendingChatMsg, setSendingChatMsg] = useState(false);

  // Newsletter status in portal
  const [isNewsletterSubscribed, setIsNewsletterSubscribed] = useState(true);
  const [subscribingNewsletter, setSubscribingNewsletter] = useState(false);

  // Fetch consultation tickets and messages from Cloud SQL PostgreSQL
  const fetchTicketsAndMessages = async () => {
    if (!idToken) return;
    try {
      setRefreshing(true);
      const [ticketsRes, messagesRes] = await Promise.all([
        fetch('/api/consultations', {
          headers: { 'Authorization': `Bearer ${idToken}` }
        }),
        fetch('/api/messages', {
          headers: { 'Authorization': `Bearer ${idToken}` }
        })
      ]);

      if (ticketsRes.ok) {
        const data = await ticketsRes.json();
        setTickets(data.requests || []);
      }
      if (messagesRes.ok) {
        const msgData = await messagesRes.json();
        setPortalMessages(msgData.messages || []);
      }
    } catch (err) {
      console.error('Failed to fetch records:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSendPortalMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatText.trim()) return;

    try {
      setSendingChatMsg(true);
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': idToken ? `Bearer ${idToken}` : '',
        },
        body: JSON.stringify({
          senderName: dbUser?.displayName || user?.displayName || 'Client User',
          senderEmail: dbUser?.email || user?.email || 'client@liscloud.com',
          content: newChatText.trim(),
          channel: 'client_portal',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setNewChatText('');
        setActionSuccessMessage(`Message successfully stored in PostgreSQL (Ref: ${data.messageId || 'MSG-SAVED'})`);
        setTimeout(() => setActionSuccessMessage(null), 5000);
        await fetchTicketsAndMessages();
      }
    } catch (e) {
      console.error('Failed to send message:', e);
    } finally {
      setSendingChatMsg(false);
    }
  };

  const handlePortalNewsletterSubscribe = async () => {
    const email = dbUser?.email || user?.email;
    if (!email) return;

    try {
      setSubscribingNewsletter(true);
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': idToken ? `Bearer ${idToken}` : '',
        },
        body: JSON.stringify({
          email,
          source: 'client_portal_dashboard',
          subscriberName: dbUser?.displayName || user?.displayName,
        }),
      });

      if (res.ok) {
        setIsNewsletterSubscribed(true);
        setActionSuccessMessage(`Subscribed to Executive Cloud Briefing in PostgreSQL database!`);
        setTimeout(() => setActionSuccessMessage(null), 5000);
      }
    } catch (e) {
      console.error('Failed to subscribe:', e);
    } finally {
      setSubscribingNewsletter(false);
    }
  };

  useEffect(() => {
    if (!user && !dbUser) {
      onNavigate('sign-in');
    } else {
      fetchTicketsAndMessages();
    }
  }, [user, dbUser, idToken]);


  const handleUpdateStatus = async (ticketId: string, newStatus: string) => {
    if (!idToken) return;
    try {
      setIsUpdatingStatus(ticketId);
      const res = await fetch(`/api/consultations/${ticketId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setTickets(prev => prev.map(t => t.ticketId === ticketId ? { ...t, status: newStatus as any } : t));
        if (selectedTicket && selectedTicket.ticketId === ticketId) {
          setSelectedTicket({ ...selectedTicket, status: newStatus as any });
        }
        setActionSuccessMessage(`Ticket ${ticketId} status updated to ${newStatus.toUpperCase()}`);
        setTimeout(() => setActionSuccessMessage(null), 4000);
      }
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idToken || !dbUser) return;
    try {
      setSubmittingTicket(true);
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          fullName: dbUser.displayName || user?.displayName || 'Client Lead',
          email: dbUser.email || user?.email || '',
          company: 'Enterprise Cloud Division',
          cloudPlatform: newCloudPlatform,
          monthlySpend: newMonthlySpend,
          serviceType: newServiceType,
          message: newMessage || 'Requested via LIS Architecture Portal',
        })
      });

      if (res.ok) {
        setShowNewModal(false);
        setNewMessage('');
        await fetchTicketsAndMessages();
        setActionSuccessMessage('New Architecture Audit Ticket successfully logged to PostgreSQL database!');
        setTimeout(() => setActionSuccessMessage(null), 5000);
      }
    } catch (err) {
      console.error('Error submitting ticket:', err);
    } finally {
      setSubmittingTicket(false);
    }
  };

  const filteredTickets = tickets.filter(t => {
    if (statusFilter === 'all') return true;
    return t.status === statusFilter;
  });

  const isStaffOrAdmin = dbUser?.role === 'architect' || dbUser?.role === 'admin';

  return (
    <div className="min-h-screen bg-slate-50/70 pb-16">
      {/* Top Banner & Header */}
      <div className="bg-purple-950 text-white pt-8 pb-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {dbUser?.photoUrl ? (
                <img
                  src={dbUser.photoUrl}
                  alt={dbUser.displayName || 'User'}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-purple-400 shadow-md shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-700 to-indigo-800 flex items-center justify-center text-xl font-bold text-white shadow-md shrink-0">
                  {dbUser?.displayName?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    {dbUser?.displayName || 'Enterprise Client'}
                  </h1>
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                    dbUser?.role === 'admin' 
                      ? 'bg-amber-400 text-amber-950' 
                      : dbUser?.role === 'architect'
                      ? 'bg-purple-300 text-purple-950'
                      : 'bg-white/20 text-white'
                  }`}>
                    {dbUser?.role || 'Client'}
                  </span>
                </div>
                <div className="text-xs sm:text-sm text-purple-200 mt-1 flex flex-wrap items-center gap-2">
                  <span>{dbUser?.email || user?.email}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-emerald-300">
                    <Database className="w-3.5 h-3.5" />
                    Cloud SQL PostgreSQL (asia-southeast1)
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center flex-wrap gap-2.5">
              <button
                onClick={() => setShowNewModal(true)}
                id="portal-new-ticket-btn"
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-900/30 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>New Audit Ticket</span>
              </button>

              <button
                onClick={fetchTicketsAndMessages}
                disabled={refreshing}
                title="Refresh database records"
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={() => onNavigate('sign-in')}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Switch Account
              </button>

              <button
                onClick={async () => {
                  await signOut();
                  onNavigate('home');
                }}
                className="px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        
        {/* Success Alert Banner */}
        {actionSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccessMessage}</span>
          </motion.div>
        )}

        {/* 4 Overview Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Architecture Tickets</span>
              <FileText className="w-4 h-4 text-purple-700" />
            </div>
            <div className="text-2xl font-black text-slate-900">{tickets.length}</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Real-time from PostgreSQL</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">FinOps Run-Rate Savings</span>
              <TrendingDown className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">$34,200<span className="text-xs font-medium text-slate-500">/mo</span></div>
            <div className="text-[11px] text-purple-700 font-semibold mt-1">
              34% Average Cloud Waste Reduction
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Framework Posture</span>
              <Award className="w-4 h-4 text-purple-700" />
            </div>
            <div className="text-2xl font-black text-slate-900">96.4%</div>
            <div className="text-[11px] text-slate-500 font-semibold mt-1">
              AWS &amp; Azure Well-Architected Pass
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Assigned Principal Pod</span>
              <ShieldCheck className="w-4 h-4 text-purple-700" />
            </div>
            <div className="text-base font-extrabold text-slate-900 truncate">Marcus Vance, AWS Fellow</div>
            <div className="text-[11px] text-purple-600 font-semibold mt-1">
              Dedicated LIS Lead Solutions Architect
            </div>
          </div>
        </div>

        {/* Portal Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 mb-6 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('tickets')}
            className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap ${
              activeTab === 'tickets'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-purple-700 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Architecture &amp; Audit Tickets</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeTab === 'tickets' ? 'bg-purple-800 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {tickets.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            id="portal-tab-messages-btn"
            className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap ${
              activeTab === 'messages'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-purple-700 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Messages &amp; Chat Inquiries</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeTab === 'messages' ? 'bg-purple-800 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {portalMessages.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('deliverables')}
            className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap ${
              activeTab === 'deliverables'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-purple-700 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Architecture Deliverables &amp; Blueprints</span>
          </button>

          <button
            onClick={() => setActiveTab('finops')}
            className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap ${
              activeTab === 'finops'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-purple-700 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>FinOps Telemetry &amp; Cost Optimizer</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-purple-700 hover:bg-slate-100'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Account &amp; Database Info</span>
          </button>
        </div>

        {/* Tab 1: Architecture & Audit Tickets */}
        {activeTab === 'tickets' && (
          <div>
            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Status Filter:</span>
                <div className="flex gap-1">
                  {['all', 'new', 'reviewed', 'scheduled', 'closed'].map(st => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase cursor-pointer transition-all ${
                        statusFilter === st 
                          ? 'bg-purple-100 text-purple-800 border border-purple-300' 
                          : 'text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {isStaffOrAdmin && (
                <div className="text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-xl">
                  Staff View: Showing tickets across all client accounts in PostgreSQL
                </div>
              )}
            </div>

            {/* Tickets Table / Cards */}
            {loading ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <RefreshCw className="w-8 h-8 text-purple-700 animate-spin mx-auto mb-3" />
                <div className="font-bold text-slate-800">Loading audit tickets from PostgreSQL...</div>
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-slate-800 text-lg">No audit tickets found</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  {statusFilter !== 'all' 
                    ? `No tickets match status "${statusFilter}". Try selecting "All".` 
                    : 'Submit your first architecture consultation ticket to initialize review with our principal architects.'}
                </p>
                <button
                  onClick={() => setShowNewModal(true)}
                  className="mt-4 px-4 py-2 rounded-xl bg-purple-700 text-white text-xs font-bold cursor-pointer hover:bg-purple-800"
                >
                  Create New Audit Ticket
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTickets.map((ticket) => {
                  const isUpdating = isUpdatingStatus === ticket.ticketId;

                  return (
                    <div
                      key={ticket.id}
                      className="bg-white rounded-2xl border border-slate-200/90 hover:border-purple-300 p-5 shadow-xs transition-all"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                              {ticket.ticketId}
                            </span>
                            <span className={`text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                              ticket.status === 'scheduled'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ticket.status === 'reviewed'
                                ? 'bg-indigo-100 text-indigo-800'
                                : ticket.status === 'closed'
                                ? 'bg-slate-100 text-slate-700'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {ticket.status}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              ticket.cloudPlatform === 'AWS' 
                                ? 'bg-amber-50 text-amber-900 border border-amber-200' 
                                : ticket.cloudPlatform === 'Azure'
                                ? 'bg-sky-50 text-sky-900 border border-sky-200'
                                : 'bg-purple-50 text-purple-900 border border-purple-200'
                            }`}>
                              {ticket.cloudPlatform} Cloud
                            </span>
                            <span className="text-[11px] text-slate-400">
                              Spend: <strong className="text-slate-700">{ticket.monthlySpend}</strong>
                            </span>
                          </div>

                          <h3 className="font-extrabold text-base text-slate-900">
                            {ticket.serviceType}
                          </h3>

                          {ticket.message && (
                            <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                              {ticket.message}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                            <span>Client: <strong className="text-slate-800">{ticket.fullName}</strong> ({ticket.company})</span>
                            <span>•</span>
                            <span>Email: <strong className="text-slate-800">{ticket.email}</strong></span>
                            {ticket.phone && (
                              <>
                                <span>•</span>
                                <span>Phone: <strong className="text-slate-800">{ticket.phone}</strong></span>
                              </>
                            )}
                            <span>•</span>
                            <span>Date: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {/* Status Updater Actions */}
                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0">
                          <span className="text-[11px] text-slate-400 font-semibold">Change Status:</span>
                          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                            {(['new', 'reviewed', 'scheduled', 'closed'] as const).map(st => (
                              <button
                                key={st}
                                disabled={isUpdating || ticket.status === st}
                                onClick={() => handleUpdateStatus(ticket.ticketId, st)}
                                className={`px-2 py-1 rounded-lg text-[10px] font-extrabold uppercase transition-all cursor-pointer ${
                                  ticket.status === st 
                                    ? 'bg-purple-700 text-white shadow-xs' 
                                    : 'text-slate-600 hover:bg-white'
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab: Messages & Chat Inquiries (Stored in PostgreSQL) */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">My Messages &amp; Live Chat Inquiries</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      PostgreSQL Synchronized
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Every message sent from anywhere on the website (floating chat, contact forms, or portal) is safely recorded in Cloud SQL PostgreSQL.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200 shrink-0">
                  {portalMessages.length} Messages in DB
                </span>
              </div>

              {/* Quick Message Input Box inside Portal */}
              <div className="my-6 p-4 rounded-2xl bg-purple-50/70 border border-purple-200">
                <form onSubmit={handleSendPortalMessage} className="space-y-3">
                  <label className="block text-xs font-bold text-purple-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-purple-700" />
                    <span>Send Direct Message to Principal Solutions Architects</span>
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={newChatText}
                      onChange={(e) => setNewChatText(e.target.value)}
                      placeholder="Type an architectural question, request an NDA, or provide project updates..."
                      className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-purple-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    <button
                      type="submit"
                      disabled={sendingChatMsg || !newChatText.trim()}
                      className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:bg-purple-300 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all shrink-0"
                    >
                      <Send className="w-4 h-4" />
                      <span>{sendingChatMsg ? 'Saving...' : 'Send to DB'}</span>
                    </button>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    <span>Sender: <strong>{dbUser?.displayName || user?.displayName}</strong> ({dbUser?.email || user?.email})</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-semibold">Saved to PostgreSQL table <code>messages</code></span>
                  </div>
                </form>
              </div>

              {/* Messages List */}
              {portalMessages.length === 0 ? (
                <div className="py-12 text-center">
                  <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-slate-700">No messages recorded yet</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                    Send a message using the input above or the floating chat widget on the bottom-right of any page. It will be stored here in real-time.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {portalMessages.map((msg) => (
                    <div 
                      key={msg.id || msg.messageId}
                      className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-purple-200 transition-all space-y-2 text-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded">
                            {msg.messageId}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                            Channel: {msg.channel.replace('_', ' ')}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                            {msg.status}
                          </span>
                        </div>
                        <span className="text-slate-400 text-[11px]">
                          {new Date(msg.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <p className="text-slate-800 text-sm font-medium leading-relaxed">
                        {msg.content}
                      </p>

                      <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                        <span>From: <strong className="text-slate-700">{msg.senderName}</strong> ({msg.senderEmail})</span>
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Stored in PostgreSQL</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Architecture Deliverables & Blueprints */}
        {activeTab === 'deliverables' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Approved Architecture Blueprints &amp; Specifications</h3>
                  <p className="text-xs text-slate-500">Principal Solutions Architect verified documents and multi-cloud artifacts.</p>
                </div>
                <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
                  4 Active Artifacts
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'AWS Enterprise Control Tower & Multi-Account Landing Zone',
                    version: 'v2.4.1',
                    platform: 'AWS',
                    date: 'September 2026',
                    description: 'Automated Account Factory for Terraform (AFT), AWS IAM Identity Center SSO, GuardDuty, and Security Hub multi-region aggregation.',
                    status: 'Ready for Deployment'
                  },
                  {
                    title: 'Azure CAF Landing Zone & AKS Microservices Blueprint',
                    version: 'v1.8.0',
                    platform: 'Azure',
                    date: 'September 2026',
                    description: 'Hub-and-spoke virtual network topology with Azure Firewall Premium, private endpoints for Azure SQL, and Cilium CNI on AKS.',
                    status: 'In Review'
                  },
                  {
                    title: 'FinOps Continuous Cloud Cost Optimization Roadmap',
                    version: 'Q3-2026',
                    platform: 'Multi-Cloud',
                    date: 'August 2026',
                    description: 'Comprehensive analysis of 45+ EC2 and RDS instances, 3-year Compute Savings Plans execution plan, and orphaned EBS volume cleanup.',
                    status: 'Delivered'
                  },
                  {
                    title: 'Zero-Trust EKS Kubernetes Security Benchmark Audit',
                    version: 'v3.1.0',
                    platform: 'AWS',
                    date: 'July 2026',
                    description: 'CIS Benchmark Level 2 compliance report, Kyverno admission controller policies, and AWS KMS envelope encryption for Secrets.',
                    status: 'Delivered'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="p-5 rounded-2xl border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all bg-white flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                          item.platform === 'AWS' 
                            ? 'bg-amber-100 text-amber-800' 
                            : item.platform === 'Azure'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {item.platform} • {item.version}
                        </span>
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          {item.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mb-1.5">{item.title}</h4>
                      <p className="text-xs text-slate-600 mb-4">{item.description}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">{item.date}</span>
                      <button 
                        onClick={() => {
                          setActionSuccessMessage(`Downloaded architectural specification: ${item.title}`);
                          setTimeout(() => setActionSuccessMessage(null), 4000);
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Spec (PDF)</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: FinOps Telemetry */}
        {activeTab === 'finops' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Enterprise Cloud Cost Telemetry &amp; Waste Breakdown</h3>
                  <p className="text-xs text-slate-500">Live compute, storage, and networking utilization across AWS &amp; Azure workloads.</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Total Monthly Spend</div>
                  <div className="text-xl font-black text-slate-900">$118,400</div>
                </div>
              </div>

              {/* Cost categories */}
              <div className="space-y-4 mb-8">
                {[
                  { name: 'Compute (AWS EC2 / EKS & Azure VM / AKS)', spend: '$54,200', pct: 45, color: 'bg-purple-600', saving: 'Save $12,400 with Savings Plans' },
                  { name: 'Databases (Amazon Aurora, DynamoDB & Azure Cosmos DB)', spend: '$32,100', pct: 27, color: 'bg-indigo-600', saving: 'Save $6,800 with I/O-optimized instances' },
                  { name: 'Storage (S3 Intelligent-Tiering & Azure Blob)', spend: '$18,900', pct: 16, color: 'bg-sky-600', saving: 'Save $4,100 with Lifecycle policies' },
                  { name: 'Networking & Data Transfer (NAT Gateways & Transit GW)', spend: '$13,200', pct: 12, color: 'bg-emerald-600', saving: 'Save $3,200 with VPC Endpoints' },
                ].map((cat, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                      <span className="text-slate-800">{cat.name}</span>
                      <span className="text-slate-900">{cat.spend} ({cat.pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mb-2">
                      <div className={`h-2 rounded-full ${cat.color}`} style={{ width: `${cat.pct}%` }}></div>
                    </div>
                    <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{cat.saving}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <TrendingDown className="w-8 h-8 text-purple-700 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm text-purple-950">Guaranteed 30%+ FinOps Savings Sprint</h4>
                    <p className="text-xs text-purple-700">Book our 4-week FinOps implementation pod. We only take a fee if we uncover 25%+ verified monthly waste.</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowNewModal(true)}
                  className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shrink-0 cursor-pointer shadow-xs"
                >
                  Schedule FinOps Sprint
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Account & Database Info */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Enterprise Account &amp; PostgreSQL Infrastructure</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">Authenticated Account</span>
                  <div className="font-bold text-sm text-slate-900">{dbUser?.displayName || 'Client User'}</div>
                  <div className="text-xs text-slate-600 font-mono mt-0.5">{dbUser?.email || user?.email}</div>
                  <div className="mt-2 inline-block px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-extrabold uppercase">
                    Role: {dbUser?.role || 'Client'}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">Unique Identifier (UID)</span>
                  <div className="font-mono text-xs text-slate-800 break-all">{dbUser?.uid || user?.uid}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100">
                  <div className="flex items-center gap-2 mb-2 text-purple-900 font-bold text-sm">
                    <Database className="w-4 h-4 text-purple-700" />
                    <span>Cloud SQL PostgreSQL Backend</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5">
                    <li>• <strong>Region:</strong> asia-southeast1 (High Performance)</li>
                    <li>• <strong>Database ORM:</strong> Drizzle ORM</li>
                    <li>• <strong>Connection Pool:</strong> node-postgres (pg.Pool) cached</li>
                    <li>• <strong>Tables:</strong> users, consultation_requests, messages, job_applications, newsletter_subscriptions</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
                      <Mail className="w-4 h-4 text-emerald-700" />
                      <span>Executive Cloud Briefing Subscription</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                      {isNewsletterSubscribed ? 'Active in DB' : 'Not Subscribed'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mb-3">
                    Receive monthly engineering teardowns and FinOps architecture blueprints written by LIS Principal Architects. Stored in PostgreSQL <code>newsletter_subscriptions</code> table.
                  </p>
                  <button
                    onClick={handlePortalNewsletterSubscribe}
                    disabled={subscribingNewsletter}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    {subscribingNewsletter ? 'Registering...' : (isNewsletterSubscribed ? 'Re-confirm Subscription in DB' : 'Subscribe with Current Account')}
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">Authentication Framework</span>
                  <div className="text-xs text-slate-700">
                    Dual Firebase Authentication &amp; PostgreSQL synchronization engine with JWT bearer token verification.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New Ticket Modal */}
      <AnimatePresence>
        {showNewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-purple-100 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Request New Architecture Review</h3>
                  <p className="text-xs text-slate-500">Directly inserts an audit ticket into the Cloud SQL PostgreSQL database.</p>
                </div>
                <button 
                  onClick={() => setShowNewModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Cloud Provider</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['AWS', 'Azure', 'Both'] as const).map(p => (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setNewCloudPlatform(p)}
                        className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                          newCloudPlatform === p 
                            ? 'bg-purple-700 text-white border-purple-700' 
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Practice / Audit Focus</label>
                  <select
                    value={newServiceType}
                    onChange={(e) => setNewServiceType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="AWS Multi-Account Landing Zone">AWS Multi-Account Landing Zone (Control Tower)</option>
                    <option value="Azure Enterprise Modernization & AKS">Azure Enterprise Modernization &amp; AKS</option>
                    <option value="FinOps Continuous Cost Optimization">FinOps Continuous Cost Optimization</option>
                    <option value="Cloud Security & Zero-Trust Architecture">Cloud Security &amp; Zero-Trust Architecture</option>
                    <option value="24/7 Managed SRE & DevOps Pod">24/7 Managed SRE &amp; DevOps Pod</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Current Monthly Cloud Spend</label>
                  <select
                    value={newMonthlySpend}
                    onChange={(e) => setNewMonthlySpend(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="Under $20k">Under $20k / month</option>
                    <option value="$20k - $50k">$20k - $50k / month</option>
                    <option value="$50k - $100k">$50k - $100k / month</option>
                    <option value="$100k - $250k">$100k - $250k / month</option>
                    <option value="$250k+">$250k+ / month (Enterprise)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Specific Architecture Requirements</label>
                  <textarea
                    rows={3}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Describe workloads, timelines, compliance frameworks (SOC 2, HIPAA, PCI-DSS)..."
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNewModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingTicket}
                    id="submit-portal-audit-ticket-btn"
                    className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
                  >
                    {submittingTicket ? 'Recording in PostgreSQL...' : 'Submit to Database'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
