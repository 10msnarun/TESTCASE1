import React, { useState, useEffect } from 'react';
import { PageType } from './types';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { CloudSolutions } from './pages/CloudSolutions';
import { CaseStudies } from './pages/CaseStudies';
import { Pricing } from './pages/Pricing';
import { Careers } from './pages/Careers';
import { Contact } from './pages/Contact';
import { SignIn } from './pages/SignIn';
import { Portal } from './pages/Portal';
import { AdminApp } from './admin/AdminApp';
import { motion, AnimatePresence } from 'motion/react';

const PAGE_METADATA: Record<PageType, { title: string; desc: string }> = {
  home: {
    title: 'LIS Cloud Consulting | Enterprise AWS & Azure Cloud Architecture',
    desc: 'Certified enterprise cloud consulting for AWS and Microsoft Azure. Cloud migration, Kubernetes & DevOps automation, multi-cloud security, and FinOps cost optimization.'
  },
  about: {
    title: 'About LIS Cloud Consulting | Principal Architects & Practice History',
    desc: 'Learn about LIS Cloud Consulting, our technical leadership team, and our mission to provide elite engineering-first AWS and Azure consulting.'
  },
  services: {
    title: 'Cloud Services & Practices | LIS Cloud Consulting',
    desc: 'Explore LIS services: Enterprise Migration, DevOps & Kubernetes, FinOps Cost Reduction, Cloud Security & Zero Trust, 24/7 Managed SRE, and AI Platforms.'
  },
  'cloud-solutions': {
    title: 'AWS & Microsoft Azure Solutions Matrix | LIS Cloud Consulting',
    desc: 'Deep-dive architectural solutions for AWS (Well-Architected, EKS, Control Tower) and Microsoft Azure (CAF Landing Zones, AKS, Azure OpenAI).'
  },
  'case-studies': {
    title: 'Enterprise Case Studies | LIS Cloud Consulting',
    desc: 'Real-world migration, FinOps, and high availability case studies from FinVantage, OmniHealth, AeroRetail, and Apex Logistics.'
  },
  pricing: {
    title: 'Transparent Engagement Pricing & ROI Calculator | LIS Cloud Consulting',
    desc: 'Predictable pricing models for Cloud Audits, 4-week Modernization Sprints, FinOps Cost Guarantees, and dedicated Principal Architect Pods.'
  },
  careers: {
    title: 'Careers & Engineering Openings | LIS Cloud Consulting',
    desc: 'Join the elite team at LIS. Explore high-impact roles in Cloud Architecture, Platform Engineering, FinOps, Security, and SRE.'
  },
  contact: {
    title: 'Schedule Architecture Consultation | LIS Cloud Consulting',
    desc: 'Book a 30-minute discovery session with an LIS Principal Solutions Architect. Inquire about audits, migrations, and cost reductions.'
  },
  'sign-in': {
    title: 'Client Sign In & Architecture Portal | LIS Cloud Consulting',
    desc: 'Sign in to access your enterprise architecture tickets, Cloud SQL database records, Well-Architected reviews, and FinOps dashboards.'
  },
  portal: {
    title: 'Enterprise Architecture & FinOps Portal | LIS Cloud Consulting',
    desc: 'Manage and review your real-time cloud architecture audit tickets, blueprints, FinOps telemetry, and principal architect pods.'
  },
  admin: {
    title: 'Admin Console & Database Operations | LIS Cloud Consulting',
    desc: 'Executive management portal for Azure PostgreSQL database, consultation requests, candidate job applications, and subscribers.'
  }
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname.startsWith('/admin') || window.location.hash.startsWith('#admin')) {
        return 'admin';
      }
      const hash = window.location.hash.replace('#', '') as PageType;
      if (hash && PAGE_METADATA[hash]) {
        return hash;
      }
    }
    return 'home';
  });

  // Handle URL hash sync on load and changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as PageType;
      if (window.location.hash.startsWith('#admin') || window.location.pathname.startsWith('/admin')) {
        setCurrentPage('admin');
      } else if (hash && PAGE_METADATA[hash]) {
        setCurrentPage(hash);
      }
    };

    if (window.location.hash || window.location.pathname.startsWith('/admin')) {
      handleHashChange();
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update page title & meta description dynamically for SEO
  useEffect(() => {
    const meta = PAGE_METADATA[currentPage] || PAGE_METADATA.home;
    document.title = meta.title;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', meta.desc);

    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', meta.title);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', meta.desc);
  }, [currentPage]);

  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If in Admin mode, render the separate Admin Dashboard application
  if (currentPage === 'admin') {
    return <AdminApp onExitToPublic={() => handleNavigate('home')} />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'about':
        return <About onNavigate={handleNavigate} />;
      case 'services':
        return <Services onNavigate={handleNavigate} />;
      case 'cloud-solutions':
        return <CloudSolutions onNavigate={handleNavigate} />;
      case 'case-studies':
        return <CaseStudies onNavigate={handleNavigate} />;
      case 'pricing':
        return <Pricing onNavigate={handleNavigate} />;
      case 'careers':
        return <Careers onNavigate={handleNavigate} />;
      case 'contact':
        return <Contact onNavigate={handleNavigate} />;
      case 'sign-in':
        return <SignIn onNavigate={handleNavigate} />;
      case 'portal':
        return <Portal onNavigate={handleNavigate} />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-purple-100 selection:text-purple-900">
        {/* Top Sticky Navigation */}
        <Navbar 
          currentPage={currentPage} 
          onNavigate={handleNavigate}
          onOpenConsultation={() => handleNavigate('contact')}
        />

        {/* Main Page Content with Page Transition */}
        <main className="flex-1 w-full overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="w-full"
            >
              {renderCurrentPage()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Corporate Enterprise Footer */}
        <Footer onNavigate={handleNavigate} />

        {/* Interactive WhatsApp Floating Button */}
        <WhatsAppWidget />
      </div>
    </AuthProvider>
  );
}
