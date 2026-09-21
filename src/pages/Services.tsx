import React, { useState } from 'react';
import { PageType } from '../types';
import { SERVICES } from '../data/content';
import { 
  CloudUpload, 
  Container, 
  DollarSign, 
  ShieldCheck, 
  Activity, 
  BrainCircuit, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Layers, 
  Server, 
  Zap,
  PhoneCall,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';

interface ServicesProps {
  onNavigate: (page: PageType) => void;
}

export const Services: React.FC<ServicesProps> = ({ onNavigate }) => {
  const [filterCloud, setFilterCloud] = useState<'All' | 'AWS' | 'Azure' | 'Multi-Cloud'>('All');
  const [activeServiceId, setActiveServiceId] = useState<string>(SERVICES[0].id);

  const filteredServices = SERVICES.filter(s => {
    if (filterCloud === 'All') return true;
    return s.cloudProviders.includes(filterCloud);
  });

  const activeService = SERVICES.find(s => s.id === activeServiceId) || SERVICES[0];

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'CloudUpload': return <CloudUpload className="w-6 h-6" />;
      case 'Container': return <Container className="w-6 h-6" />;
      case 'DollarSign': return <DollarSign className="w-6 h-6" />;
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6" />;
      case 'Activity': return <Activity className="w-6 h-6" />;
      case 'BrainCircuit': return <BrainCircuit className="w-6 h-6" />;
      default: return <Server className="w-6 h-6" />;
    }
  };

  return (
    <div className="w-full bg-white">
      {/* Header */}
      <section className="pt-14 pb-16 bg-gradient-to-b from-purple-50/70 via-white to-white border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100/70 px-3 py-1 rounded-full border border-purple-200">
            Enterprise Cloud Capabilities
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mt-3">
            Architectural Precision Across the Entire Cloud Lifecycle
          </h1>
          <p className="text-lg text-slate-600 mt-4 leading-relaxed">
            From initial readiness assessments and automated migrations to Kubernetes platform engineering and FinOps cost guarantees.
          </p>

          {/* Cloud Filter Controls */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-8">
            {(['All', 'AWS', 'Azure', 'Multi-Cloud'] as const).map((cloud) => (
              <button
                key={cloud}
                onClick={() => setFilterCloud(cloud)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterCloud === cloud
                    ? 'bg-purple-700 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-purple-50 border border-slate-200'
                }`}
              >
                {cloud === 'All' ? 'All Services' : `${cloud} Solutions`}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Service Deep-Dive Studio */}
      <section className="py-16 bg-slate-50/50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Nav Column */}
            <div className="lg:col-span-4 space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Select Practice Area:
              </h2>
              {filteredServices.map((service) => {
                const isSelected = service.id === activeServiceId;
                return (
                  <button
                    key={service.id}
                    onClick={() => setActiveServiceId(service.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-white border-purple-600 shadow-md ring-2 ring-purple-600/10'
                        : 'bg-white/60 hover:bg-white border-slate-200 hover:border-purple-200'
                    }`}
                  >
                    <div className={`p-2 rounded-lg shrink-0 ${
                      isSelected ? 'bg-purple-700 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {getServiceIcon(service.icon)}
                    </div>
                    <div>
                      <div className={`text-sm font-bold ${isSelected ? 'text-purple-900' : 'text-slate-800'}`}>
                        {service.title}
                      </div>
                      <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-purple-600" />
                        <span>{service.timeline}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Detailed Panel */}
            <div className="lg:col-span-8">
              <div className="p-8 sm:p-10 rounded-2xl bg-white border border-slate-200 shadow-lg space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
                  <div className="flex items-center gap-2">
                    <span className="p-2.5 rounded-xl bg-purple-100 text-purple-800">
                      {getServiceIcon(activeService.icon)}
                    </span>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wide text-purple-700">
                        Practice Overview
                      </span>
                      <h3 className="text-2xl font-black text-slate-900">
                        {activeService.title}
                      </h3>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    {activeService.cloudProviders.map((cp) => (
                      <span key={cp} className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700">
                        {cp}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-base text-slate-600 leading-relaxed">
                  {activeService.fullDesc}
                </p>

                {/* Key Deliverables */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Concrete Production Deliverables
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeService.deliverables.map((del, dIdx) => (
                      <div key={dIdx} className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100 flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                        <span>{del}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Architecture Tech Stack */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Key Frameworks &amp; Tooling
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeService.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-500">
                    Expected duration: <strong className="text-slate-900">{activeService.timeline}</strong>
                  </div>
                  <button
                    onClick={() => onNavigate('contact')}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Inquire About This Service</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Engagement Lifecycle Roadmap */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              The LIS Methodology
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Our 4-Phase Delivery Framework
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Engineered to eliminate friction, prevent scope creep, and ensure seamless cutover.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: 'Phase 01',
                title: 'Discovery & Audit',
                desc: 'Telemetry analysis, Well-Architected assessment, security gap audit, and FinOps waste identification.'
              },
              {
                step: 'Phase 02',
                title: 'Target Architecture',
                desc: 'Production-ready Infrastructure as Code design, multi-account Landing Zone topology, and migration blueprint.'
              },
              {
                step: 'Phase 03',
                title: 'Automated Migration',
                desc: 'Zero-downtime cutover pipelines, database dual-write sync, containerization, and automated Canary deployments.'
              },
              {
                step: 'Phase 04',
                title: 'Continuous Optimization',
                desc: 'Post-migration hypercare, SLO telemetry dashboards, Spot Fleet auto-scaling, and FinOps unit-economics governance.'
              }
            ].map((p, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs relative space-y-3 hover:border-purple-300 transition-all">
                <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                  {p.step}
                </span>
                <h3 className="text-lg font-bold text-slate-900">{p.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-14 bg-purple-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Need a Custom Architecture or Migration Roadmap?
          </h2>
          <p className="text-purple-200 text-sm max-w-xl mx-auto">
            Our Principal Architects will conduct an initial 30-minute discovery call and provide a clear technical proposal.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('contact')}
              className="px-6 py-3 rounded-xl bg-white text-purple-900 font-bold text-sm hover:bg-purple-50 transition-all cursor-pointer shadow-lg"
            >
              Speak with a Principal Architect
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
