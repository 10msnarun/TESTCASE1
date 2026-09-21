import React, { useState } from 'react';
import { PageType } from '../types';
import { COMPANY_INFO, SERVICES, CASE_STUDIES, TESTIMONIALS } from '../data/content';
import { 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Award, 
  Layers, 
  TrendingDown, 
  Server, 
  Cpu, 
  Terminal, 
  Star,
  Quote,
  Sparkles,
  PhoneCall,
  ExternalLink,
  ChevronRight,
  Database,
  CloudLightning
} from 'lucide-react';
import { motion } from 'motion/react';

interface HomeProps {
  onNavigate: (page: PageType) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [quickMonthlySpend, setQuickMonthlySpend] = useState<number>(45000);
  const estimatedSavings = Math.round(quickMonthlySpend * 0.38 * 12);
  const [selectedTab, setSelectedTab] = useState<'aws' | 'azure'>('aws');

  return (
    <div className="w-full bg-white">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-purple-100 bg-gradient-to-b from-purple-50/70 via-white to-white">
        {/* Subtle background decorative shapes */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute -top-24 right-10 w-96 h-96 rounded-full bg-purple-200/40 blur-3xl"></div>
          <div className="absolute top-48 -left-20 w-80 h-80 rounded-full bg-indigo-100/50 blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Copy & CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 space-y-6 text-left"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/80 border border-purple-200 text-purple-900 text-xs font-bold tracking-wide uppercase">
                <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></span>
                <span>Elite AWS &amp; Azure Cloud Architects</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Enterprise Cloud Consulting with <span className="text-purple-700">Guaranteed</span> Outcomes.
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl font-normal">
                LIS helps technology leaders architect resilient cloud infrastructures, migrate legacy monoliths with zero downtime, and slash runaway AWS &amp; Azure bills by 30%–55%.
              </p>

              {/* Badges list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-sm font-semibold text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0" />
                  <span>100% Certified Senior &amp; Staff Architects</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0" />
                  <span>AWS &amp; Microsoft Partner Funding Eligible</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0" />
                  <span>SOC 2 Type II &amp; ISO 27001 Audited</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0" />
                  <span>Zero-Downtime Migration Guarantees</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                <button
                  onClick={() => onNavigate('contact')}
                  id="hero-schedule-audit-cta"
                  className="px-7 py-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-base shadow-lg shadow-purple-600/30 hover:shadow-xl hover:shadow-purple-700/40 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PhoneCall className="w-5 h-5" />
                  <span>Schedule Free Cloud Audit</span>
                </button>

                <button
                  onClick={() => onNavigate('cloud-solutions')}
                  id="hero-explore-solutions-cta"
                  className="px-7 py-4 rounded-xl bg-white hover:bg-purple-50 text-slate-800 hover:text-purple-800 border-2 border-slate-200 hover:border-purple-300 font-bold text-base transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>AWS &amp; Azure Solutions</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Proof quote */}
              <div className="pt-2 flex items-center gap-3 text-xs text-slate-500">
                <div className="flex -space-x-1.5">
                  <span className="inline-block w-7 h-7 rounded-full bg-purple-200 text-purple-800 font-bold text-[10px] flex items-center justify-center ring-2 ring-white">MV</span>
                  <span className="inline-block w-7 h-7 rounded-full bg-indigo-200 text-indigo-800 font-bold text-[10px] flex items-center justify-center ring-2 ring-white">ER</span>
                  <span className="inline-block w-7 h-7 rounded-full bg-purple-300 text-purple-900 font-bold text-[10px] flex items-center justify-center ring-2 ring-white">DC</span>
                </div>
                <span>
                  Trusted by CTOs at FinVantage, OmniHealth, AeroRetail, and 450+ scaleups.
                </span>
              </div>
            </motion.div>

            {/* Right Column: Interactive Architecture Terminal & Stats Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="lg:col-span-5"
            >
              <div className="rounded-2xl bg-slate-900 text-slate-200 shadow-2xl border border-purple-900/60 overflow-hidden">
                {/* Window Bar */}
                <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    <span className="ml-2 text-xs font-mono text-slate-400">lis-cloud-architecture.tf</span>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-900/50 text-purple-300 border border-purple-700/50">
                    Live Engine
                  </span>
                </div>

                {/* Code / Architecture Display */}
                <div className="p-5 font-mono text-xs space-y-3 bg-slate-900/90 leading-relaxed">
                  <div className="text-slate-400">
                    <span className="text-purple-400">module</span> <span className="text-emerald-300">"lis_enterprise_cluster"</span> &#123;
                  </div>
                  <div className="pl-4 text-slate-300 space-y-1">
                    <div><span className="text-slate-500">provider</span> = <span className="text-amber-200">"aws_or_azure"</span></div>
                    <div><span className="text-slate-500">orchestration</span> = <span className="text-amber-200">"Kubernetes EKS / AKS"</span></div>
                    <div><span className="text-slate-500">ha_redundancy</span> = <span className="text-purple-300">"multi-region-active-active"</span></div>
                    <div><span className="text-slate-500">finops_optimization</span> = <span className="text-emerald-400">true</span> <span className="text-slate-500">// -42% spend</span></div>
                    <div><span className="text-slate-500">zero_trust_iam</span> = <span className="text-purple-300">"SOC2_Compliant"</span></div>
                  </div>
                  <div className="text-slate-400">&#125;</div>

                  {/* Dynamic Metric HUD */}
                  <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                      <span className="text-[10px] uppercase text-slate-400 font-semibold block">Target SLA</span>
                      <span className="text-lg font-bold text-emerald-400">99.999%</span>
                      <span className="text-[10px] text-slate-500 block">&lt; 2s failover RTO</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                      <span className="text-[10px] uppercase text-slate-400 font-semibold block">Avg Cost Reduction</span>
                      <span className="text-lg font-bold text-purple-400">38.4%</span>
                      <span className="text-[10px] text-slate-500 block">Verified ROI in 30 days</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/40 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-purple-200">
                      <ShieldCheck className="w-4 h-4 text-purple-400" />
                      <span>AWS Well-Architected &amp; Azure CAF Ready</span>
                    </div>
                    <span className="text-emerald-400 font-bold">100% Passed</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 text-center border-t border-slate-800">
                  <button 
                    onClick={() => onNavigate('case-studies')}
                    className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center justify-center gap-1 mx-auto cursor-pointer"
                  >
                    <span>Read Verified Migration Case Studies</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. METRICS TICKER ROW */}
      <section className="bg-purple-900 text-white py-8 border-y border-purple-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {COMPANY_INFO.keyMetrics.map((metric, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {metric.value}
                </div>
                <div className="text-xs sm:text-sm font-medium text-purple-200">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. PARTNERSHIP & ACCREDITATION LOGOS */}
      <section className="py-12 bg-slate-50/60 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Validated Accreditations &amp; Tier-1 Cloud Partnerships
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {COMPANY_INFO.certifications.map((cert, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col items-center justify-center text-center hover:border-purple-300 hover:shadow-sm transition-all"
              >
                <span className="text-[10px] font-bold uppercase tracking-wide text-purple-700 bg-purple-50 px-2 py-0.5 rounded mb-1.5">
                  {cert.badge}
                </span>
                <span className="text-xs font-bold text-slate-800 leading-snug">
                  {cert.name}
                </span>
                <span className="text-[10px] text-slate-500 mt-1">
                  {cert.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CORE SERVICES PREVIEW */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              Complete Cloud Lifecycle
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Enterprise Cloud Services Built for Scale
            </h2>
            <p className="text-base text-slate-600">
              From initial architectural audits and zero-downtime migrations to Kubernetes orchestration and 24/7 reliability engineering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.slice(0, 6).map((service) => (
              <div 
                key={service.id}
                className="p-7 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-900/5 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 group-hover:bg-purple-700 text-purple-700 group-hover:text-white flex items-center justify-center transition-colors duration-200 shadow-xs">
                    <CloudLightning className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {service.shortDesc}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {service.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-purple-700">
                    {service.timeline}
                  </span>
                  <button 
                    onClick={() => onNavigate('services')}
                    className="text-xs font-bold text-slate-700 group-hover:text-purple-700 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Learn More</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => onNavigate('services')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200 font-bold text-sm transition-all cursor-pointer"
            >
              <span>View All 6 Cloud Service Practices</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. AWS & AZURE SOLUTIONS TEASER */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100/60 px-3 py-1 rounded-full border border-purple-200">
                Dual Cloud Specialization
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Architected for AWS &amp; Microsoft Azure
              </h2>
              <p className="text-slate-600 max-w-xl text-sm sm:text-base">
                Select your preferred cloud environment or explore hybrid multi-cloud topologies.
              </p>
            </div>

            {/* Cloud Tabs */}
            <div className="flex p-1 rounded-xl bg-white border border-slate-200 shadow-xs self-start md:self-auto">
              <button
                onClick={() => setSelectedTab('aws')}
                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                  selectedTab === 'aws'
                    ? 'bg-purple-700 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Amazon Web Services (AWS)
              </button>
              <button
                onClick={() => setSelectedTab('azure')}
                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                  selectedTab === 'azure'
                    ? 'bg-purple-700 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Microsoft Azure
              </button>
            </div>
          </div>

          {/* Solutions Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {selectedTab === 'aws' ? (
              <>
                <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-900">
                      AWS Well-Architected
                    </span>
                    <span className="text-xs text-purple-700 font-semibold">$5,000 AWS Credit Eligible</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    AWS Production Modernization
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Audit and refactor your AWS workloads against the official 6 pillars. We identify high-risk security flaws and eliminate over-provisioned EC2 and RDS instances.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-700 pt-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0" />
                      <span>Amazon EKS &amp; Karpenter sub-minute autoscaling</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0" />
                      <span>Multi-account Landing Zones with AWS Control Tower</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0" />
                      <span>AWS MAP (Migration Acceleration Program) funding</span>
                    </li>
                  </ul>
                  <button 
                    onClick={() => onNavigate('cloud-solutions')}
                    className="text-sm font-bold text-purple-700 hover:text-purple-800 flex items-center gap-1.5 pt-2 cursor-pointer"
                  >
                    <span>Explore AWS Architecture Blueprints</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-purple-100 text-purple-800">
                      Serverless &amp; Data
                    </span>
                    <span className="text-xs text-emerald-700 font-semibold">Sub-second Latency</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    AWS Cloud-Native Applications
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Build event-driven architectures leveraging AWS Lambda, Amazon Aurora Serverless, DynamoDB Global Tables, and Amazon Bedrock generative AI models.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-700 pt-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0" />
                      <span>Zero-idle serverless cost structures</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0" />
                      <span>Terraform &amp; AWS CDK infrastructure as code</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0" />
                      <span>Private endpoints via AWS PrivateLink</span>
                    </li>
                  </ul>
                  <button 
                    onClick={() => onNavigate('cloud-solutions')}
                    className="text-sm font-bold text-purple-700 hover:text-purple-800 flex items-center gap-1.5 pt-2 cursor-pointer"
                  >
                    <span>View Serverless Blueprint</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-900">
                      Cloud Adoption Framework
                    </span>
                    <span className="text-xs text-purple-700 font-semibold">Microsoft Gold Certified</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Azure Enterprise Landing Zones (ALZ)
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Standardized, scalable Azure subscriptions architected to Microsoft CAF specifications. Integrated with Microsoft Entra ID (Azure AD) and Azure Policy guardrails.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-700 pt-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0" />
                      <span>Azure Kubernetes Service (AKS) with automated GitOps</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0" />
                      <span>Azure Firewall &amp; Application Gateway WAF v2</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0" />
                      <span>Azure DevOps &amp; GitHub Actions enterprise pipelines</span>
                    </li>
                  </ul>
                  <button 
                    onClick={() => onNavigate('cloud-solutions')}
                    className="text-sm font-bold text-purple-700 hover:text-purple-800 flex items-center gap-1.5 pt-2 cursor-pointer"
                  >
                    <span>Explore Azure Architecture Blueprints</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-900">
                      AI &amp; Hybrid
                    </span>
                    <span className="text-xs text-purple-700 font-semibold">Enterprise GPT-4o Ready</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Azure OpenAI &amp; Azure Arc Hybrid
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Deploy secure, private generative AI endpoints with zero data leakage, and unify on-premises servers with Azure Arc single-pane management.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-700 pt-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0" />
                      <span>Private VNet Peering for Azure OpenAI models</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0" />
                      <span>Azure Arc multi-cloud governance for hybrid servers</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0" />
                      <span>Microsoft Fabric &amp; Azure Synapse unified analytics</span>
                    </li>
                  </ul>
                  <button 
                    onClick={() => onNavigate('cloud-solutions')}
                    className="text-sm font-bold text-purple-700 hover:text-purple-800 flex items-center gap-1.5 pt-2 cursor-pointer"
                  >
                    <span>View Azure AI Blueprint</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 6. FEATURED CASE STUDY */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white shadow-xl border border-purple-900/50">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-800/80 text-purple-200 border border-purple-600/50">
                    Featured Enterprise Case Study
                  </span>
                  <span className="text-xs text-slate-400">Fintech / Banking</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  How FinVantage Migrated 80M Monthly Transactions to AWS with 0 Seconds Downtime
                </h3>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Confronted with legacy VMware bottlenecks during market volatility, FinVantage partnered with LIS to architect a high-throughput Amazon EKS and Aurora PostgreSQL platform with sub-second failover.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
                  <div>
                    <span className="text-2xl font-black text-purple-400">58%</span>
                    <span className="text-xs text-slate-400 block">Cost Reduction</span>
                  </div>
                  <div>
                    <span className="text-2xl font-black text-emerald-400">0 sec</span>
                    <span className="text-xs text-slate-400 block">Downtime</span>
                  </div>
                  <div>
                    <span className="text-2xl font-black text-white">10x</span>
                    <span className="text-xs text-slate-400 block">Peak Concurrency</span>
                  </div>
                  <div>
                    <span className="text-2xl font-black text-purple-300">PCI-DSS</span>
                    <span className="text-xs text-slate-400 block">Level 1 Compliant</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onNavigate('case-studies')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-sm transition-all cursor-pointer"
                  >
                    <span>Read Full Architecture Breakdown</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center gap-3">
                    <Quote className="w-8 h-8 text-purple-500 opacity-60" />
                    <div>
                      <div className="text-sm font-bold text-white">Marcus Vance</div>
                      <div className="text-xs text-purple-300">CTO, FinVantage Global</div>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                    &ldquo;Migrating 400+ microservices without affecting a single customer transaction seemed like fantasy. LIS made it routine. They are by far the sharpest cloud architects in the business.&rdquo;
                  </p>
                  <div className="flex items-center gap-1 text-amber-400 pt-2 border-t border-slate-800/80">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                    <span className="text-xs text-slate-400 ml-2">Verified Client Audit</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. INTERACTIVE CLOUD COST SAVINGS CALCULATOR */}
      <section className="py-20 bg-purple-50/50 border-y border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-white px-3 py-1 rounded-full border border-purple-200">
                FinOps ROI Estimator
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                How Much Is Your Organization Overpaying for Cloud?
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Most AWS and Azure deployments carry 30% to 50% in unoptimized waste: idle provisioned IOPS, forgotten snapshots, oversized worker nodes, and lack of structured Savings Plans.
              </p>
              <div className="space-y-3 pt-2 text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0" />
                  <span>Forensic billing discovery completed in 7 business days</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0" />
                  <span>Guaranteed minimum 2.5x ROI on our consulting fee</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0" />
                  <span>Zero disruption to ongoing developer workflows</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="p-8 rounded-2xl bg-white border border-purple-200 shadow-xl space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-slate-800">
                      Your Current Monthly AWS/Azure Spend:
                    </label>
                    <span className="text-xl font-black text-purple-700">
                      ${quickMonthlySpend.toLocaleString()}/mo
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="300000"
                    step="5000"
                    value={quickMonthlySpend}
                    onChange={(e) => setQuickMonthlySpend(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-700"
                    id="savings-calc-slider"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                    <span>$10k/mo</span>
                    <span>$150k/mo</span>
                    <span>$300k+/mo</span>
                  </div>
                </div>

                <div className="p-6 rounded-xl bg-purple-900 text-white space-y-2 text-center">
                  <span className="text-xs font-semibold text-purple-200 uppercase tracking-wider block">
                    Estimated Annual Savings Delivered by LIS
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-white">
                    ${estimatedSavings.toLocaleString()}
                  </div>
                  <p className="text-xs text-purple-300">
                    Based on our average 38.4% verified enterprise reduction rate.
                  </p>
                </div>

                <button
                  onClick={() => onNavigate('contact')}
                  className="w-full py-3.5 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Claim Your Free FinOps Assessment</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS SLIDER / GRID */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              Verified Executive Feedback
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Trusted by Leading Engineering Executives
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              See what CTOs, CISOs, and Heads of Infrastructure say about their partnerships with LIS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.slice(0, 3).map((t) => (
              <div 
                key={t.id}
                className="p-7 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-100">
                      {t.cloud}
                    </span>
                  </div>

                  <p className="text-sm text-slate-700 italic leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm text-slate-900">{t.author}</div>
                    <div className="text-xs text-slate-500">{t.role}, {t.company}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-purple-700">{t.stat}</div>
                    <div className="text-[10px] text-slate-400">{t.statLabel}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. BOTTOM CTA */}
      <section className="py-20 bg-slate-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950 border border-purple-700 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Ready for Production Perfection</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight max-w-3xl mx-auto">
            Modernize Your Cloud Architecture in Weeks, Not Quarters.
          </h2>

          <p className="text-slate-400 max-w-xl mx-auto text-base">
            Book an introductory 30-minute architecture review with an LIS Principal Solutions Architect today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('contact')}
              className="px-8 py-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-base shadow-xl shadow-purple-900/50 hover:shadow-2xl active:scale-98 transition-all cursor-pointer"
            >
              Schedule Free Architecture Review
            </button>
            <button
              onClick={() => onNavigate('pricing')}
              className="px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-base transition-all cursor-pointer"
            >
              View Engagement Pricing
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
