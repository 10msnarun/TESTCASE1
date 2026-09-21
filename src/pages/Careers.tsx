import React, { useState } from 'react';
import { PageType, JobOpening } from '../types';
import { CAREER_OPENINGS } from '../data/content';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  X, 
  Sparkles, 
  Award, 
  Send, 
  ShieldCheck,
  Laptop
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CareersProps {
  onNavigate: (page: PageType) => void;
}

export const Careers: React.FC<CareersProps> = ({ onNavigate }) => {
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [activeJob, setActiveJob] = useState<JobOpening | null>(null);
  
  // Application Modal state
  const [applyingJob, setApplyingJob] = useState<JobOpening | null>(null);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantLinkedIn, setApplicantLinkedIn] = useState('');
  const [applicantNotes, setApplicantNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const departments = ['All', 'Cloud Architecture & Modernization', 'Platform Engineering', 'FinOps Practice', 'Security & Compliance', 'Reliability & Managed Operations'];

  const filteredJobs = CAREER_OPENINGS.filter(j => {
    if (selectedDept === 'All') return true;
    return j.department === selectedDept;
  });

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantEmail) return;
    setSubmitted(true);
  };

  const closeApplyModal = () => {
    setApplyingJob(null);
    setSubmitted(false);
    setApplicantName('');
    setApplicantEmail('');
    setApplicantPhone('');
    setApplicantLinkedIn('');
    setApplicantNotes('');
  };

  return (
    <div className="w-full bg-white">
      {/* Header */}
      <section className="pt-14 pb-16 bg-gradient-to-b from-purple-50/70 via-white to-white border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100/70 px-3 py-1 rounded-full border border-purple-200">
            Join The Elite Cloud Practice
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mt-3">
            Architect the Cloud with Exceptional Peers.
          </h1>
          <p className="text-lg text-slate-600 mt-4 leading-relaxed">
            At LIS, you won't be trapped in bureaucratic hierarchies or forced to write useless slide decks. You’ll solve high-stakes distributed systems challenges for industry leaders.
          </p>
        </div>
      </section>

      {/* Culture & Perks Grid */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-7 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-700 text-white flex items-center justify-center">
                <Laptop className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Remote-First Flexibility</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Work from anywhere in North America, EMEA, or APAC, backed by top-tier home office stipends and regional co-working passes.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-700 text-white flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">100% Certification Sponsorship</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Unlimited exam vouchers, dedicated study days, and cash bonuses for completing AWS Pro, Azure Expert, and CKA certifications.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-700 text-white flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Top 5% Compensation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Industry-leading base salaries, performance-driven profit-sharing distributions, and comprehensive health/retirement benefits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section className="py-20 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-white px-3 py-1 rounded-full border border-purple-200">
                Current Openings
              </span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                Explore Engineering Roles
              </h2>
            </div>

            {/* Department Filter */}
            <div className="flex flex-wrap gap-1.5">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedDept === dept
                      ? 'bg-purple-700 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-purple-50 border border-slate-200'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Job List */}
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2.5 py-0.5 rounded-md font-bold bg-purple-100 text-purple-800">
                      {job.department}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <MapPin className="w-3.5 h-3.5" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      {job.experience}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">
                    {job.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {job.summary}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => setActiveJob(job)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 hover:border-purple-400 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => setApplyingJob(job)}
                    className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs transition-all cursor-pointer shadow-sm"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Details Modal */}
      <AnimatePresence>
        {activeJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-purple-200"
            >
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex justify-between items-start gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block mb-1">
                      {activeJob.department}
                    </span>
                    <h3 className="text-2xl font-black text-slate-900">{activeJob.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{activeJob.location} • {activeJob.type}</p>
                  </div>
                  <button
                    onClick={() => setActiveJob(null)}
                    className="p-2 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 text-xs sm:text-sm">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">Key Responsibilities:</h4>
                    <ul className="space-y-1.5 text-slate-600">
                      {activeJob.responsibilities.map((r, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2">
                    <h4 className="font-bold text-slate-900 mb-2">Requirements &amp; Credentials:</h4>
                    <ul className="space-y-1.5 text-slate-600">
                      {activeJob.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 flex justify-end gap-3">
                  <button
                    onClick={() => setActiveJob(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      const j = activeJob;
                      setActiveJob(null);
                      setApplyingJob(j);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-purple-700 text-white font-bold text-xs hover:bg-purple-800 transition-colors cursor-pointer"
                  >
                    Apply for this Role
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quick Application Modal */}
      <AnimatePresence>
        {applyingJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-purple-200"
            >
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex justify-between items-start gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider block">
                      Direct Application
                    </span>
                    <h3 className="text-xl font-black text-slate-900">{applyingJob.title}</h3>
                  </div>
                  <button
                    onClick={closeApplyModal}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {submitted ? (
                  <div className="p-6 text-center space-y-3 bg-purple-50 rounded-2xl border border-purple-200">
                    <div className="w-12 h-12 rounded-full bg-purple-700 text-white mx-auto flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold text-purple-900">Application Received!</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Thank you for applying to join LIS Cloud Consulting. Our engineering talent lead will review your background and respond within 2 business days.
                    </p>
                    <button
                      onClick={closeApplyModal}
                      className="mt-2 px-5 py-2 rounded-xl bg-purple-700 text-white font-bold text-xs cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        placeholder="Dr. Jordan Hayes"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={applicantEmail}
                        onChange={(e) => setApplicantEmail(e.target.value)}
                        placeholder="jordan@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={applicantPhone}
                        onChange={(e) => setApplicantPhone(e.target.value)}
                        placeholder="+1 (555) 019-2834"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">LinkedIn or GitHub Profile URL</label>
                      <input
                        type="url"
                        value={applicantLinkedIn}
                        onChange={(e) => setApplicantLinkedIn(e.target.value)}
                        placeholder="https://linkedin.com/in/jordan-hayes"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Brief Introduction &amp; Cloud Certifications</label>
                      <textarea
                        rows={3}
                        value={applicantNotes}
                        onChange={(e) => setApplicantNotes(e.target.value)}
                        placeholder="List your key AWS/Azure certifications and notable distributed systems work..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Application</span>
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
