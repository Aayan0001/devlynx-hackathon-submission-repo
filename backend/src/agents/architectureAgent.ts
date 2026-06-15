import { AnalysisRequest, RequirementsAnalysis, ResearchResults, ArchitectureOption } from '../types';
import { askGeminiJson } from '../utils/gemini';
import { generateMockArchitecture } from './mockDataGenerator';

const SYSTEM_INSTRUCTION = `You are the Lead Solutions Architect of TechStack AI.
Your job is to generate exactly three distinct architecture alternatives for a software project based on the requirements and research findings:
1. Balanced Scale Architecture: The best-practice stack balancing performance, cost, and developer productivity.
2. Startup Optimized Architecture: A stack designed to minimize monthly operations costs, utilizing serverless scale-to-zero configurations or lightweight, low-complexity designs.
3. Enterprise Scale Architecture: A global, highly scalable stack using modern distributed patterns, fault-tolerant configurations, or microservices (e.g. distributed transactions, ScyllaDB, Erlang VM).

You MUST return your output strictly as a JSON array containing exactly three objects matching this TypeScript interface:
interface ArchitectureOption {
  id: string; // e.g. "arch_rec", "arch_cost", "arch_modern"
  name: string; // Title of the stack, prefix with: "Balanced Scale: ...", "Startup Optimized: ...", "Enterprise Scale: ..."
  frontend: string; // Details on client, frameworks, UI styling, socket connection libraries
  backend: string; // Server framework, languages, queuing libraries
  database: string; // Database choices, extensions, indexes, migrations
  authentication: string; // How users log in, JWT, token invalidation
  hosting: string; // Staging & production cloud hosting service (Heroku, AWS, Vercel, Fly.io)
  aiIntegrations: string; // Model hosting, agent framework, RAG vector retrieval setup
  caching: string; // Cache layers, key-value stores
  monitoring: string; // Metrics, logs, error telemetry
  pros: string[]; // List of 2-3 benefits
  cons: string[]; // List of 1-2 drawbacks
  scalabilityMetric: number; // Rating from 1 to 10
  timeToMarketMetric: number; // Rating from 1 to 10
  operationalSimplicityMetric: number; // Rating from 1 to 10
  budgetFriendlinessMetric: number; // Rating from 1 to 10
  hiringEaseMetric: number; // Rating from 1 to 10
}
Do not add any markdown formatting besides the JSON array.`;

export async function runArchitectureAgent(
  request: AnalysisRequest,
  requirements: RequirementsAnalysis,
  research: ResearchResults,
  logCallback: (msg: string) => void
): Promise<ArchitectureOption[]> {
  logCallback('Initializing Architecture Design Agent...');
  logCallback('Evaluating design patterns for standard, serverless, and low-latency clusters...');
  logCallback('Synthesizing comparative stack matrices...');

  const prompt = JSON.stringify({
    request,
    requirements,
    researchSummary: {
      similarApplications: research.similarApplications,
      caseStudies: research.caseStudies,
      bestPractices: research.bestPractices
    }
  });

  const result = await askGeminiJson<ArchitectureOption[]>(SYSTEM_INSTRUCTION, prompt);

  const sanitizeNames = (list: ArchitectureOption[]) => {
    list.forEach(a => {
      // Force correct naming conventions
      if (a.id === 'arch_cost') {
        a.name = a.name.replace(/^(Cost-Optimized|Recommended|Bleeding-Edge):\s*/i, '');
        a.name = `Startup Optimized: ${a.name}`;
      } else if (a.id === 'arch_rec') {
        a.name = a.name.replace(/^(Cost-Optimized|Recommended|Bleeding-Edge):\s*/i, '');
        a.name = `Balanced Scale: ${a.name}`;
      } else if (a.id === 'arch_modern') {
        a.name = a.name.replace(/^(Cost-Optimized|Recommended|Bleeding-Edge):\s*/i, '');
        a.name = `Enterprise Scale: ${a.name}`;
      }
    });
  };

  if (result && Array.isArray(result) && result.length === 3) {
    logCallback('Successfully designed three architectural plans via Gemini AI.');
    sanitizeNames(result);
    result.forEach((arch) => {
      logCallback(`- Created stack option: "${arch.name}"`);
    });
    return result;
  }

  // Fallback to mock
  logCallback('Gemini API offline or returned invalid response. Compiling architecture options locally...');
  const mockResult = generateMockArchitecture(request);
  sanitizeNames(mockResult);
  mockResult.forEach((arch) => {
    logCallback(`- Created stack option (Mock): "${arch.name}"`);
  });
  return mockResult;
}
