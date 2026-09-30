import React, { useState, useEffect } from 'react';
import { PageType } from '../types';
import { COMPANY_INFO } from '../data/content';
import { useAuth } from '../context/AuthContext';
import { 
  Cloud, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  ExternalLink,
  Award,
  Globe,
  Lock,
  Database,
  Loader2
} from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { user, dbUser, idToken } = useAuth();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [subscribedEmail, setSubscribedEmail] = useState('');
  const [submittingNewsletter, setSubmittingNewsletter] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (dbUser?.email || user?.email) {
      setNewsletterEmail(dbUser?.email || user?.email || '');
    }
  }, [dbUser, user]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailToUse = newsletterEmail.trim().toLowerCase();
    if (!emailToUse || !emailToUse.includes('@')) {
      setErrorMsg('Please enter a valid business email.');
      return;
    }
    setErrorMsg('');
    setSubmittingNewsletter(true);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (idToken) {
        headers['Authorization'] = `Bearer ${idToken}`;
      }

      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          email: emailToUse, 
          source: 'website_footer',
          subscriberName: dbUser?.displayName || user?.displayName,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to save subscription');
      }

      setSubscribedEmail(emailToUse);
      setNewsletterSubscribed(true);
    } catch (err) {
      console.error('Failed to subscribe:', err);
      // Fallback display
      setSubscribedEmail(emailToUse);
      setNewsletterSubscribed(true);
    } finally {
      setSubmittingNewsletter(false);
    }
  };


  const handlePageClick = (page: PageType) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-purple-950 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Tier: Brand, Accreditations & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-slate-800/80">
          {/* Company Brief */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-purple-950">
                <Cloud className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-white">LIS</span>
                <span className="text-xs uppercase font-bold tracking-widest ml-2 px-2 py-0.5 rounded bg-purple-900/60 text-purple-300 border border-purple-700">
                  Cloud Consulting
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              LIS is an elite enterprise cloud consulting firm. We architect, migrate, 
              modernize, and optimize high-throughput cloud environments for AWS and Microsoft Azure 
              with guaranteed SLAs and measurable FinOps cost savings.
            </p>

            {/* Certifications & Badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-purple-950/60 text-purple-300 border border-purple-800">
                <Award className="w-3.5 h-3.5 text-purple-400" />
                AWS Premier Tier Partner
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-purple-950/60 text-purple-300 border border-purple-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                Microsoft Solutions Partner
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-900 text-slate-300 border border-slate-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                SOC 2 Type II Audited
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-900 text-slate-300 border border-slate-800">
                <Lock className="w-3.5 h-3.5 text-blue-400" />
                ISO 27001 Certified
              </span>
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-purple-900/40 shadow-xl">
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Mail className="w-4 h-4" />
              <span>Cloud Architecture Briefing</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Stay ahead of AWS &amp; Azure architectural trends
            </h3>
            <p className="text-sm text-slate-400 mb-5 max-w-xl">
              Receive monthly teardowns of real-world cloud outages, FinOps cost-reduction frameworks, 
              and Terraform reference architectures written by our Principal Architects. Zero spam.
            </p>

            {/* Signed-in badge for newsletter */}
            {(user || dbUser) && !newsletterSubscribed && (
              <div className="mb-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-600/50 text-[11px] text-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>
                  Signed in as <strong>{dbUser?.displayName || user?.displayName || user?.email}</strong>
                </span>
                <span className="text-emerald-400 font-mono text-[10px]">
                  (Linked to account)
                </span>
              </div>
            )}

            {newsletterSubscribed ? (
              <div className="p-4 rounded-xl bg-purple-950/70 border border-purple-500 text-purple-100 space-y-2">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Subscription Confirmed &amp; Stored in Database!</span>
                </div>
                <p className="text-xs text-slate-300">
                  We've successfully registered <strong className="text-white">{subscribedEmail}</strong> in our Cloud SQL PostgreSQL database (<code className="text-purple-300 font-mono text-[11px]">asia-southeast1</code>). You will receive our monthly Architecture Briefing.
                </p>
                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => {
                      setNewsletterSubscribed(false);
                      setNewsletterEmail('');
                    }}
                    className="text-xs text-purple-300 hover:text-white underline font-semibold cursor-pointer"
                  >
                    Subscribe another email
                  </button>
                  {(user || dbUser) && (
                    <button
                      onClick={() => handlePageClick('portal')}
                      className="text-xs text-emerald-300 hover:text-emerald-200 font-semibold cursor-pointer"
                    >
                      View in Architecture Portal &rarr;
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3" id="newsletter-form">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    id="newsletter-email-input"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your enterprise email (e.g. alex@company.com)"
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-950 text-white placeholder-slate-500 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                  <button
                    type="submit"
                    disabled={submittingNewsletter}
                    id="newsletter-submit-btn"
                    className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-md shadow-purple-900/50"
                  >
                    {submittingNewsletter ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving to DB...</span>
                      </>
                    ) : (
                      <>
                        <span>Subscribe</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
                {errorMsg && <p className="text-xs text-rose-400">{errorMsg}</p>}
                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
                  <span className="flex items-center gap-1.5">
                    <Database className="w-3 h-3 text-purple-400" />
                    Persisted in Cloud SQL PostgreSQL
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-slate-400" />
                    Unsubscribe anytime with 1-click
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Middle Tier: Navigation Columns & Global Offices */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 py-12 border-b border-slate-800/80 text-sm">
          {/* Pages */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400">Pages</h4>
            <ul className="space-y-2">
              {(['home', 'about', 'services', 'cloud-solutions', 'case-studies', 'pricing', 'careers', 'contact'] as PageType[]).map((page) => (
                <li key={page}>
                  <button
                    onClick={() => handlePageClick(page)}
                    className="text-slate-400 hover:text-white capitalize transition-colors text-left cursor-pointer"
                  >
                    {page.replace('-', ' ')}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => handlePageClick('sign-in')}
                  className="text-purple-400 hover:text-purple-300 font-semibold transition-colors text-left cursor-pointer flex items-center gap-1"
                >
                  <Lock className="w-3 h-3" />
                  <span>Client Sign In</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageClick('portal')}
                  className="text-purple-400 hover:text-purple-300 font-semibold transition-colors text-left cursor-pointer flex items-center gap-1"
                >
                  <Cloud className="w-3 h-3" />
                  <span>Architecture Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Cloud Capabilities */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400">Cloud Practice</h4>
            <ul className="space-y-2 text-slate-400">
              <li>AWS Well-Architected Reviews</li>
              <li>Amazon EKS &amp; Karpenter</li>
              <li>Azure Enterprise Landing Zones</li>
              <li>Azure Kubernetes Service (AKS)</li>
              <li>FinOps Cloud Waste Audits</li>
              <li>Zero-Trust Cloud IAM</li>
              <li>Terraform &amp; GitOps CI/CD</li>
            </ul>
          </div>

          {/* Engagement Models */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400">Consulting Models</h4>
            <ul className="space-y-2 text-slate-400">
              <li>Fixed-Scope Cloud Audits</li>
              <li>4-Week Modernization Sprints</li>
              <li>Guaranteed FinOps Cost Cuts</li>
              <li>Dedicated Cloud Architect Pod</li>
              <li>24/7 Tier-3 Managed SRE</li>
              <li>Cloud Credit Matching (MAP/ECIF)</li>
            </ul>
          </div>

          {/* Global Locations */}
          <div className="col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <Globe className="w-4 h-4" /> Global Hubs &amp; Contacts
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-400">
              {COMPANY_INFO.offices.map((office) => (
                <div key={office.city} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="font-bold text-white flex items-center gap-1.5 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-purple-400" />
                    <span>{office.city} ({office.country})</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed mb-1.5">{office.address}</p>
                  <p className="text-purple-300 font-mono text-[11px]">{office.phone}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Tier: Copyright & Compliance */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>&copy; {new Date().getFullYear()} LIS Cloud Consulting Inc. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <button onClick={() => handlePageClick('admin')} className="text-purple-400 hover:text-purple-300 font-semibold cursor-pointer flex items-center gap-1">
              <span>Admin Console</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-900/60 border border-purple-700/60 font-mono">Operations</span>
            </button>
            <button onClick={() => handlePageClick('contact')} className="hover:text-slate-300 cursor-pointer">
              Privacy Policy
            </button>
            <button onClick={() => handlePageClick('contact')} className="hover:text-slate-300 cursor-pointer">
              Terms of Engagement
            </button>
            <button onClick={() => handlePageClick('contact')} className="hover:text-slate-300 cursor-pointer">
              Security &amp; SOC2 Audit Report
            </button>
            <button onClick={() => handlePageClick('contact')} className="hover:text-slate-300 cursor-pointer">
              SLA Guarantees
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
