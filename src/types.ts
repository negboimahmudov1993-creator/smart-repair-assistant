export type RepairCategory = 'plumbing' | 'electrical' | 'appliances' | 'general';

export interface CategoryInfo {
  id: RepairCategory;
  name: string;
  nameEn: string;
  icon: string;
  description: string;
  subcategories: string[];
  examples: string[];
}

export interface PartItem {
  name: string;
  priceMin: number;
  priceMax: number;
  optional?: boolean;
  searchQuery: string;
  category: string;
}

export interface StoreLocation {
  id: string;
  name: string;
  type: 'hypermarket' | 'specialized' | 'tools' | 'neighborhood';
  address: string;
  distanceKm: number;
  lat: number;
  lng: number;
  phone: string;
  workingHours: string;
  rating: number;
  features: string[];
}

export interface RepairDiagnosis {
  id: string;
  createdAt: string;
  category: RepairCategory;
  problemTitle: string;
  probableCause: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  urgencyLabel: string;
  urgencyWarning?: string;
  difficulty: 'easy_diy' | 'moderate_diy' | 'pro_recommended' | 'pro_mandatory';
  difficultyLabel: string;
  estimatedTime: string;
  
  // Cost breakdown
  partsCostMin: number;
  partsCostMax: number;
  laborCostMin: number;
  laborCostMax: number;
  totalCostMin: number;
  totalCostMax: number;
  
  // Regional Currency info
  currency?: string;
  currencyCode?: string;
  
  // Detailed parts & tools
  requiredParts: PartItem[];
  requiredTools: string[];
  
  // DIY Guide & safety
  safetyNotice: string;
  stepByStepGuide: string[];
  proTips: string[];
  
  // Search tags for marketplaces & master platforms
  partsSearchQuery: string;
  masterSearchQuery: string;
  
  // Input image if any
  imageUrl?: string;
  userDescription?: string;
  city?: string;
  isFallback?: boolean;
  unrecognized?: boolean;
  errorMessage?: string;
}

export interface ExternalLinkService {
  name: string;
  type: 'parts' | 'masters';
  logoText: string;
  badge?: string;
  color: string;
  description: string;
  getUrl: (query: string, city?: string) => string;
}
