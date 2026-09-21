export type PageType = 
  | 'home' 
  | 'about' 
  | 'services' 
  | 'cloud-solutions' 
  | 'case-studies' 
  | 'pricing' 
  | 'careers' 
  | 'contact';

export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  icon: string;
  tags: string[];
  deliverables: string[];
  cloudProviders: ('AWS' | 'Azure' | 'Multi-Cloud')[];
  timeline: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  industry: string;
  cloud: 'AWS' | 'Azure' | 'Multi-Cloud';
  summary: string;
  challenge: string;
  solution: string;
  results: { metric: string; label: string }[];
  technologies: string[];
  image: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  cloud: 'AWS' | 'Azure' | 'Hybrid';
  stat: string;
  statLabel: string;
  rating: number;
}

export interface PricingPlan {
  id: string;
  name: string;
  badge?: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  ctaText: string;
  idealFor: string;
}

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
}

export interface ContactFormData {
  fullName: string;
  email: string;
  company: string;
  phone: string;
  cloudPlatform: 'AWS' | 'Azure' | 'Both' | 'Undecided';
  monthlySpend: string;
  serviceType: string;
  message: string;
}
