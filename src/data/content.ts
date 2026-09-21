import { ServiceItem, CaseStudy, Testimonial, PricingPlan, JobOpening } from '../types';

export const COMPANY_INFO = {
  name: 'LIS Cloud Consulting',
  shortName: 'LIS',
  tagline: 'Enterprise AWS & Azure Cloud Architecture and Modernization',
  description: 'LIS empowers Global 2000 enterprises and fast-growth technology companies to architect, migrate, secure, and optimize mission-critical cloud infrastructure on AWS and Microsoft Azure.',
  foundedYear: '2018',
  phone: '+1 (800) 547-2568',
  email: 'solutions@liscloud.com',
  careersEmail: 'careers@liscloud.com',
  whatsappNumber: '+18005472568',
  whatsappDisplay: '+1 (800) 547-2568',
  offices: [
    {
      city: 'San Francisco',
      country: 'United States (HQ)',
      address: '100 Tech Square, 14th Floor, San Francisco, CA 94105',
      phone: '+1 (415) 890-4200'
    },
    {
      city: 'New York',
      country: 'United States',
      address: '350 Fifth Avenue, Suite 4800, New York, NY 10118',
      phone: '+1 (212) 763-9100'
    },
    {
      city: 'London',
      country: 'United Kingdom',
      address: '25 Bank Street, Canary Wharf, London E14 5JP',
      phone: '+44 20 7946 0888'
    },
    {
      city: 'Singapore',
      country: 'Asia-Pacific',
      address: '1 Marina Boulevard, #28-00, Singapore 018989',
      phone: '+65 6712 3400'
    }
  ],
  certifications: [
    { name: 'AWS Premier Tier Partner', category: 'Amazon Web Services', badge: 'Premier Tier' },
    { name: 'Microsoft Solutions Partner', category: 'Azure Cloud', badge: 'Enterprise Gold' },
    { name: 'AWS Well-Architected Certified', category: 'Auditing', badge: 'High Priority' },
    { name: 'Kubernetes Certified Service Provider (KCSP)', category: 'Cloud Native', badge: 'CNCF' },
    { name: 'SOC 2 Type II Certified', category: 'Security & Trust', badge: 'Audited' },
    { name: 'ISO 27001 Certified', category: 'Information Security', badge: 'Global Standard' },
  ],
  keyMetrics: [
    { value: '450+', label: 'Enterprise Cloud Deployments' },
    { value: '$42M+', label: 'Verified Annual Cloud Cost Savings' },
    { value: '99.999%', label: 'Workload Availability Delivered' },
    { value: '100%', label: 'Certified AWS & Azure Architects' },
  ]
};

export const SERVICES: ServiceItem[] = [
  {
    id: 'cloud-migration',
    title: 'Enterprise Cloud Migration & Modernization',
    shortDesc: 'Frictionless migration of legacy on-premises workloads to AWS & Azure with zero data loss and minimal downtime.',
    fullDesc: 'We specialize in multi-phase enterprise migrations utilizing the 7 Rs migration framework (Rehost, Replatform, Refactor, Repurchase, Retain, Retire, Relocate). Our proprietary migration automation frameworks minimize business disruption while converting monolithic systems into decoupled cloud services.',
    icon: 'CloudUpload',
    tags: ['Re-architecting', 'Database Migration', 'Zero-Downtime Cutover', 'Legacy Decoupling'],
    deliverables: [
      'Comprehensive Cloud Readiness Assessment & Discovery Report',
      'Target Architecture Blueprint with High Availability & Disaster Recovery',
      'Automated Data and Workload Migration Pipeline',
      'Post-Cutover Hypercare & Performance Benchmarking'
    ],
    cloudProviders: ['AWS', 'Azure', 'Multi-Cloud'],
    timeline: '6 to 16 weeks typical'
  },
  {
    id: 'devops-kubernetes',
    title: 'DevOps Automation & Kubernetes Orchestration',
    shortDesc: 'Production-grade CI/CD pipelines, GitOps workflows, and enterprise Amazon EKS & Azure AKS management.',
    fullDesc: 'Transform developer velocity while maintaining ironclad release governance. We establish declarative Infrastructure as Code (Terraform, OpenTofu, Pulumi), automated vulnerability scanning in container pipelines, and scalable Kubernetes cluster topologies with zero-drift enforcement.',
    icon: 'Container',
    tags: ['Terraform', 'EKS & AKS', 'GitOps / ArgoCD', 'Helm / Kustomize'],
    deliverables: [
      'Automated Multi-Environment GitOps Deployment Workflow',
      'Hardened Kubernetes Cluster Baseline (EKS / AKS) with Service Mesh',
      'Centralized Secret Management (HashiCorp Vault / KMS)',
      'Automated Blue/Green and Canary Deployment Strategies'
    ],
    cloudProviders: ['AWS', 'Azure', 'Multi-Cloud'],
    timeline: '4 to 10 weeks typical'
  },
  {
    id: 'finops-optimization',
    title: 'FinOps & Cloud Cost Optimization',
    shortDesc: 'Eliminate wasted spend, right-size infrastructure, and establish governance to cut cloud bills by 30%–55%.',
    fullDesc: 'Unchecked cloud spending damages profitability. Our FinOps-certified practitioners conduct deep-packet billing audits, identify idle compute and orphaned storage, architect auto-scaling spot fleet policies, and structure Reserved Instances (RIs) and Savings Plans without compromising performance.',
    icon: 'DollarSign',
    tags: ['Cost Allocation Tags', 'Savings Plans / RIs', 'Spot Instance Automation', 'Waste Remediation'],
    deliverables: [
      'Forensic 30-Day Cloud Spend Audit & Idle Resource Analysis',
      'Real-Time FinOps Dashboard with Unit Economics Tracking',
      'Optimized Purchasing Strategy (Savings Plans & Reserved Instances)',
      'Automated Budget Anomaly Detection & Slack Alerts'
    ],
    cloudProviders: ['AWS', 'Azure', 'Multi-Cloud'],
    timeline: '2 to 6 weeks audit + ongoing governance'
  },
  {
    id: 'cloud-security',
    title: 'Cloud Security, Zero Trust & Compliance',
    shortDesc: 'Fortify your cloud footprint with NIST, CIS Benchmarks, SOC 2, HIPAA, and PCI-DSS compliance frameworks.',
    fullDesc: 'Security cannot be an afterthought. We implement multi-account landing zones with strict IAM role segregation, automated configuration compliance through AWS Config & Azure Policy, SIEM integration, and end-to-end cryptographic data protection at rest and in transit.',
    icon: 'ShieldCheck',
    tags: ['Zero Trust IAM', 'CSPM & CWPP', 'Landing Zone Security', 'SOC2 / HIPAA Compliance'],
    deliverables: [
      'Cloud Security Posture Assessment against CIS & NIST Benchmarks',
      'Automated Identity & Access Management (Least-Privilege Enforcement)',
      'Centralized Audit Logging & Threat Detection (GuardDuty / Sentinel)',
      'Compliance Evidence Package for External Auditors'
    ],
    cloudProviders: ['AWS', 'Azure', 'Multi-Cloud'],
    timeline: '4 to 8 weeks'
  },
  {
    id: 'sre-reliability',
    title: 'Site Reliability Engineering & 24/7 Managed Cloud',
    shortDesc: 'SLO-driven monitoring, chaos engineering, and proactive incident response for mission-critical services.',
    fullDesc: 'Protect revenue by guaranteeing your uptime SLAs. We engineer robust telemetry stacks (Prometheus, Grafana, Datadog, CloudWatch, Azure Monitor), design self-healing architectures with multi-region failover, and provide Tier-3 Escalation Cloud Architecture support.',
    icon: 'Activity',
    tags: ['SLOs & Error Budgets', 'Prometheus & Datadog', 'Disaster Recovery RTO < 5m', 'Incident Post-Mortems'],
    deliverables: [
      'Comprehensive SLI/SLO Framework and Alert Runbooks',
      'Automated Multi-Region Disaster Recovery Simulation',
      'Unified Observability Dashboard across Hybrid & Multi-Cloud',
      'Round-the-Clock Critical Workload Health Monitoring'
    ],
    cloudProviders: ['AWS', 'Azure', 'Multi-Cloud'],
    timeline: 'Continuous Partnership'
  },
  {
    id: 'data-ai-infrastructure',
    title: 'Cloud Data Platforms & Enterprise AI Infrastructure',
    shortDesc: 'Modern data warehouses, real-time streaming, and GPU clusters for LLMs on AWS SageMaker and Azure OpenAI.',
    fullDesc: 'Empower your data science and AI teams with clean, elastic cloud infrastructure. We construct modern Lakehouses using Snowflake, AWS Redshift, Databricks, and Azure Synapse, alongside secure private LLM endpoints configured for compliance and zero corporate data leakage.',
    icon: 'BrainCircuit',
    tags: ['Azure OpenAI', 'AWS Bedrock / SageMaker', 'Databricks Lakehouse', 'Vector Databases'],
    deliverables: [
      'Enterprise Data Lakehouse Architecture Design',
      'Private AI & Vector Search Infrastructure Deployment',
      'Streaming Data Pipelines (Kafka / Kinesis / Event Hubs)',
      'Data Governance & Lineage Policy Setup'
    ],
    cloudProviders: ['AWS', 'Azure', 'Multi-Cloud'],
    timeline: '6 to 12 weeks'
  }
];

export const AWS_SOLUTIONS = [
  {
    name: 'AWS Well-Architected Framework',
    badge: 'Core Competency',
    description: 'Formal architectural reviews across the 6 AWS Pillars: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, and Sustainability.',
    features: [
      'High-Risk Issue (HRI) Identification & Remediation Roadmap',
      'AWS Funding Eligibility: Up to $5,000 AWS credits per workload reviewed',
      'Infrastructure as Code template generation in Terraform / AWS CDK'
    ]
  },
  {
    name: 'Amazon EKS & Serverless Microservices',
    badge: 'Container Excellence',
    description: 'Enterprise Kubernetes on AWS with Karpenter auto-scaling, AWS Lambda event-driven backends, and Amazon Aurora Serverless databases.',
    features: [
      'Sub-minute worker node scaling with Karpenter & Bottlerocket OS',
      'AWS Fargate for zero-management container execution',
      'AWS App Mesh / Istio integration for zero-trust service communication'
    ]
  },
  {
    name: 'AWS Control Tower & Landing Zones',
    badge: 'Multi-Account Governance',
    description: 'Multi-account AWS environments built to best practices with AWS Organizations, Service Control Policies (SCPs), and automated IAM Identity Center (SSO).',
    features: [
      'Segregated Production, Staging, Shared Services, and Audit accounts',
      'Automated baseline guardrails using AWS Config',
      'Centralized transit networking with AWS Transit Gateway & Network Firewall'
    ]
  },
  {
    name: 'AWS Migration Acceleration Program (MAP)',
    badge: 'Funding & Acceleration',
    description: 'Structured migration methodology backed by Amazon financial incentives and credits to offset enterprise migration expenses.',
    features: [
      '3-Phase approach: Assess, Mobilize, and Migrate & Modernize',
      'Deep TCO reduction modeling and financial justification',
      'Dedicated AWS partner solution architect pairing'
    ]
  }
];

export const AZURE_SOLUTIONS = [
  {
    name: 'Azure Cloud Adoption Framework (CAF)',
    badge: 'Microsoft Certified',
    description: 'Systematic strategy, plan, readiness, and governance execution based on Microsoft official cloud adoption standards.',
    features: [
      'Azure Enterprise Landing Zones (ALZ) tailored for scale',
      'Subscription governance, management groups, and naming conventions',
      'Automated policy enforcement via Azure Policy and Blueprints'
    ]
  },
  {
    name: 'Azure Kubernetes Service (AKS) & Container Apps',
    badge: 'App Innovation',
    description: 'Production-ready AKS architectures integrated with Microsoft Entra ID (Azure AD), Azure Key Vault, and Azure Monitor Container Insights.',
    features: [
      'Virtual Nodes backed by Azure Container Instances',
      'Automated GitOps via Flux CD & Azure DevOps pipelines',
      'High-throughput internal load balancing with Azure Application Gateway (WAF v2)'
    ]
  },
  {
    name: 'Azure OpenAI & Microsoft Fabric AI Platforms',
    badge: 'Enterprise AI',
    description: 'Enterprise generative AI solutions leveraging Azure OpenAI (GPT-4o), private endpoints, vector search in Azure AI Search, and unified data in Microsoft Fabric.',
    features: [
      'Private VNet peering ensuring zero public internet traffic',
      'Fine-tuned model hosting with latency guarantees',
      'OneLake data unification reducing ETL pipeline friction'
    ]
  },
  {
    name: 'Azure Hybrid & Azure Arc Infrastructure',
    badge: 'Hybrid & Multi-Cloud',
    description: 'Extend Azure management, security, and cloud services to on-premises data centers, edge devices, and external clouds.',
    features: [
      'Single-pane governance of multi-cloud Linux and Windows servers',
      'Deploy Azure data services (Azure SQL Managed Instance) anywhere',
      'Unified compliance auditing across AWS and Azure from Azure Portal'
    ]
  }
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'fintech-aws-migration',
    title: 'Tier-1 NeoBank Migrates 80M Transactions to AWS EKS with Zero Downtime',
    client: 'FinVantage Global',
    industry: 'Financial Technology / Banking',
    cloud: 'AWS',
    summary: 'A fast-growing fintech needed to escape rigid colocation data centers to handle 10x transaction peaks during market openings, while maintaining PCI-DSS Level 1 compliance.',
    challenge: 'Legacy VMware setup lacked elastic scalability, leading to frequent throttling during peak volatility. Migration had to take place without a single second of transaction processing interruption.',
    solution: 'LIS architected a multi-region AWS Landing Zone with Amazon EKS, Aurora PostgreSQL Multi-Master, and Kafka on Amazon MSK. We executed automated dual-write database sync and cutover traffic seamlessly via Amazon Route 53 latency routing.',
    results: [
      { metric: '58%', label: 'Infrastructure Cost Cut' },
      { metric: '0 sec', label: 'Downtime During Cutover' },
      { metric: '10x', label: 'Peak Transaction Concurrency' },
      { metric: 'PCI-DSS', label: 'Full Level 1 Audit Passed' }
    ],
    technologies: ['AWS EKS', 'Amazon Aurora', 'Terraform', 'Kafka / MSK', 'AWS KMS'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'healthtech-azure-modernization',
    title: 'HIPAA-Compliant Azure Modernization & AI Diagnostic Pipeline',
    client: 'OmniHealth Solutions',
    industry: 'Healthcare & Life Sciences',
    cloud: 'Azure',
    summary: 'Large clinical imaging network modernized its medical imaging repository onto Microsoft Azure with automated Azure OpenAI diagnostic summarization.',
    challenge: 'Exabyte-scale PACS medical imaging was siloed across 60 hospital networks, causing hours of delay for radiologist review and prohibitive on-premises storage maintenance costs.',
    solution: 'LIS implemented Azure Health Data Services, Azure Blob Storage with automated tiering, and private Azure OpenAI model integration running within isolated Azure Virtual Networks with private endpoints.',
    results: [
      { metric: '82%', label: 'Faster Diagnostic Retrieval' },
      { metric: '$1.4M', label: 'Annual Storage Savings' },
      { metric: '100%', label: 'HIPAA & HITRUST Compliance' },
      { metric: '99.99%', label: 'System Uptime SLA' }
    ],
    technologies: ['Azure AKS', 'Azure OpenAI', 'Azure Blob Tiering', 'Microsoft Entra ID', 'Azure Bicep'],
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'ecommerce-finops-optimization',
    title: 'Global E-Commerce Brand Cuts $2.8M in Annual AWS Cloud Waste',
    client: 'AeroRetail Brands',
    industry: 'Omnichannel Retail',
    cloud: 'AWS',
    summary: 'Following rapid acquisitions, this retail conglomerate was overwhelmed by unmonitored AWS accounts with runaway EC2, orphaned EBS volumes, and oversized RDS databases.',
    challenge: 'Cloud monthly spend surpassed $650,000/month with zero tagging visibility and fragmented engineering teams creating resources indiscriminately.',
    solution: 'LIS deployed an automated FinOps practice using AWS Cost Anomaly Detection, Spot Fleet auto-scaling for non-prod environments, DynamoDB on-demand conversion, and structured 3-year Compute Savings Plans.',
    results: [
      { metric: '$2.8M', label: 'Direct Annual Savings' },
      { metric: '48%', label: 'Immediate Compute Cost Reduction' },
      { metric: '100%', label: 'Cost Allocation Tagging' },
      { metric: '3 Weeks', label: 'Time to First $50k Savings' }
    ],
    technologies: ['AWS Cost Explorer', 'Compute Savings Plans', 'Karpenter Spot', 'Terraform Sentinel'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'multicloud-logistics-disaster-recovery',
    title: 'Multi-Cloud High Availability & Disaster Recovery for Global Freight',
    client: 'Apex Global Logistics',
    industry: 'Supply Chain & Transportation',
    cloud: 'Multi-Cloud',
    summary: 'Active-active multi-cloud architecture spanning AWS and Microsoft Azure to guarantee round-the-clock container vessel tracking and routing.',
    challenge: 'A single cloud region outage previously halted dispatch centers for 4 hours, risking millions in carrier penalty clauses.',
    solution: 'Designed a cross-cloud GitOps architecture deploying identical microservice topologies to both AWS EKS and Azure AKS, synchronized via global Anycast DNS and distributed CockroachDB clusters.',
    results: [
      { metric: '99.999%', label: 'Global Availability Achieved' },
      { metric: '< 2 sec', label: 'Automated Failover RTO' },
      { metric: '0 data loss', label: 'Zero RPO Consistency' },
      { metric: '4 Regions', label: 'Active-Active Multi-Cloud' }
    ],
    technologies: ['AWS EKS', 'Azure AKS', 'Terraform', 'CockroachDB', 'Cloudflare Magic WAN'],
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1000&auto=format&fit=crop'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    quote: 'LIS transformed our messy infrastructure into a fortress. Migrating 400+ microservices to AWS EKS with zero customer impact seemed impossible until their team showed up. They are by far the sharpest cloud architects we have ever worked with.',
    author: 'Marcus Vance',
    role: 'Chief Technology Officer',
    company: 'FinVantage Global',
    cloud: 'AWS',
    stat: '58% Cost Cut',
    statLabel: 'Cloud TCO Reduction',
    rating: 5
  },
  {
    id: 't2',
    quote: 'Their Azure and FinOps expertise saved our healthcare network over $1.4M in the first year alone. Beyond the savings, the security posture and automated HIPAA compliance reports made our board audits effortless.',
    author: 'Dr. Elena Rostova',
    role: 'VP of Engineering & Security',
    company: 'OmniHealth Solutions',
    cloud: 'Azure',
    stat: '$1.4M Saved',
    statLabel: 'Annual Cloud Savings',
    rating: 5
  },
  {
    id: 't3',
    quote: 'The team at LIS is extraordinary. When we needed to spin up our enterprise generative AI platform on Azure OpenAI with private networking, they delivered a production-ready environment in just three weeks.',
    author: 'David Chen',
    role: 'Head of Infrastructure & AI',
    company: 'AeroRetail Digital',
    cloud: 'Azure',
    stat: '3 Weeks',
    statLabel: 'Launch to Production',
    rating: 5
  },
  {
    id: 't4',
    quote: 'As a regulated fintech, our compliance and uptime requirements are extreme. LIS established an automated GitOps pipeline and AWS Well-Architected foundation that has held up through three major market spikes without a blip.',
    author: 'Sarah Jenkins',
    role: 'Chief Information Security Officer',
    company: 'NovaPay Technologies',
    cloud: 'AWS',
    stat: '99.999%',
    statLabel: 'Verified Uptime',
    rating: 5
  },
  {
    id: 't5',
    quote: 'The FinOps assessment was eye-opening. Within 14 days, LIS identified $45,000/month in orphaned volumes and unutilized instances that our internal team had missed for two years.',
    author: 'Tariq Al-Mansoor',
    role: 'VP of DevOps & Cloud Platforms',
    company: 'Apex Logistics',
    cloud: 'Hybrid',
    stat: '48% Reduction',
    statLabel: 'Immediate Compute Waste Cut',
    rating: 5
  },
  {
    id: 't6',
    quote: 'LIS does not just give advice—they roll up their sleeves, write bulletproof Terraform code, train your engineers, and leave your cloud in pristine shape. True strategic partners.',
    author: 'Samantha Bailey',
    role: 'Director of Cloud Operations',
    company: 'CloudScale Media',
    cloud: 'AWS',
    stat: '4x Velocity',
    statLabel: 'Deployment Speed Increase',
    rating: 5
  }
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'cloud-audit',
    name: 'Cloud Health & Well-Architected Audit',
    badge: 'Quick Value',
    price: '$4,900',
    period: 'one-time engagement',
    description: 'Comprehensive 2-week architectural assessment across AWS or Azure to identify security vulnerabilities, performance bottlenecks, and immediate cost savings.',
    features: [
      'Official AWS / Azure Well-Architected Review',
      'Security & Compliance Gap Analysis (CIS / NIST)',
      'FinOps Cost Leakage Audit with Immediate Action Items',
      'Executive Findings Presentation & Prioritized Roadmap',
      'AWS / Azure Partner Credit Assistance (Up to $5,000)'
    ],
    ctaText: 'Book Cloud Audit',
    idealFor: 'Companies spending $15k–$100k/month wanting immediate clarity.'
  },
  {
    id: 'modernization-sprint',
    name: 'Cloud Modernization Sprint',
    badge: 'Most Popular',
    price: '$18,500',
    period: 'per 4-week dedicated sprint',
    description: 'Hands-on execution sprint with a dedicated Principal Cloud Architect and Senior DevOps Engineer tackling your highest-priority migration or modernization tasks.',
    features: [
      'Dedicated Principal Cloud Architect + Senior DevOps Engineer',
      'Full Infrastructure as Code (Terraform / Pulumi / Bicep)',
      'Production-Grade Kubernetes (EKS / AKS) Deployment',
      'Automated CI/CD Pipeline & GitOps (ArgoCD / GitHub Actions)',
      'Zero-Downtime Database Migration & Data Cutover',
      'Architectural Knowledge Transfer & Team Workshops'
    ],
    highlighted: true,
    ctaText: 'Start Modernization Sprint',
    idealFor: 'Enterprises executing migrations, refactoring, or CI/CD overhauls.'
  },
  {
    id: 'finops-guaranteed',
    name: 'FinOps Cost Optimization',
    badge: 'Performance-Based',
    price: '$9,500',
    period: 'base fee + % of verified savings',
    description: 'Guaranteed cloud cost reduction program. If we don’t identify at least 2.5x our fee in verified annual savings, we refund the difference.',
    features: [
      'Deep forensic billing analysis & cost anomaly alerts',
      'Spot Fleet & Auto-scaling architecture implementation',
      'Savings Plans, RI, and Reservation portfolio modeling',
      'Orphaned resource & storage tier lifecycle remediation',
      'Custom FinOps Grafana / Datadog dashboard for engineering leads',
      'Written 12-month savings guarantee'
    ],
    ctaText: 'Cut Cloud Costs',
    idealFor: 'Companies spending $40k+/month seeking guaranteed ROI.'
  },
  {
    id: 'enterprise-retainer',
    name: 'Enterprise Cloud Architect Pod',
    badge: 'Continuous Partnership',
    price: '$28,000',
    period: 'per month (quarterly agreement)',
    description: 'An embedded elite cloud engineering pod serving as your Fractional Principal Cloud Architecture and 24/7 Platform Engineering department.',
    features: [
      'Full Dedicated Pod: Lead Architect, 2 DevOps Engineers, SRE Lead',
      '24/7 Tier-3 Escalation for Critical Infrastructure Outages',
      'Continuous Security Posture Management & Drift Detection',
      'Monthly FinOps Review & Proactive Capacity Planning',
      'Direct Private Slack / Teams Channel with 15-minute SLA',
      'Unlimited Architectural Reviews for New Product Features'
    ],
    ctaText: 'Engage Architect Pod',
    idealFor: 'Fast-scaling scaleups & enterprises requiring continuous elite leadership.'
  }
];

export const CAREER_OPENINGS: JobOpening[] = [
  {
    id: 'principal-aws-architect',
    title: 'Principal AWS Cloud Architect',
    department: 'Cloud Architecture & Modernization',
    location: 'San Francisco, CA / Remote (US)',
    type: 'Full-time',
    experience: '8+ years',
    summary: 'Lead complex cloud migration and modernization architectures for Global 2000 enterprises. Define technical strategy and mentor engineering teams.',
    responsibilities: [
      'Lead technical discovery and design target architectures for multi-million dollar enterprise migrations.',
      'Conduct AWS Well-Architected Framework reviews and produce high-impact remediation blueprints.',
      'Author robust, modular Infrastructure as Code templates using Terraform and AWS CDK.',
      'Act as a trusted advisor to enterprise CTOs and Heads of Infrastructure.'
    ],
    requirements: [
      'AWS Certified Solutions Architect - Professional (required).',
      'Demonstrated experience architecting enterprise EKS, Aurora, and multi-region hybrid networks.',
      'Strong background in Terraform, Python/Go, and container orchestration.',
      'Exceptional consultative communication and executive presentation skills.'
    ]
  },
  {
    id: 'azure-platform-engineer',
    title: 'Lead Azure Cloud & DevOps Engineer',
    department: 'Platform Engineering',
    location: 'New York, NY / Remote (US)',
    type: 'Full-time',
    experience: '6+ years',
    summary: 'Design and deploy production-grade Azure Kubernetes Service (AKS) environments, GitOps pipelines, and Enterprise Landing Zones.',
    responsibilities: [
      'Implement Azure Enterprise Landing Zones using Azure Bicep and Terraform.',
      'Architect robust AKS cluster topologies with Microsoft Entra ID integration and Istio service mesh.',
      'Build end-to-end CI/CD pipelines in Azure DevOps and GitHub Actions with automated policy gates.',
      'Partner with client engineering squads to accelerate their cloud-native adoption.'
    ],
    requirements: [
      'Microsoft Certified: Azure Solutions Architect Expert or DevOps Engineer Expert.',
      'Deep knowledge of AKS, Azure Policy, Azure Front Door, and Azure Key Vault.',
      'Hands-on proficiency with GitOps tools (ArgoCD, Flux) and Helm.',
      'Solid understanding of networking concepts (VNets, ExpressRoute, NSGs, private endpoints).'
    ]
  },
  {
    id: 'finops-consultant',
    title: 'Senior FinOps & Cloud Cost Optimization Consultant',
    department: 'FinOps Practice',
    location: 'London, UK / Remote (EMEA)',
    type: 'Full-time',
    experience: '4+ years',
    summary: 'Uncover millions in cloud savings for enterprise customers by analyzing telemetry, re-architecting compute, and structuring savings plans.',
    responsibilities: [
      'Perform detailed forensic analysis of AWS and Azure monthly billing files and telemetry.',
      'Identify compute waste, unattached storage, underutilized databases, and over-provisioned clusters.',
      'Model and execute multi-year Savings Plans, Reserved Instances, and spot automation strategies.',
      'Deliver executive FinOps presentations that translate cloud metrics into business P&L impact.'
    ],
    requirements: [
      'FinOps Certified Practitioner (FOCP) or FinOps Certified Professional.',
      'Deep expertise in AWS Cost Explorer, Azure Cost Management, Datadog, or Kubecost.',
      'Strong data analytics skills with SQL, Python, or BI tooling.',
      'Prior consulting experience working with finance and engineering teams.'
    ]
  },
  {
    id: 'cloud-security-lead',
    title: 'Cloud Security & Zero-Trust Architect',
    department: 'Security & Compliance',
    location: 'Remote (US / UK / APAC)',
    type: 'Full-time',
    experience: '7+ years',
    summary: 'Architect zero-trust security postures, automated guardrails, and compliance frameworks (SOC2, HIPAA, PCI-DSS) on AWS and Azure.',
    responsibilities: [
      'Design defense-in-depth security architectures for regulated fintech and healthcare clients.',
      'Implement automated Cloud Security Posture Management (CSPM) and Cloud Workload Protection (CWPP).',
      'Establish least-privilege IAM policies, KMS encryption strategies, and centralized SIEM pipelines.',
      'Guide clients through successful external security audits and penetration tests.'
    ],
    requirements: [
      'AWS Certified Security - Specialty or Microsoft Certified: Cybersecurity Architect Expert.',
      'Deep familiarity with CIS benchmarks, NIST CSF, SOC 2 Type II, and ISO 27001.',
      'Experience with security tools like AWS GuardDuty, Security Hub, Microsoft Sentinel, and Prisma Cloud.',
      'Strong scripting ability to automate compliance checks in CI/CD.'
    ]
  },
  {
    id: 'site-reliability-engineer',
    title: 'Senior SRE / 24/7 Platform Reliability Engineer',
    department: 'Reliability & Managed Operations',
    location: 'Singapore / Remote (APAC)',
    type: 'Full-time',
    experience: '5+ years',
    summary: 'Maintain four-nines and five-nines availability for client mission-critical services through observability, chaos engineering, and incident response.',
    responsibilities: [
      'Define and enforce Service Level Objectives (SLOs), Service Level Indicators (SLIs), and error budgets.',
      'Build unified telemetry dashboards using Prometheus, Grafana, OpenTelemetry, and Datadog.',
      'Design automated disaster recovery failover mechanisms across multiple cloud regions.',
      'Participate in high-severity incident resolution and author blameless post-mortem analyses.'
    ],
    requirements: [
      'Solid experience managing high-traffic web scale production environments.',
      'Strong Linux internals, eBPF, TCP/IP networking, and DNS troubleshooting.',
      'Expertise in Kubernetes operations, auto-scaling, and service meshes.',
      'Proficiency in Python or Go for operational automation.'
    ]
  }
];

export const FAQ_ITEMS = [
  {
    q: 'How does LIS compare to large traditional consulting firms (e.g. Accenture, Deloitte)?',
    a: 'Unlike traditional firms that staff junior resources with generic slide decks, LIS is an elite engineering-first cloud consultancy. Every consultant on your project is a 100% certified Principal or Senior AWS/Azure Architect with minimum 7+ years of hands-on production engineering experience. We write real code, deploy real infrastructure, and deliver outcomes in weeks instead of quarters.'
  },
  {
    q: 'Do you help us access AWS and Microsoft Azure consulting credits and funding?',
    a: 'Yes. As an authorized AWS Premier Tier and Microsoft Solutions Partner, we frequently help clients secure funding through programs like AWS Migration Acceleration Program (MAP), AWS Well-Architected remediation credits ($5,000/workload), and Azure End Customer Investment Programs (ECIF) to significantly offset consulting fees.'
  },
  {
    q: 'Can you work alongside our existing internal engineering and DevOps teams?',
    a: 'Absolutely. Over 80% of our engagements are co-engineering partnerships. We embed directly into your Slack or Teams channels, pair-program with your engineers, establish modern GitOps workflows, and run hands-on knowledge transfer sessions so your internal team is confident running the systems long after we launch.'
  },
  {
    q: 'How quickly can an LIS consulting pod begin on our project?',
    a: 'For Cloud Audits and FinOps assessments, we can typically kick off within 3 to 5 business days. For full Modernization Sprints and dedicated Cloud Architect Pods, onboarding and discovery generally commence within 7 to 10 business days following agreement execution.'
  },
  {
    q: 'What cloud security and confidentiality guarantees do you provide?',
    a: 'All LIS operations are SOC 2 Type II and ISO 27001 audited. We adhere strictly to least-privilege access, operate via client-governed temporary IAM credentials (no long-lived keys), sign mutual enterprise NDAs, and never retain customer data outside your secure cloud perimeter.'
  }
];
