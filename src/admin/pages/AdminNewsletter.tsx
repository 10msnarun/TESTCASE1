import React, { useState, useEffect } from 'react';
import { 
  Search, 
  RefreshCw, 
  Mail, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  Tag
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { AdminPagination } from '../components/AdminPagination';

export interface NewsletterRecord {
  id: number;
  email: string;
  subscriberName: string | null;
  userId: string | null;
  source: string;
  createdAt: string | null;
}

export const AdminNewsletter: React.FC = () => {
  const { adminToken } = useAdminAuth();
  const [records, setRecords] = useState<NewsletterRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm.trim()) params.append('search', searchTerm.trim());
      if (sourceFilter !== 'all') params.append('source', sourceFilter);
      params.append('page', currentPage.toString());
      params.append('limit', pageSize.toString());

      const res = await fetch(`/api/admin/newsletter-subscribers?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch subscribers');
      }

      const data = await res.json();
      setRecords(data.records);
      setTotalRecords(data.pagination.total);
      setTotalPages(data.pagination.totalPages);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching subscribers:', err);
      setError(err.message || 'Failed to load newsletter subscribers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [adminToken, currentPage, pageSize, sourceFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchRecords();
  };

  const handleExportCSV = () => {
    if (records.length === 0) return;
    const headers = ['ID', 'Email', 'Subscriber Name', 'Source', 'Subscribed Date'];
    const rows = records.map(r => [
      r.id,
      `"${r.email}"`,
      `"${r.subscriberName || ''}"`,
      `"${r.source}"`,
      `"${r.createdAt || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `lis_subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            Newsletter Subscribers
            <span className="text-xs font-mono font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full border border-slate-200">
              {totalRecords} active
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Records stored in Azure PostgreSQL table <code className="font-mono text-slate-700">newsletter_subscriptions</code>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search subscriber email..."
                className="pl-9 pr-3 py-1.5 w-60 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition"
            >
              Search
            </button>
          </form>

          {/* Export CSV button */}
          <button
            onClick={handleExportCSV}
            disabled={records.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition disabled:opacity-50"
            title="Export to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Source:</span>
            <select
              value={sourceFilter}
              onChange={(e) => {
                setSourceFilter(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter by subscription source"
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Sources</option>
              <option value="website_footer">Website Footer</option>
              <option value="portal">Architecture Portal</option>
              <option value="footer">General Footer</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => {
            setSearchTerm('');
            setSourceFilter('all');
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

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Subscriber Email</th>
                <th className="py-3 px-4">Subscriber Name</th>
                <th className="py-3 px-4">Acquisition Source</th>
                <th className="py-3 px-4">Linked User UID</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Subscribed Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                      <span>Querying PostgreSQL newsletter_subscriptions...</span>
                    </div>
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No newsletter subscriptions found matching criteria.
                  </td>
                </tr>
              ) : (
                records.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-blue-500" />
                        <span>{r.email}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-700">
                      {r.subscriberName || <span className="text-slate-400 italic">None</span>}
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        <Tag className="w-3 h-3 text-slate-400" />
                        {r.source}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                      {r.userId || 'Guest'}
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-emerald-600 text-[11px] font-semibold">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {formatDate(r.createdAt)}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <a
                        href={`mailto:${r.email}?subject=LIS Cloud Architecture Executive Briefing`}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-medium text-xs transition border border-slate-200 inline-block"
                      >
                        Email
                      </a>
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
    </div>
  );
};
