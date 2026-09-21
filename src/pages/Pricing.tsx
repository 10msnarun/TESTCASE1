import React, { useState } from 'react';
import { PageType } from '../types';
import { PRICING_PLANS, FAQ_ITEMS } from '../data/content';
import { 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  DollarSign, 
  ChevronDown, 
  ChevronUp,
  PhoneCall
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PricingProps {
  onNavigate: (page: PageType) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onNavigate }) => {
  const [monthlySpend, setMonthlySpend] = useState<number>(60000);
  const [engineerCount, setEngineerCount] = useState<number>(15);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  // Live ROI Calculation
  const estimatedSavingsAnnual = Math.round(monthlySpend * 0.384 * 12);
  const devHoursSavedAnnual = engineerCount * 140; // ~140 hrs/engineer/yr wasted on manual infrastructure tasks
  const netEstimatedBenefit = estimatedSavingsAnnual + (devHoursSavedAnnual * 95);

  const toggleFaq = (idx: number) => {
    setOpenFaqIdx(openFaqIdx === idx ? null : idx);
  };

  return (
    <div className="w-full bg-white">
      {/* Header */}
      <section className="pt-14 pb-16 bg-gradient-to-b from-purple-50/70 via-white to-white border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100/70 px-3 py-1 rounded-full border border-purple-200">
            Transparent Engagement Models
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mt-3">
            Predictable Investment, Guaranteed Return
          </h1>
          <p className="text-lg text-slate-600 mt-4 leading-relaxed">
            Choose between fixed-scope architectural audits, 4-week modernization execution sprints, or an embedded principal engineering pod.
          </p>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section className="py-20 bg-slate-50/50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
            {PRICING_PLANS.map((plan) => (
              <div 
                key={plan.id}
                className={`rounded-3xl p-7 flex flex-col justify-between transition-all relative ${
                  plan.highlighted
                    ? 'bg-purple-900 text-white shadow-2xl shadow-purple-900/30 ring-2 ring-purple-600 scale-105 z-10'
                    : 'bg-white text-slate-900 border border-slate-200 shadow-sm hover:shadow-lg hover:border-purple-300'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className={`px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider shadow-sm ${
                      plan.highlighted 
                        ? 'bg-purple-400 text-purple-950' 
                        : 'bg-purple-100 text-purple-800 border border-purple-200'
                    }`}>
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className={`text-xl font-bold ${plan.highlighted ? 'text-white' : 'text-slate-900'}`}>
                    {plan.name}
                  </h3>

                  <div className="pt-2">
                    <span className="text-3xl sm:text-4xl font-black tracking-tight">
                      {plan.price}
                    </span>
                    <span className={`text-xs block mt-1 ${plan.highlighted ? 'text-purple-200' : 'text-slate-500'}`}>
                      {plan.period}
                    </span>
                  </div>

                  <p className={`text-xs leading-relaxed ${plan.highlighted ? 'text-purple-100' : 'text-slate-600'}`}>
                    {plan.description}
                  </p>

                  <div className={`pt-4 border-t ${plan.highlighted ? 'border-purple-800' : 'border-slate-100'}`}>
                    <div className={`text-[11px] font-bold uppercase tracking-wider mb-3 ${plan.highlighted ? 'text-purple-300' : 'text-slate-500'}`}>
                      Deliverables Included:
                    </div>
                    <ul className="space-y-2 text-xs">
                      {plan.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2">
                          <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${plan.highlighted ? 'text-purple-300' : 'text-purple-700'}`} />
                          <span className={plan.highlighted ? 'text-purple-100' : 'text-slate-700'}>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100/20 space-y-3">
                  <p className={`text-[11px] ${plan.highlighted ? 'text-purple-200' : 'text-slate-500'}`}>
                    <strong>Best for:</strong> {plan.idealFor}
                  </p>
                  <button
                    onClick={() => onNavigate('contact')}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-sm ${
                      plan.highlighted
                        ? 'bg-white hover:bg-purple-50 text-purple-900 shadow-md'
                        : 'bg-purple-700 hover:bg-purple-800 text-white'
                    }`}
                  >
                    {plan.ctaText}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center text-xs text-slate-500 flex items-center justify-center gap-6">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-700" />
              AWS &amp; Microsoft Credit Assistance (Up to $5,000–$50,000)
            </span>
            <span>•</span>
            <span>SOC 2 Type II Audited Deliverables</span>
            <span>•</span>
            <span>No Long-Term Lock-In</span>
          </div>
        </div>
      </section>

      {/* Interactive Cloud ROI Calculator Studio */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              Quantitative Justification
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Interactive Cloud ROI Simulator
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
              Simulate the verified financial impact of an LIS FinOps and modern GitOps infrastructure engagement.
            </p>
          </div>

          <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white shadow-2xl border border-purple-900/60 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Sliders Column */}
            <div className="lg:col-span-6 space-y-6">
              {/* Slider 1: Monthly Spend */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <label className="font-semibold text-slate-300">
                    Current Monthly Cloud Spend:
                  </label>
                  <span className="font-mono font-bold text-lg text-purple-400">
                    ${monthlySpend.toLocaleString()}/mo
                  </span>
                </div>
                <input
                  type="range"
                  min="15000"
                  max="400000"
                  step="5000"
                  value={monthlySpend}
                  onChange={(e) => setMonthlySpend(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  id="calc-spend-slider"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>$15k/mo</span>
                  <span>$200k/mo</span>
                  <span>$400k+/mo</span>
                </div>
              </div>

              {/* Slider 2: Engineers on Staff */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <label className="font-semibold text-slate-300">
                    Engineers / Developers on Team:
                  </label>
                  <span className="font-mono font-bold text-lg text-purple-400">
                    {engineerCount} Engineers
                  </span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="100"
                  step="1"
                  value={engineerCount}
                  onChange={(e) => setEngineerCount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  id="calc-engineers-slider"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>3</span>
                  <span>50</span>
                  <span>100+</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
                <p className="font-semibold text-slate-300">Calculation Baseline:</p>
                <p>• 38.4% average verified direct infrastructure waste remediation.</p>
                <p>• ~140 hours/engineer/year reclaimed from manual release gates &amp; firefighting.</p>
              </div>
            </div>

            {/* Projected Returns Card */}
            <div className="lg:col-span-6 p-6 rounded-2xl bg-purple-950/70 border border-purple-800/60 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300 block">
                Total Projected Annual Value
              </span>

              <div className="text-4xl sm:text-5xl font-black text-white">
                ${netEstimatedBenefit.toLocaleString()}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-purple-800/60">
                <div className="p-3 rounded-xl bg-slate-950/60">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Direct Cloud Savings</span>
                  <span className="text-lg font-bold text-emerald-400">${estimatedSavingsAnnual.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-500 block">Per year</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Engineering Velocity</span>
                  <span className="text-lg font-bold text-purple-300">+{devHoursSavedAnnual.toLocaleString()} hrs</span>
                  <span className="text-[10px] text-slate-500 block">Reclaimed focus</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('contact')}
                className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors cursor-pointer shadow-md"
              >
                Receive Detailed Financial Model
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              Common Questions
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Pricing &amp; Contract FAQs
            </h2>
          </div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div 
                  key={idx}
                  className="rounded-2xl border border-slate-200 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 text-left font-bold text-sm sm:text-base text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50 cursor-pointer"
                  >
                    <span>{item.q}</span>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-purple-700 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/50 border-t border-slate-100"
                      >
                        {item.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
