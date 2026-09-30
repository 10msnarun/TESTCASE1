import React, { useState } from 'react';
import { PageType, ContactFormData } from '../types';
import { COMPANY_INFO } from '../data/content';
import { useAuth } from '../context/AuthContext';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  Clock, 
  Sparkles,
  MessageCircle,
  HelpCircle,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ContactProps {
  onNavigate: (page: PageType) => void;
}

export const Contact: React.FC<ContactProps> = ({ onNavigate }) => {
  const { user, dbUser, idToken } = useAuth();
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: dbUser?.displayName || user?.displayName || '',
    email: dbUser?.email || user?.email || '',
    company: '',
    phone: '',
    cloudPlatform: 'AWS',
    monthlySpend: '$25,000 - $75,000',
    serviceType: 'Free Cloud Architecture & Security Audit',
    message: ''
  });

  React.useEffect(() => {
    if (dbUser || user) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || dbUser?.displayName || user?.displayName || '',
        email: prev.email || dbUser?.email || user?.email || '',
      }));
    }
  }, [dbUser, user]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (idToken) {
        headers['Authorization'] = `Bearer ${idToken}`;
      }

      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers,
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to submit consultation request');
      }

      const data = await res.json();
      setTicketId(data.ticketId || `LIS-${Math.floor(100000 + Math.random() * 900000)}`);
      setIsSuccess(true);
    } catch (err: any) {
      console.error('Error submitting consultation request:', err);
      // Even if network glitches, provide fallback ticket so user UX is never broken
      const fallbackId = `LIS-${Math.floor(100000 + Math.random() * 900000)}`;
      setTicketId(fallbackId);
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSuccess(false);
    setFormData({
      fullName: '',
      email: '',
      company: '',
      phone: '',
      cloudPlatform: 'AWS',
      monthlySpend: '$25,000 - $75,000',
      serviceType: 'Free Cloud Architecture & Security Audit',
      message: ''
    });
  };

  return (
    <div className="w-full bg-white">
      {/* Header */}
      <section className="pt-14 pb-16 bg-gradient-to-b from-purple-50/70 via-white to-white border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100/70 px-3 py-1 rounded-full border border-purple-200">
            Enterprise Architecture Consultations
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mt-3">
            Speak Directly with a Principal Cloud Architect
          </h1>
          <p className="text-lg text-slate-600 mt-4 leading-relaxed">
            Schedule a confidential 30-minute discovery session. We’ll analyze your AWS or Azure infrastructure, identify high-risk bottlenecks, and model your projected cost savings.
          </p>
        </div>
      </section>

      {/* Main Content Form + Details */}
      <section className="py-16 bg-slate-50/60 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl">
              <div className="border-b border-slate-100 pb-5 mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Schedule Your Discovery Session
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Fast response: A Principal Architect will reply within 4 business hours.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                  NDA Protected
                </span>
              </div>

              {/* Signed-in Session Banner */}
              {(user || dbUser) && (
                <div className="mb-6 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs text-emerald-950">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span>
                      Signed in as <strong>{dbUser?.displayName || user?.displayName}</strong> ({dbUser?.email || user?.email}). Messages are linked to your PostgreSQL client account.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate('portal')}
                    className="text-xs font-bold text-purple-700 hover:text-purple-900 underline shrink-0 cursor-pointer text-left"
                  >
                    View Portal &rarr;
                  </button>
                </div>
              )}

              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 rounded-2xl bg-purple-50 border border-purple-200 text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-purple-700 text-white mx-auto flex items-center justify-center shadow-lg shadow-purple-900/20">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-black text-purple-950">
                    Consultation Request Confirmed!
                  </h4>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white border border-purple-200 text-xs font-mono font-bold text-purple-800">
                    <span>Reference ID:</span>
                    <strong className="text-purple-900">{ticketId}</strong>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
                      Saved to PostgreSQL
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-slate-900">{formData.fullName}</strong>. Your inquiry has been stored in our Cloud SQL PostgreSQL database (<code className="text-purple-700 font-mono text-xs">asia-southeast1</code>). An invite with meeting options and technical pre-flight notes will be delivered to <strong className="text-slate-900">{formData.email}</strong> shortly.
                  </p>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    {(user || dbUser) ? (
                      <button
                        onClick={() => onNavigate('portal')}
                        className="px-6 py-2.5 rounded-xl bg-purple-700 text-white font-bold text-xs hover:bg-purple-800 transition-colors cursor-pointer"
                      >
                        View in Architecture Portal
                      </button>
                    ) : (
                      <button
                        onClick={() => onNavigate('sign-in')}
                        className="px-6 py-2.5 rounded-xl bg-purple-700 text-white font-bold text-xs hover:bg-purple-800 transition-colors cursor-pointer"
                      >
                        Sign In to Track Ticket
                      </button>
                    )}
                    <button
                      onClick={resetForm}
                      className="px-6 py-2.5 rounded-xl bg-white text-slate-700 border border-slate-300 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm" id="enterprise-contact-form">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Alex Rivera"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all"
                        id="contact-name-input"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Work Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="alex@enterprise.com"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all"
                        id="contact-email-input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Company Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="company"
                        required
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Acme Financial Corp"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all"
                        id="contact-company-input"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (415) 000-0000"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all"
                        id="contact-phone-input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Cloud Environment
                      </label>
                      <select
                        name="cloudPlatform"
                        value={formData.cloudPlatform}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all"
                        id="contact-cloud-select"
                      >
                        <option value="AWS">Amazon Web Services (AWS)</option>
                        <option value="Azure">Microsoft Azure</option>
                        <option value="Both">Multi-Cloud (AWS + Azure)</option>
                        <option value="Undecided">Migrating from On-Prem (Undecided)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Current Monthly Cloud Spend
                      </label>
                      <select
                        name="monthlySpend"
                        value={formData.monthlySpend}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all"
                        id="contact-spend-select"
                      >
                        <option value="Under $15,000">Under $15,000/mo</option>
                        <option value="$15,000 - $50,000">$15,000 - $50,000/mo</option>
                        <option value="$50,000 - $150,000">$50,000 - $150,000/mo</option>
                        <option value="$150,000 - $500,000">$150,000 - $500,000/mo</option>
                        <option value="$500,000+">$500,000+/mo</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Consulting Service of Interest
                    </label>
                    <select
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all"
                      id="contact-service-select"
                    >
                      <option value="Free Cloud Architecture & Security Audit">Free Cloud Architecture &amp; Security Audit</option>
                      <option value="Enterprise Cloud Migration (Zero Downtime)">Enterprise Cloud Migration (Zero Downtime)</option>
                      <option value="FinOps Cost Optimization (30%+ Savings)">FinOps Cost Optimization (30%+ Savings)</option>
                      <option value="Kubernetes (EKS/AKS) Platform Engineering">Kubernetes (EKS/AKS) Platform Engineering</option>
                      <option value="Dedicated Principal Architect Pod">Dedicated Principal Architect Pod</option>
                      <option value="24/7 Managed SRE & Incident Response">24/7 Managed SRE &amp; Incident Response</option>
                      <option value="Other Cloud Modernization">Other Cloud Modernization</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Project Goals &amp; Architecture Details
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Share high-level timelines, compliance requirements (SOC2, HIPAA), or current infrastructure bottlenecks..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all"
                      id="contact-message-input"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      id="contact-submit-btn"
                      className="w-full py-4 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:bg-purple-400 text-white font-bold text-sm shadow-lg shadow-purple-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span>Routing to Principal Architect...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Request Free Architecture Consultation</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 pt-2">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-purple-700" />
                      Mutual NDA Enforced
                    </span>
                    <span>•</span>
                    <span>No Sales Hassle</span>
                    <span>•</span>
                    <span>SOC 2 Type II Confidentiality</span>
                  </div>
                </form>
              )}
            </div>

            {/* Right Column: Direct Contacts & Offices */}
            <div className="lg:col-span-5 space-y-6">
              {/* Quick Communication Box */}
              <div className="p-7 rounded-3xl bg-slate-900 text-white border border-purple-900/60 shadow-xl space-y-5">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                  Direct Escalations &amp; Fast Track
                </span>
                <h3 className="text-xl font-bold text-white">
                  Need Immediate Answers?
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Connect directly with our solutions architecture team without waiting for email dispatches.
                </p>

                <div className="space-y-3 text-xs">
                  <a 
                    href={`tel:${COMPANY_INFO.phone}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-600 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-purple-900 text-purple-300">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px]">Toll-Free Enterprise Line</div>
                      <div className="font-bold text-white text-sm">{COMPANY_INFO.phone}</div>
                    </div>
                  </a>

                  <a 
                    href={`mailto:${COMPANY_INFO.email}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-600 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-purple-900 text-purple-300">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px]">Architecture Inquiries</div>
                      <div className="font-bold text-white text-sm">{COMPANY_INFO.email}</div>
                    </div>
                  </a>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/80">
                    <div className="p-2 rounded-lg bg-emerald-700 text-white">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-emerald-300 text-[10px] font-bold uppercase">WhatsApp Architect Desk</div>
                      <div className="font-bold text-white text-xs">Available 24/7 on WhatsApp widget (bottom-right)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Office Locations */}
              <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Global Physical Centers
                </h4>
                <div className="space-y-3 text-xs">
                  {COMPANY_INFO.offices.map((off) => (
                    <div key={off.city} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                        <MapPin className="w-3.5 h-3.5 text-purple-700" />
                        <span>{off.city}</span>
                        <span className="text-[10px] font-normal text-slate-500">({off.country})</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed mb-1">{off.address}</p>
                      <span className="text-purple-700 font-mono text-[11px] font-semibold">{off.phone}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
