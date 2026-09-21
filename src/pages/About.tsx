import React from 'react';
import { PageType } from '../types';
import { COMPANY_INFO } from '../data/content';
import { 
  ShieldCheck, 
  Award, 
  Users, 
  Globe, 
  CheckCircle2, 
  Code2, 
  Server, 
  Building2, 
  Sparkles,
  ArrowRight,
  PhoneCall
} from 'lucide-react';
import { motion } from 'motion/react';

interface AboutProps {
  onNavigate: (page: PageType) => void;
}

export const About: React.FC<AboutProps> = ({ onNavigate }) => {
  const leadershipTeam = [
    {
      name: 'Julian Vance, Ph.D.',
      role: 'Chief Executive Officer & Founder',
      bio: 'Former Principal Cloud Architect at Amazon Web Services. 18+ years leading petabyte-scale distributed systems and cloud transformations.',
      certs: ['AWS Solutions Architect - Pro', 'AWS Security Specialty']
    },
    {
      name: 'Sarah Lin-Sterling',
      role: 'Chief Technology Officer',
      bio: 'Ex-Microsoft Azure Partner Solution Architect. Specializes in Azure Enterprise Landing Zones, AKS cluster security, and multi-tenant architectures.',
      certs: ['Azure Solutions Architect Expert', 'Azure DevOps Expert']
    },
    {
      name: 'Ezekiel Thorne',
      role: 'Head of FinOps & Cloud Economics',
      bio: 'Pioneered unit-cost economics frameworks for public tech scaleups. Recovered over $40M in wasted enterprise cloud spend across 120+ audits.',
      certs: ['FinOps Certified Practitioner (FOCP)', 'AWS DevOps Pro']
    },
    {
      name: 'Maya Patel',
      role: 'VP of Cloud Security & Compliance',
      bio: 'Specialist in zero-trust architectures for regulated fintech, healthcare, and federal workloads. Directs SOC2, HIPAA, and ISO 27001 readiness.',
      certs: ['CISSP', 'Microsoft Cybersecurity Architect', 'AWS Security']
    }
  ];

  const milestones = [
    {
      year: '2018',
      title: 'LIS Founded in San Francisco',
      description: 'Established with a founding mission to eradicate junior consulting models by providing 100% principal-level cloud engineering.'
    },
    {
      year: '2020',
      title: 'AWS Premier Tier Accreditation',
      description: 'Recognized by Amazon Web Services for exemplary migrations and deep expertise in Amazon EKS and serverless refactoring.'
    },
    {
      year: '2022',
      title: 'Global Expansion to London & Singapore',
      description: 'Extended 24/7 Site Reliability Engineering and cloud modernizations across North America, EMEA, and Asia-Pacific.'
    },
    {
      year: '2024',
      title: 'Microsoft Solutions Partner for Infrastructure',
      description: 'Formalized enterprise Azure capability, establishing industry-recognized Azure OpenAI and Landing Zone engineering practices.'
    },
    {
      year: '2026',
      title: '$42M+ in Verified Cloud Cost Reductions',
      description: 'Over 450 enterprise client deployments delivered with 99.999% availability and industry-leading customer retention.'
    }
  ];

  return (
    <div className="w-full bg-white">
      {/* Header */}
      <section className="pt-14 pb-16 bg-gradient-to-b from-purple-50/80 via-white to-white border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100/70 px-3 py-1 rounded-full border border-purple-200">
            About LIS Cloud Consulting
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mt-3">
            Elite Cloud Engineers, Not Slide Deck Consultants.
          </h1>
          <p className="text-lg text-slate-600 mt-4 leading-relaxed">
            We founded LIS to eliminate the frustration of enterprise IT consulting: bloated junior teams, theoretical advice, and endless billable hours without production results.
          </p>
        </div>
      </section>

      {/* Core Mission & Value Pillars */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                Our Philosophy: Production Code, Verifiable ROI, and Absolute Craftsmanship.
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                When you partner with LIS, you work directly with certified Principal Architects and Senior DevOps Engineers who have built and defended mission-critical cloud footprints in production.
              </p>
              <p className="text-slate-600 text-base leading-relaxed">
                We believe that every dollar spent on cloud infrastructure must produce measurable business value. Whether it is accelerating release cycles from bi-weekly to hourly via GitOps, or eliminating $100k/month in unmonitored compute waste, we hold ourselves accountable to quantitative metrics.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100">
                  <div className="font-bold text-sm text-purple-900 mb-1">Code, Not PowerPoint</div>
                  <p className="text-xs text-slate-600">Every deliverable includes auditable Terraform/Bicep code, automated pipelines, and comprehensive runbooks.</p>
                </div>
                <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100">
                  <div className="font-bold text-sm text-purple-900 mb-1">Guaranteed Outcomes</div>
                  <p className="text-xs text-slate-600">Our FinOps and migration programs come with contractual uptime and cost savings milestones.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-2">
                <div className="text-3xl font-black text-purple-400">450+</div>
                <div className="text-sm font-bold">Enterprise Workloads</div>
                <p className="text-xs text-slate-400">Successfully migrated and modernized across AWS and Azure.</p>
              </div>
              <div className="p-6 rounded-2xl bg-purple-700 text-white space-y-2">
                <div className="text-3xl font-black text-white">$42M+</div>
                <div className="text-sm font-bold">Documented Savings</div>
                <p className="text-xs text-purple-100">Direct cloud bill reductions delivered to clients.</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-100 border border-slate-200 text-slate-900 space-y-2">
                <div className="text-3xl font-black text-purple-800">100%</div>
                <div className="text-sm font-bold">Certified Architects</div>
                <p className="text-xs text-slate-600">AWS Pro and Azure Expert credentials across all staff.</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-2">
                <div className="text-3xl font-black text-emerald-400">99.999%</div>
                <div className="text-sm font-bold">Reliability SLA</div>
                <p className="text-xs text-slate-400">High availability architectures with sub-second failover.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-white px-3 py-1 rounded-full border border-purple-200">
              Technical Leadership
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Led by Industry Veterans
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Our founders and practice leaders stay actively engaged in architectural reviews and customer delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {leadershipTeam.map((leader, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-purple-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-800 font-black text-xl flex items-center justify-center border border-purple-200">
                    {leader.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{leader.name}</h3>
                    <p className="text-xs font-semibold text-purple-700">{leader.role}</p>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {leader.bio}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 space-y-1">
                  {leader.certs.map((cert, cIdx) => (
                    <div key={cIdx} className="text-[10px] font-semibold text-slate-600 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-purple-700 shrink-0" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones & History */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              Company Journey
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              A History of Cloud Innovation
            </h2>
          </div>

          <div className="relative border-l-2 border-purple-200 ml-4 md:ml-32 space-y-10">
            {milestones.map((m, idx) => (
              <div key={idx} className="relative pl-6 md:pl-8">
                <span className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-purple-700 border-4 border-white shadow"></span>
                <span className="md:absolute md:-left-28 md:top-1 text-sm font-black text-purple-800 tracking-wider">
                  {m.year}
                </span>
                <h3 className="text-lg font-bold text-slate-900">{m.title}</h3>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed max-w-xl">
                  {m.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Locations Banner */}
      <section className="py-16 bg-slate-900 text-white border-t border-purple-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Engineering Pods Operating in 4 Global Time Zones
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">
            Headquartered in San Francisco, with regional delivery centers in New York, London, and Singapore to support 24/7 cloud reliability.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('contact')}
              className="px-6 py-3 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-sm transition-all cursor-pointer"
            >
              Contact Our Global Offices
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
