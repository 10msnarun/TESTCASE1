import React, { useState } from 'react';
import { PageType } from '../types';
import { AWS_SOLUTIONS, AZURE_SOLUTIONS } from '../data/content';
import { 
  Cloud, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Terminal, 
  Zap, 
  Server, 
  Award,
  ExternalLink,
  HelpCircle,
  PhoneCall,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';

interface CloudSolutionsProps {
  onNavigate: (page: PageType) => void;
}

export const CloudSolutions: React.FC<CloudSolutionsProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'aws' | 'azure' | 'multicloud'>('all');
  
  // Interactive Cloud Solution Matcher state
  const [workloadType, setWorkloadType] = useState<'web' | 'enterprise-apps' | 'ai' | 'fintech'>('web');
  const [osPreference, setOsPreference] = useState<'linux' | 'windows' | 'mixed'>('linux');
  const [primaryGoal, setPrimaryGoal] = useState<'cost' | 'speed' | 'compliance'>('cost');

  const getRecommendation = () => {
    if (workloadType === 'ai') {
      return {
        cloud: 'Microsoft Azure (with Azure OpenAI) or AWS (Bedrock)',
        headline: 'Azure OpenAI & Microsoft Fabric or AWS Bedrock Stack',
        reason: 'For generative AI with strict data privacy and enterprise model access, Azure OpenAI Private Endpoints or AWS Bedrock provides enterprise governance.',
        primaryTool: 'Azure OpenAI GPT-4o / AWS Bedrock Claude 3.5'
      };
    }
    if (osPreference === 'windows' || workloadType === 'enterprise-apps') {
      return {
        cloud: 'Microsoft Azure',
        headline: 'Azure Enterprise Landing Zone (CAF) & AKS',
        reason: 'Native Microsoft licensing benefits (Azure Hybrid Benefit saves up to 85%), Microsoft Entra ID integration, and seamless Windows Server SQL migration.',
        primaryTool: 'Azure Landing Zones + Azure SQL Managed Instance'
      };
    }
    if (workloadType === 'fintech' || primaryGoal === 'compliance') {
      return {
        cloud: 'AWS (Multi-Account Landing Zone)',
        headline: 'AWS Control Tower + EKS & Multi-AZ Aurora',
        reason: 'Unmatched financial services compliance track record, deep PCI-DSS automation, and ultra-low latency routing via Route 53.',
        primaryTool: 'AWS Control Tower + Amazon EKS + Aurora'
      };
    }
    return {
      cloud: 'AWS or Azure Tailored Architecture',
      headline: 'Amazon EKS with Karpenter or Azure AKS with KEDA',
      reason: 'Standard containerized microservice architectures achieve excellent price-performance on both clouds using spot fleets and auto-scalers.',
      primaryTool: 'Kubernetes Container Platform with FinOps'
    };
  };

  const rec = getRecommendation();

  return (
    <div className="w-full bg-white">
      {/* Header */}
      <section className="pt-14 pb-16 bg-gradient-to-b from-purple-50/70 via-white to-white border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100/70 px-3 py-1 rounded-full border border-purple-200">
            Dedicated Cloud Architectures
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mt-3">
            AWS &amp; Microsoft Azure Cloud Solutions
          </h1>
          <p className="text-lg text-slate-600 mt-4 leading-relaxed">
            LIS is uniquely certified at the highest partner tiers across both Amazon Web Services and Microsoft Azure. We architect, optimize, and unify your workloads without vendor bias.
          </p>

          {/* Tab Filter */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-8">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-purple-700 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-purple-50 border border-slate-200'
              }`}
            >
              All Cloud Solutions
            </button>
            <button
              onClick={() => setActiveTab('aws')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'aws'
                  ? 'bg-purple-700 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-purple-50 border border-slate-200'
              }`}
            >
              Amazon Web Services (AWS)
            </button>
            <button
              onClick={() => setActiveTab('azure')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'azure'
                  ? 'bg-purple-700 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-purple-50 border border-slate-200'
              }`}
            >
              Microsoft Azure
            </button>
            <button
              onClick={() => setActiveTab('multicloud')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'multicloud'
                  ? 'bg-purple-700 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-purple-50 border border-slate-200'
              }`}
            >
              Multi-Cloud &amp; Hybrid
            </button>
          </div>
        </div>
      </section>

      {/* Main AWS Solutions Section */}
      {(activeTab === 'all' || activeTab === 'aws') && (
        <section className="py-16 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-sm border border-amber-200">
                AWS
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                  Amazon Web Services Practice
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  AWS Enterprise Architectures &amp; Well-Architected Framework
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {AWS_SOLUTIONS.map((sol, idx) => (
                <div 
                  key={idx}
                  className="p-8 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        {sol.badge}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">LIS-AWS-PATTERNS</span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900">{sol.name}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{sol.description}</p>

                    <div className="space-y-2 pt-2">
                      {sol.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-purple-700 font-semibold">
                      Terraform &amp; CDK Ready
                    </span>
                    <button 
                      onClick={() => onNavigate('contact')}
                      className="text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Consult on this Solution</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Azure Solutions Section */}
      {(activeTab === 'all' || activeTab === 'azure') && (
        <section className="py-16 bg-slate-50/60 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-200">
                AZ
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                  Microsoft Azure Practice
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Azure Cloud Adoption Framework (CAF) &amp; Enterprise Landing Zones
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {AZURE_SOLUTIONS.map((sol, idx) => (
                <div 
                  key={idx}
                  className="p-8 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                        {sol.badge}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">LIS-AZURE-PATTERNS</span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900">{sol.name}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{sol.description}</p>

                    <div className="space-y-2 pt-2">
                      {sol.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-purple-700 font-semibold">
                      Azure Bicep &amp; Terraform Ready
                    </span>
                    <button 
                      onClick={() => onNavigate('contact')}
                      className="text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Consult on this Solution</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Multi-Cloud & Disaster Recovery Section */}
      {(activeTab === 'all' || activeTab === 'multicloud') && (
        <section className="py-16 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white space-y-8">
              <div className="max-w-3xl space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-300 bg-purple-950 px-3 py-1 rounded-full border border-purple-700">
                  Active-Active Multi-Cloud Topology
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white">
                  Cross-Cloud Resiliency (AWS + Azure)
                </h2>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Eliminate single-provider lock-in and region-wide outages. LIS designs GitOps pipelines deploying identical containerized services to both Amazon EKS and Azure AKS with Anycast routing and distributed databases.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-purple-300 text-sm">Unified GitOps</h4>
                  <p className="text-xs text-slate-400">
                    A single declarative repository driving automated releases simultaneously across AWS and Azure via ArgoCD.
                  </p>
                </div>
                <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-purple-300 text-sm">Sub-Second Failover</h4>
                  <p className="text-xs text-slate-400">
                    Global DNS health checks automatically rerouting user traffic in &lt; 2 seconds should either cloud provider suffer a disruption.
                  </p>
                </div>
                <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-purple-300 text-sm">Multi-Cloud FinOps</h4>
                  <p className="text-xs text-slate-400">
                    Dynamic workload routing to the lowest cost compute spot instances between AWS and Azure in real-time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Interactive Cloud Architecture Matcher / Selector */}
      <section className="py-20 bg-purple-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-white px-3 py-1 rounded-full border border-purple-200">
              Interactive Assessment Tool
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Cloud Architecture Recommendation Engine
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
              Answer 3 quick architectural criteria to discover the optimal cloud platform and pattern for your organization.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-purple-200 shadow-xl space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Question 1 */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  1. Workload Focus:
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'web', label: 'Cloud-Native Web / Microservices' },
                    { id: 'enterprise-apps', label: 'Enterprise Windows / SQL / ERP' },
                    { id: 'ai', label: 'Generative AI & LLM Pipelines' },
                    { id: 'fintech', label: 'High-Throughput Fintech / Banking' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setWorkloadType(item.id as any)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        workloadType === item.id
                          ? 'bg-purple-700 text-white border-purple-700 shadow-xs'
                          : 'bg-slate-50 text-slate-700 hover:bg-purple-50 border-slate-200'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2 */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  2. OS &amp; Ecosystem Bias:
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'linux', label: 'Primarily Linux / Open Source' },
                    { id: 'windows', label: 'Heavy Microsoft / Active Directory' },
                    { id: 'mixed', label: 'Heterogeneous Mixed Stack' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setOsPreference(item.id as any)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        osPreference === item.id
                          ? 'bg-purple-700 text-white border-purple-700 shadow-xs'
                          : 'bg-slate-50 text-slate-700 hover:bg-purple-50 border-slate-200'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3 */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  3. Primary Business Driver:
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'cost', label: 'FinOps Cost Reduction (30%+)' },
                    { id: 'speed', label: 'Developer Velocity & GitOps' },
                    { id: 'compliance', label: 'Strict Compliance (SOC2 / HIPAA)' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setPrimaryGoal(item.id as any)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        primaryGoal === item.id
                          ? 'bg-purple-700 text-white border-purple-700 shadow-xs'
                          : 'bg-slate-50 text-slate-700 hover:bg-purple-50 border-slate-200'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Generated Recommendation Card */}
            <div className="p-6 rounded-2xl bg-purple-900 text-white space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                  Recommended Architecture Blueprint
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-800 text-white border border-purple-700">
                  {rec.cloud}
                </span>
              </div>

              <h4 className="text-2xl font-black text-white">{rec.headline}</h4>
              <p className="text-sm text-purple-100 leading-relaxed">{rec.reason}</p>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="text-xs text-purple-200 font-mono">
                  Recommended Core Stack: <strong>{rec.primaryTool}</strong>
                </div>
                <button
                  onClick={() => onNavigate('contact')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white text-purple-900 font-bold text-xs hover:bg-purple-50 transition-colors cursor-pointer shadow-md"
                >
                  Schedule Solution Deep-Dive
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
