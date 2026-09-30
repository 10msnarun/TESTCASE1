import React, { useState, useEffect } from 'react';
import { useAuth, DbUser } from '../context/AuthContext';
import { PageType } from '../types';
import { 
  Cloud, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  Database, 
  Sparkles, 
  Building2, 
  UserCheck, 
  Mail, 
  KeyRound, 
  Server,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';

interface SignInProps {
  onNavigate: (page: PageType) => void;
}

interface DemoProfile {
  uid: string;
  name: string;
  email: string;
  role: 'client' | 'architect' | 'admin';
  company: string;
  avatar: string;
  specialty: string;
  badge: string;
}

const DEMO_ACCOUNTS: DemoProfile[] = [
  {
    uid: 'demo_user_sarah_101',
    name: 'Sarah Chen',
    email: 'sarah.chen@finvantage.com',
    role: 'client',
    company: 'FinVantage Global',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    specialty: 'AWS EKS Migration & FinOps Audit',
    badge: 'Enterprise Client'
  },
  {
    uid: 'demo_user_marcus_202',
    name: 'Marcus Vance, AWS Fellow',
    email: 'marcus.vance@liscloud.com',
    role: 'architect',
    company: 'LIS Cloud Consulting',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    specialty: 'Principal Lead Architect (All Tickets)',
    badge: 'Lead Architect'
  },
  {
    uid: 'demo_user_elena_303',
    name: 'Elena Rostova',
    email: 'elena.rostova@omnihealth.io',
    role: 'admin',
    company: 'OmniHealth Systems',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    specialty: 'Healthcare Cloud Compliance & SOC 2',
    badge: 'Infra Admin'
  },
  {
    uid: 'demo_user_david_404',
    name: 'David Kim',
    email: 'david.kim@aeroretail.com',
    role: 'client',
    company: 'AeroRetail Global',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    specialty: 'Azure AKS Modernization ($250k/mo)',
    badge: 'Enterprise Client'
  }
];

export const SignIn: React.FC<SignInProps> = ({ onNavigate }) => {
  const { user, dbUser, signInWithGoogle, signInWithDemoUser, signInWithEmail } = useAuth();
  const [email, setEmail] = useState('sarah.chen@finvantage.com');
  const [password, setPassword] = useState('password123');
  const [fullName, setFullName] = useState('Sarah Chen');
  const [loading, setLoading] = useState(false);
  const [demoLoadingId, setDemoLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'demo' | 'email'>('demo');

  // If already logged in, show logged-in prompt or navigate to portal
  useEffect(() => {
    if (user || dbUser) {
      // Allow user to go straight to portal
    }
  }, [user, dbUser]);

  const handleDemoSignIn = async (demo: DemoProfile) => {
    try {
      setError(null);
      setDemoLoadingId(demo.uid);
      await signInWithDemoUser(demo.uid);
      onNavigate('portal');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to sign in with demo account');
    } finally {
      setDemoLoadingId(null);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      setLoading(true);
      await signInWithGoogle();
      onNavigate('portal');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Google sign-in was cancelled or encountered an error.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid business email address.');
      return;
    }
    try {
      setError(null);
      setLoading(true);
      await signInWithEmail(email, fullName);
      onNavigate('portal');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-gradient-to-b from-purple-50/60 via-white to-purple-50/30 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider mb-4 border border-purple-200">
            <Lock className="w-3.5 h-3.5 text-purple-700" />
            Enterprise Architecture Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Sign In to <span className="bg-gradient-to-r from-purple-700 to-indigo-800 bg-clip-text text-transparent">LIS Cloud Portal</span>
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            Review real-time PostgreSQL architecture audit tickets, FinOps telemetry, and Well-Architected milestone deliverables.
          </p>
        </div>

        {/* Database Connected Status Pill */}
        <div className="mb-8 flex items-center justify-center">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-emerald-200 shadow-xs text-xs font-semibold text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>Cloud SQL PostgreSQL (asia-southeast1) Ready • Drizzle ORM Active</span>
          </div>
        </div>

        {/* If Already Logged In Banner */}
        {dbUser && (
          <motion.div 
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 rounded-2xl bg-purple-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-purple-900/10"
          >
            <div className="flex items-center gap-3">
              {dbUser.photoUrl ? (
                <img src={dbUser.photoUrl} alt={dbUser.displayName || 'User'} className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-300" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-purple-700 text-white flex items-center justify-center font-bold">
                  {dbUser.displayName?.charAt(0) || 'U'}
                </div>
              )}
              <div>
                <div className="font-bold text-sm">Already signed in as {dbUser.displayName || dbUser.email}</div>
                <div className="text-xs text-purple-200">Role: <span className="uppercase font-semibold tracking-wider text-purple-300">{dbUser.role}</span> • Account authenticated in PostgreSQL</div>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => onNavigate('portal')}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-white text-purple-900 font-bold text-xs hover:bg-purple-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Enter Architecture Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-bold">Authentication Notice</div>
              <div className="text-xs text-rose-700">{error}</div>
            </div>
            <button onClick={() => setError(null)} className="text-rose-500 hover:text-rose-700 text-xs cursor-pointer">✕</button>
          </div>
        )}

        {/* Main Sign-In Card */}
        <div className="bg-white rounded-3xl border border-purple-100 shadow-xl shadow-purple-900/5 overflow-hidden">
          
          {/* Top Switcher Tabs */}
          <div className="flex border-b border-slate-100 bg-slate-50/50">
            <button
              onClick={() => setActiveTab('demo')}
              className={`flex-1 py-4 px-6 text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'demo'
                  ? 'bg-white text-purple-800 border-b-2 border-purple-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>1-Click Enterprise Demo Profiles</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-100 text-purple-700 font-extrabold uppercase">
                Instant DB Test
              </span>
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`flex-1 py-4 px-6 text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'email'
                  ? 'bg-white text-purple-800 border-b-2 border-purple-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mail className="w-4 h-4 text-slate-500" />
              <span>Google &amp; Corporate Email</span>
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {activeTab === 'demo' ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Select an Enterprise Persona</h2>
                    <p className="text-xs text-slate-500">Each account is pre-seeded with live PostgreSQL audit tickets and role-based permissions.</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-purple-700 font-semibold bg-purple-50 px-2.5 py-1 rounded-lg">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Real DB Records</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {DEMO_ACCOUNTS.map((demo) => {
                    const isSigningThis = demoLoadingId === demo.uid;
                    const isCurrent = dbUser?.uid === demo.uid;

                    return (
                      <div
                        key={demo.uid}
                        className={`group relative p-4 rounded-2xl border transition-all duration-200 text-left ${
                          isCurrent 
                            ? 'border-purple-600 bg-purple-50/70 ring-2 ring-purple-600/20' 
                            : 'border-slate-200 hover:border-purple-300 hover:shadow-md hover:bg-purple-50/20'
                        }`}
                      >
                        <div className="flex items-start gap-3.5">
                          <img
                            src={demo.avatar}
                            alt={demo.name}
                            className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 group-hover:scale-105 transition-transform shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-slate-900 truncate">{demo.name}</span>
                              <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                                demo.role === 'admin' 
                                  ? 'bg-amber-100 text-amber-800' 
                                  : demo.role === 'architect'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-indigo-100 text-indigo-800'
                              }`}>
                                {demo.badge}
                              </span>
                            </div>
                            <div className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                              <Building2 className="w-3 h-3 text-slate-400" />
                              <span className="truncate">{demo.company}</span>
                            </div>
                            <div className="text-[11px] text-purple-700 font-medium mt-1 truncate">
                              {demo.specialty}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[11px] text-slate-500 font-mono truncate">{demo.email}</span>
                          <button
                            onClick={() => handleDemoSignIn(demo)}
                            disabled={isSigningThis}
                            id={`signin-demo-${demo.role}`}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                              isCurrent
                                ? 'bg-purple-700 text-white shadow-xs'
                                : 'bg-slate-900 text-white hover:bg-purple-700'
                            }`}
                          >
                            {isSigningThis ? (
                              <span>Authenticating...</span>
                            ) : isCurrent ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                                <span>Active Session</span>
                              </>
                            ) : (
                              <>
                                <span>Sign In as {demo.name.split(' ')[0]}</span>
                                <ArrowRight className="w-3 h-3" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="max-w-md mx-auto">
                {/* Google Sign In Button */}
                <button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  id="google-signin-btn-page"
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointer mb-6"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.14z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>{loading ? 'Connecting with Google...' : 'Continue with Enterprise Google'}</span>
                </button>

                <div className="relative my-6 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <span className="relative bg-white px-3 text-xs uppercase tracking-wider text-slate-400 font-bold">
                    Or Sign in with Email
                  </span>
                </div>

                {/* Email Sign In Form */}
                <form onSubmit={handleEmailSignIn} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Business Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Full Name (for new accounts)
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Sarah Chen"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Password
                      </label>
                      <span className="text-[11px] text-purple-700">Any password for demo</span>
                    </div>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    id="submit-email-signin-btn"
                    className="w-full mt-4 py-3 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-sm font-bold shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{loading ? 'Authenticating with PostgreSQL...' : 'Sign In to Architecture Portal'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Footer Security Badges */}
          <div className="px-6 py-4 bg-purple-50/50 border-t border-purple-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-700" />
              <span>SOC 2 Type II Encrypted Session</span>
            </div>
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-purple-700" />
              <span>Connected to Cloud SQL PostgreSQL Instance</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-700" />
              <span>Role-Based Access Control (RBAC)</span>
            </div>
          </div>
        </div>

        {/* Quick Links Back to Home */}
        <div className="mt-8 text-center text-xs text-slate-500">
          Looking for our public solutions?{' '}
          <button onClick={() => onNavigate('home')} className="text-purple-700 font-bold hover:underline cursor-pointer">
            Return to LIS Home
          </button>{' '}
          •{' '}
          <button onClick={() => onNavigate('contact')} className="text-purple-700 font-bold hover:underline cursor-pointer">
            Request Free Audit Ticket
          </button>
        </div>
      </div>
    </div>
  );
};
