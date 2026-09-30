import React, { useState, useEffect } from 'react';
import { 
  Search, 
  RefreshCw, 
  ExternalLink, 
  X, 
  Mail, 
  Phone, 
  Briefcase, 
  CheckCircle2, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { AdminPagination } from '../components/AdminPagination';

export interface JobApplicationRecord {
  id: number;
  jobId: string;
  jobTitle: string;
  applicantName: string;
  email: string;
  phone: string | null;
  linkedIn: string | null;
  notes: string | null;
  status: string;
  createdAt: string | null;
}

export const AdminJobApplications: React.FC = () => {
  const { adminToken } = useAdminAuth();
  const [records, setRecords] = useState<JobApplicationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Detail Modal
  const [selectedRecord, setSelectedRecord] = useState<JobApplicationRecord | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusUpdateSuccess, setStatusUpdateSuccess] = useState(false);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm.trim()) params.append('search', searchTerm.trim());
      if (statusFilter !== 'all') params.append('status', statusFilter);
      params.append('page', currentPage.toString());
      params.append('limit', pageSize.toString());

      const res = await fetch(`/api/admin/job-applications?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch job applications');
      }

      const data = await res.json();
      setRecords(data.records);
      setTotalRecords(data.pagination.total);
      setTotalPages(data.pagination.totalPages);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching job applications:', err);
      setError(err.message || 'Failed to load job applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [adminToken, currentPage, pageSize, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchRecords();
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    setUpdatingStatus(true);
    setStatusUpdateSuccess(false);
    try {
      const res = await fetch(`/api/admin/job-applications/${id}/status`, {
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
      setRecords(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
      if (selectedRecord && selectedRecord.id === id) {
        setSelectedRecord({ ...selectedRecord, status: newStatus });
      }
      setStatusUpdateSuccess(true);
      setTimeout(() => setStatusUpdateSuccess(false), 2500);
    } catch (err: any) {
      alert(`Error updating application status: ${err.message}`);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'submitted':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-100 text-purple-800 border border-purple-200">Submitted</span>;
      case 'reviewed':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800 border border-blue-200">Reviewed</span>;
      case 'interviewing':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">Interviewing</span>;
      case 'accepted':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">Accepted</span>;
      case 'rejected':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-100 text-rose-800 border border-rose-200">Rejected</span>;
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
            Job Applications
            <span className="text-xs font-mono font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full border border-slate-200">
              {totalRecords} candidates
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Records stored in Azure PostgreSQL table <code className="font-mono text-slate-700">job_applications</code>
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
              placeholder="Search candidate name, email, role..."
              className="pl-9 pr-3 py-1.5 w-64 md:w-80 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs transition"
          >
            Search
          </button>
        </form>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Hiring Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter by hiring status"
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="reviewed">Reviewed</option>
              <option value="interviewing">Interviewing</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => {
            setSearchTerm('');
            setStatusFilter('all');
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

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Applicant Name</th>
                <th className="py-3 px-4">Role & Job ID</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">LinkedIn</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Applied Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-purple-600" />
                      <span>Querying PostgreSQL job_applications...</span>
                    </div>
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No job applications found matching your criteria.
                  </td>
                </tr>
              ) : (
                records.map((r) => (
                  <tr 
                    key={r.id}
                    className="hover:bg-slate-50/80 transition cursor-pointer"
                    onClick={() => setSelectedRecord(r)}
                  >
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {r.applicantName}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800 flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-purple-600" />
                        <span>{r.jobTitle}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {r.jobId}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-700 font-mono text-[11px]">
                      {r.email}
                    </td>

                    <td className="py-3 px-4 text-slate-500">
                      {r.phone || 'N/A'}
                    </td>

                    <td className="py-3 px-4">
                      {r.linkedIn ? (
                        <a 
                          href={r.linkedIn} 
                          target="_blank" 
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-purple-600 hover:underline flex items-center gap-1 font-mono text-[11px]"
                        >
                          Profile <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Not provided</span>
                      )}
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
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 font-medium text-xs transition border border-slate-200"
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

      {/* Candidate Application Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {selectedRecord.applicantName}
                  </h3>
                  <div className="text-[11px] text-slate-500">
                    Applying for: <span className="font-semibold text-slate-800">{selectedRecord.jobTitle}</span> ({selectedRecord.jobId})
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
                  <span className="font-semibold text-slate-800">Review Status:</span>
                  {getStatusBadge(selectedRecord.status)}
                  {statusUpdateSuccess && (
                    <span className="flex items-center gap-1 text-emerald-600 font-medium text-[11px] animate-pulse">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Updated in DB
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Update Status:</span>
                  <select
                    disabled={updatingStatus}
                    value={selectedRecord.status}
                    onChange={(e) => handleUpdateStatus(selectedRecord.id, e.target.value)}
                    aria-label="Update candidate status"
                    className="px-2.5 py-1 rounded bg-white border border-slate-300 font-semibold text-slate-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="submitted">Submitted</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="interviewing">Interviewing</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Applicant Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Contact Email
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-900 font-mono text-sm">
                    <Mail className="w-3.5 h-3.5 text-purple-600" />
                    <a href={`mailto:${selectedRecord.email}`} className="text-purple-600 hover:underline">
                      {selectedRecord.email}
                    </a>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Phone Number
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-800">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedRecord.phone || 'No phone provided'}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1 sm:col-span-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    LinkedIn / Portfolio Profile
                  </div>
                  {selectedRecord.linkedIn ? (
                    <a 
                      href={selectedRecord.linkedIn} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-purple-600 font-mono text-xs flex items-center gap-1.5 hover:underline"
                    >
                      <span>{selectedRecord.linkedIn}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-slate-400 italic">None provided</span>
                  )}
                </div>
              </div>

              {/* Candidate Notes */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Candidate Background & Cover Notes
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 leading-relaxed whitespace-pre-wrap font-sans text-xs">
                  {selectedRecord.notes || 'No candidate cover notes supplied.'}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <a
                href={`mailto:${selectedRecord.email}?subject=Application for ${selectedRecord.jobTitle} at LIS Cloud Consulting`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition shadow-2xs"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Contact Applicant ({selectedRecord.email})</span>
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
