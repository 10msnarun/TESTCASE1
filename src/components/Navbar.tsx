import React, { useState, useEffect } from 'react';
import { PageType } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  Cloud, 
  Menu, 
  X, 
  ChevronRight, 
  PhoneCall, 
  ShieldCheck, 
  Layers, 
  ExternalLink,
  Sparkles,
  LogIn,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  onOpenConsultation?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentPage, 
  onNavigate,
  onOpenConsultation 
}) => {
  const { user, dbUser, signInWithGoogle, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setAuthLoading(true);
      await signInWithGoogle();
    } catch (e) {
      console.error('Sign in error:', e);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { id: PageType; label: string; badge?: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'cloud-solutions', label: 'AWS & Azure', badge: 'Solutions' },
    { id: 'case-studies', label: 'Case Studies' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'careers', label: 'Careers', badge: 'We\'re hiring' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (page: PageType) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Notification Announcement Bar */}
      {showBanner && (
        <div className="bg-purple-900 text-purple-100 text-xs sm:text-sm py-1.5 px-4 font-medium flex items-center justify-between border-b border-purple-800">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center w-full">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-700/80 text-[11px] font-semibold tracking-wide uppercase text-purple-200">
              <Sparkles className="w-3 h-3 text-purple-300" />
              Verified
            </span>
            <span>
              AWS Premier Tier Partner &amp; Microsoft Azure Gold Solutions Specialist — <button onClick={() => handleNavClick('cloud-solutions')} className="underline hover:text-white font-semibold cursor-pointer">Explore Solutions</button>
            </span>
          </div>
          <button 
            onClick={() => setShowBanner(false)}
            className="text-purple-300 hover:text-white text-xs p-1 ml-2 transition-colors cursor-pointer"
            aria-label="Close notification"
            id="close-announcement-btn"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Navigation Bar */}
      <nav 
        className={`w-full transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-purple-100 py-3' 
            : 'bg-white border-b border-slate-100 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-none"
            id="nav-logo-btn"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-700 via-purple-800 to-indigo-900 flex items-center justify-center shadow-md shadow-purple-900/10 group-hover:scale-105 transition-transform duration-200">
              <Cloud className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  LIS
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200">
                  Cloud
                </span>
              </div>
              <span className="text-[11px] font-semibold text-purple-600 tracking-wider uppercase">
                Enterprise Consulting
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer ${
                    isActive 
                      ? 'text-purple-700 bg-purple-50 font-bold' 
                      : 'text-slate-600 hover:text-purple-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {item.label}
                    {item.badge && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                        item.badge === 'We\'re hiring' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </span>
                  {isActive && (
                    <motion.div 
                      layoutId="activeNavIndicator" 
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-purple-700 rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  id="user-profile-menu-btn"
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors cursor-pointer"
                >
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || 'User'} 
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-purple-600" 
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-purple-700 text-white flex items-center justify-center text-xs font-bold">
                      {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <span className="text-xs font-bold text-slate-800 max-w-[100px] truncate">
                    {user.displayName?.split(' ')[0] || user.email?.split('@')[0]}
                  </span>
                </button>

                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-xs"
                    >
                      <div className="px-3 py-2 border-b border-slate-100">
                        <div className="font-bold text-slate-900 truncate">{user.displayName || 'Enterprise Client'}</div>
                        <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                        <div className="mt-1 inline-block px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-bold uppercase">
                          Role: {dbUser?.role || 'Client'}
                        </div>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            handleNavClick('contact');
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg text-slate-700 hover:bg-purple-50 hover:text-purple-900 font-medium cursor-pointer"
                        >
                          My Architecture Audits
                        </button>
                      </div>

                      <div className="pt-1 border-t border-slate-100">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            signOut();
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                disabled={authLoading}
                id="header-signin-btn"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-purple-800 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-purple-700" />
                <span>{authLoading ? 'Signing in...' : 'Sign In'}</span>
              </button>
            )}

            <button
              onClick={() => handleNavClick('contact')}
              id="header-consultation-cta"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-purple-700 text-white shadow-sm shadow-purple-600/20 hover:bg-purple-800 hover:shadow-md hover:shadow-purple-700/25 active:scale-95 transition-all duration-150 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Free Cloud Audit</span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center lg:hidden gap-2">
            <button
              onClick={() => handleNavClick('contact')}
              className="sm:hidden px-3 py-1.5 text-xs font-bold bg-purple-700 text-white rounded-lg cursor-pointer"
            >
              Free Audit
            </button>
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-purple-100 shadow-xl overflow-hidden"
          >
            <div className="px-4 pt-3 pb-6 space-y-1">
              {navItems.map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    id={`mobile-nav-link-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold transition-colors cursor-pointer ${
                      isActive 
                        ? 'bg-purple-50 text-purple-800 border-l-4 border-purple-700 font-bold' 
                        : 'text-slate-700 hover:bg-slate-50 hover:text-purple-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {item.label}
                      {item.badge && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium">
                          {item.badge}
                        </span>
                      )}
                    </span>
                    <ChevronRight className={`w-4 h-4 ${isActive ? 'text-purple-700' : 'text-slate-400'}`} />
                  </button>
                );
              })}

              <div className="pt-4 border-t border-slate-100 space-y-2">
                <button
                  onClick={() => handleNavClick('contact')}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold bg-purple-700 text-white shadow-md cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Schedule Consultation</span>
                </button>
                <div className="flex items-center justify-center gap-4 text-xs text-slate-500 pt-2">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-700" /> SOC 2 Audited
                  </span>
                  <span>•</span>
                  <span>AWS Premier Partner</span>
                  <span>•</span>
                  <span>Azure Gold</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
