export interface AnalysisRequest {
  description: string;
  expectedUsers: string;
  budget: string;
  timeline: string;
}

export interface RequirementsAnalysis {
  productType: string;
  expectedUsers: string;
  realTimeRequirements: string;
  storageRequirements: string;
  aiRequirements: string;
  securityRequirements: string;
  scalabilityRequirements: string;
}

export interface Citation {
  title: string;
  url: string;
  snippet?: string;
}

export interface ResearchResults {
  similarApplications: string[];
  caseStudies: string[];
  bestPractices: string[];
  citations: Citation[];
}

export interface ArchitectureOption {
  id: string;
  name: string;
  frontend: string;
  backend: string;
  database: string;
  authentication: string;
  hosting: string;
  aiIntegrations: string;
  caching: string;
  monitoring: string;
  pros: string[];
  cons: string[];
  scalabilityMetric: number; // 1-10
  timeToMarketMetric: number; // 1-10
  operationalSimplicityMetric: number; // 1-10
  budgetFriendlinessMetric: number; // 1-10
  hiringEaseMetric: number; // 1-10
  scores?: ArchitectureScores;
}

export interface ArchitectureScores {
  scalability: number;
  cost: number;
  reliability: number;
  speed: number;
  finalScore: number;
}

export interface CostTiers {
  hostingCost: number;
  databaseCost: number;
  aiCost: number;
  totalCost: number;
}

export interface CostEstimate {
  userTier1k: CostTiers;
  userTier10k: CostTiers;
  userTier100k: CostTiers;
  costFormulaCoefficients: {
    hostingFactor: number;
    databaseFactor: number;
    aiFactor: number;
  };
}

export interface Risk {
  name: string;
  type: 'Scalability' | 'Security' | 'Vendor Lock-in' | 'Technical Debt';
  severity: 'High' | 'Medium' | 'Low';
  description: string;
  mitigation: string;
}

export interface Recommendation {
  chosenArchitectureName: string;
  rationale: string;
  tradeoffs: string;
  scalingPath: string;
  dockerComposeBoilerplate: string;
  boilerplateReadme: string;
}

export interface LogEntry {
  timestamp: string;
  message: string;
}

export interface Report {
  id: string;
  request: AnalysisRequest;
  status: 'pending' | 'running' | 'completed' | 'failed';
  logs: LogEntry[];
  requirements?: RequirementsAnalysis;
  research?: ResearchResults;
  architectures?: ArchitectureOption[];
  cost?: CostEstimate;
  risks?: Risk[];
  recommendation?: Recommendation;
  benchmarkSimilarities?: BenchmarkSimilarity[];
  decisionTrace?: DecisionTrace;
  createdAt: string;
}

export interface BenchmarkSimilarity {
  name: string;
  percentage: number;
}

export interface DecisionTrace {
  requirementsExtractedCount: number;
  researchSourcesCount: number;
  architecturesGeneratedCount: number;
  benchmarksComparedCount: number;
  finalRecommendationGenerated: boolean;
}
