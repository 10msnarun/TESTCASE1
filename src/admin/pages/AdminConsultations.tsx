import React, { useState, useEffect } from 'react';
import { 
  Search, 
  RefreshCw, 
  ExternalLink, 
  X, 
  Mail, 
  Phone, 
  Building, 
  Cloud, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { AdminPagination } from '../components/AdminPagination';

export interface ConsultationRecord {
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
  status: string;
  userId: string | null;
  createdAt: string | null;
}

export const AdminConsultations: React.FC = () => {
  const { adminToken } = useAdminAuth();
  const [records, setRecords] = useState<ConsultationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Detail Modal / Drawer
  const [selectedRecord, setSelectedRecord] = useState<ConsultationRecord | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusUpdateSuccess, setStatusUpdateSuccess] = useState(false);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm.trim()) params.append('search', searchTerm.trim());
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (platformFilter !== 'all') params.append('cloudPlatform', platformFilter);
      params.append('page', currentPage.toString());
      params.append('limit', pageSize.toString());

      const res = await fetch(`/api/admin/consultations?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch consultation records');
      }

      const data = await res.json();
      setRecords(data.records);
      setTotalRecords(data.pagination.total);
      setTotalPages(data.pagination.totalPages);
      setError(null);
    } catch (err: any) {
      console.error('Error querying consultations:', err);
      setError(err.message || 'Failed to load consultation records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [adminToken, currentPage, pageSize, statusFilter, platformFilter]);

  // Handle Search Submission or debounce
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchRecords();
  };

  const handleUpdateStatus = async (ticketId: string, newStatus: string) => {
    setUpdatingStatus(true);
    setStatusUpdateSuccess(false);
    try {
      const res = await fetch(`/api/admin/consultations/${ticketId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error('Failed to update status');
      }

      const data = await res.json();
      // Update local state
      setRecords(prev => prev.map(r => r.ticketId === ticketId ? { ...r, status: newStatus } : r));
      if (selectedRecord && selectedRecord.ticketId === ticketId) {
        setSelectedRecord({ ...selectedRecord, status: newStatus });
      }
      setStatusUpdateSuccess(true);
      setTimeout(() => setStatusUpdateSuccess(false), 2500);
    } catch (err: any) {
      alert(`Error updating status: ${err.message}`);
    } finally {
      setUpdatingStatus(false);
    }
  };

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
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Title & Search bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Consultation Requests
            <span className="text-xs font-mono font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full border border-slate-200">
              {totalRecords} total
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Records stored in Azure PostgreSQL table <code className="font-mono text-slate-700">consultation_requests</code>
          </p>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search name, email, company, ticket..."
              className="pl-9 pr-3 py-1.5 w-64 md:w-80 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition"
          >
            Search
          </button>
        </form>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter by status"
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="new">New (Needs review)</option>
              <option value="reviewed">Reviewed</option>
              <option value="scheduled">Scheduled</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Cloud Platform Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Platform:</span>
            <select
              value={platformFilter}
              onChange={(e) => {
                setPlatformFilter(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter by cloud platform"
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Cloud Platforms</option>
              <option value="AWS">AWS</option>
              <option value="Azure">Azure</option>
              <option value="Both">Both / Multi-Cloud</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => {
            setSearchTerm('');
            setStatusFilter('all');
            setPlatformFilter('all');
            setCurrentPage(1);
            fetchRecords();
          }}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Client Name & Org</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Cloud & Spend</th>
                <th className="py-3 px-4">Service Type</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                      <span>Querying PostgreSQL consultation_requests...</span>
                    </div>
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No consultation requests match your current search and filters.
                  </td>
                </tr>
              ) : (
                records.map((r) => (
                  <tr 
                    key={r.ticketId}
                    className="hover:bg-slate-50/80 transition cursor-pointer"
                    onClick={() => setSelectedRecord(r)}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-blue-600">
                      {r.ticketId}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{r.fullName}</div>
                      <div className="text-slate-500 flex items-center gap-1">
                        <Building className="w-3 h-3 text-slate-400" />
                        <span>{r.company}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-mono text-[11px]">{r.email}</div>
                      <div className="text-slate-400 text-[11px]">{r.phone || 'No phone'}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800 flex items-center gap-1">
                        <Cloud className="w-3 h-3 text-indigo-500" />
                        <span>{r.cloudPlatform}</span>
                      </div>
                      <div className="text-slate-500 text-[11px] font-mono">
                        {r.monthlySpend}
                      </div>
                    </td>

                    <td className="py-3 px-4 max-w-[200px] truncate text-slate-700" title={r.serviceType}>
                      {r.serviceType}
                    </td>

                    <td className="py-3 px-4">
                      {getStatusBadge(r.status)}
                    </td>

                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {formatDate(r.createdAt)}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRecord(r);
                        }}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-medium text-xs transition border border-slate-200"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalRecords={totalRecords}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Submission Detail Modal / Drawer */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                  {selectedRecord.ticketId}
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {selectedRecord.fullName} &bull; {selectedRecord.company}
                  </h3>
                  <div className="text-[11px] text-slate-500">
                    Submitted {formatDate(selectedRecord.createdAt)}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
              {/* Status Update Banner */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800">Current Status:</span>
                  {getStatusBadge(selectedRecord.status)}
                  {statusUpdateSuccess && (
                    <span className="flex items-center gap-1 text-emerald-600 font-medium text-[11px] animate-pulse">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Updated in DB
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Change Status:</span>
                  <select
                    disabled={updatingStatus}
                    value={selectedRecord.status}
                    onChange={(e) => handleUpdateStatus(selectedRecord.ticketId, e.target.value)}
                    aria-label="Change ticket status"
                    className="px-2.5 py-1 rounded bg-white border border-slate-300 font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="new">New</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Client & Organization Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Client Name
                  </div>
                  <div className="font-semibold text-slate-900 text-sm">
                    {selectedRecord.fullName}
                  </div>
                  <div className="flex items-center gap-1 text-slate-600">
                    <Building className="w-3 h-3 text-slate-400" />
                    <span>{selectedRecord.company}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Direct Contact
                  </div>
                  <div className="flex items-center gap-1 text-slate-800 font-mono text-[11px]">
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    <a href={`mailto:${selectedRecord.email}`} className="text-blue-600 hover:underline">
                      {selectedRecord.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-1 text-slate-600">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{selectedRecord.phone || 'No phone provided'}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Cloud Platform
                  </div>
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Cloud className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{selectedRecord.cloudPlatform}</span>
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    Monthly Budget: <span className="font-mono text-slate-800">{selectedRecord.monthlySpend}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Requested Practice
                  </div>
                  <div className="font-semibold text-slate-900">
                    {selectedRecord.serviceType}
                  </div>
                  {selectedRecord.userId && (
                    <div className="text-[10px] text-slate-400 font-mono truncate">
                      Linked User: {selectedRecord.userId}
                    </div>
                  )}
                </div>
              </div>

              {/* Client Message & Audit Scope */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Client Objectives & Architectural Scope
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 leading-relaxed whitespace-pre-wrap font-sans text-xs">
                  {selectedRecord.message || 'No additional message was provided with this submission.'}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <a
                href={`mailto:${selectedRecord.email}?subject=Regarding Your Cloud Architecture Inquiry (${selectedRecord.ticketId})`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition shadow-2xs"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Contact Client ({selectedRecord.email})</span>
              </a>

              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium text-xs transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
