import React, { useState } from 'react';
import { PageType, CaseStudy } from '../types';
import { CASE_STUDIES } from '../data/content';
import { 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink, 
  Layers, 
  Server, 
  ShieldCheck, 
  TrendingDown, 
  X,
  PhoneCall,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CaseStudiesProps {
  onNavigate: (page: PageType) => void;
}

export const CaseStudies: React.FC<CaseStudiesProps> = ({ onNavigate }) => {
  const [selectedCloud, setSelectedCloud] = useState<'All' | 'AWS' | 'Azure' | 'Multi-Cloud'>('All');
  const [activeModalStudy, setActiveModalStudy] = useState<CaseStudy | null>(null);

  const filteredStudies = CASE_STUDIES.filter(study => {
    if (selectedCloud === 'All') return true;
    return study.cloud === selectedCloud;
  });

  return (
    <div className="w-full bg-white">
      {/* Header */}
      <section className="pt-14 pb-16 bg-gradient-to-b from-purple-50/70 via-white to-white border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100/70 px-3 py-1 rounded-full border border-purple-200">
            Proven Business Outcomes
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mt-3">
            Real Enterprise Cloud Transformations
          </h1>
          <p className="text-lg text-slate-600 mt-4 leading-relaxed">
            Explore how Global 2000 enterprises and hyper-growth scaleups partner with LIS to modernize architecture, enforce compliance, and cut millions in cloud spend.
          </p>

          {/* Cloud Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-8">
            {(['All', 'AWS', 'Azure', 'Multi-Cloud'] as const).map((cloud) => (
              <button
                key={cloud}
                onClick={() => setSelectedCloud(cloud)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCloud === cloud
                    ? 'bg-purple-700 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-purple-50 border border-slate-200'
                }`}
              >
                {cloud === 'All' ? 'All Case Studies' : `${cloud} Projects`}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-20 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredStudies.map((study) => (
              <div 
                key={study.id}
                className="rounded-3xl bg-white border border-slate-200 hover:border-purple-300 shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Card Image Banner with Badge */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                    <img 
                      src={study.image} 
                      alt={study.title} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                        study.cloud === 'AWS' 
                          ? 'bg-amber-500 text-slate-950' 
                          : study.cloud === 'Azure'
                          ? 'bg-blue-600 text-white'
                          : 'bg-purple-600 text-white'
                      }`}>
                        {study.cloud}
                      </span>
                      <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-900/80 text-white backdrop-blur-xs">
                        {study.industry}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-4 right-4 text-xs font-semibold text-purple-200 truncate">
                      Client: {study.client}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-7 space-y-4">
                    <h3 className="text-xl font-bold text-slate-900 leading-snug">
                      {study.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {study.summary}
                    </p>

                    {/* Quantifiable Results Grid */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      {study.results.map((res, rIdx) => (
                        <div key={rIdx} className="p-3 rounded-xl bg-purple-50/60 border border-purple-100">
                          <span className="text-xl font-black text-purple-800 block">
                            {res.metric}
                          </span>
                          <span className="text-[11px] text-slate-600 font-medium">
                            {res.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Technologies list */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {study.technologies.map((tech, tIdx) => (
                        <span key={tIdx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-7 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Verified Case Study</span>
                  <button
                    onClick={() => setActiveModalStudy(study)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-800 cursor-pointer"
                  >
                    <span>View Architecture Teardown</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study Details Modal */}
      <AnimatePresence>
        {activeModalStudy && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-purple-200"
            >
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex justify-between items-start gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-purple-100 text-purple-800">
                        {activeModalStudy.cloud} Architecture
                      </span>
                      <span className="text-xs text-slate-500">{activeModalStudy.industry}</span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">
                      {activeModalStudy.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveModalStudy(null)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Challenge & Solution */}
                <div className="space-y-4 text-sm">
                  <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100">
                    <h4 className="font-bold text-rose-900 text-xs uppercase tracking-wider mb-1">
                      The Enterprise Challenge
                    </h4>
                    <p className="text-slate-700 leading-relaxed">
                      {activeModalStudy.challenge}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100">
                    <h4 className="font-bold text-purple-900 text-xs uppercase tracking-wider mb-1">
                      The LIS Architecture &amp; Execution
                    </h4>
                    <p className="text-slate-700 leading-relaxed">
                      {activeModalStudy.solution}
                    </p>
                  </div>
                </div>

                {/* Verified Metrics */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Quantified Business Outcomes
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {activeModalStudy.results.map((r, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-900 text-white text-center">
                        <span className="text-2xl font-black text-purple-400 block">{r.metric}</span>
                        <span className="text-[11px] text-slate-300 font-medium">{r.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="border-t border-slate-100 pt-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-1.5">
                    {activeModalStudy.technologies.map((t, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-md text-xs font-mono bg-slate-100 text-slate-800">
                        {t}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setActiveModalStudy(null);
                      onNavigate('contact');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs transition-all cursor-pointer shadow-sm"
                  >
                    Schedule a Similar Migration
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom CTA */}
      <section className="py-16 bg-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Ready to Build Your Own Success Story?
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Book a confidential architecture review with an LIS Principal Consultant. We’ll analyze your environment and map out your ROI.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('contact')}
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm transition-all cursor-pointer shadow-lg"
            >
              Start Your Free Consultation
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
