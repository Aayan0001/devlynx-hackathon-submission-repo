import { 
  AnalysisRequest, 
  RequirementsAnalysis, 
  ArchitectureOption, 
  CostEstimate, 
  Risk, 
  Recommendation 
} from '../types';
import { askGeminiJson } from '../utils/gemini';
import { generateMockRecommendation } from './mockDataGenerator';

const SYSTEM_INSTRUCTION = `You are the Lead Principal Architect and Decision Orchestrator of TechStack AI.
Your job is to synthesize all analysis stages (Requirements, Architectures, Costs, and Risks) and make a definitive technology stack recommendation.
You must choose the winning architecture, justify why, identify trade-offs, define a multi-phase scaling roadmap, and provide the complete content for a docker-compose.yml file and a readme file for their boilerplate starter.

You MUST return your output strictly as a JSON object matching this TypeScript interface:
interface Recommendation {
  chosenArchitectureName: string; // Exact name of the recommended option
  rationale: string; // Professional justification (2-3 sentences)
  tradeoffs: string; // Important considerations/drawbacks of this stack
  scalingPath: string; // A 3-4 step technical scaling roadmap (e.g., Phase 1 -> Phase 2 -> Phase 3)
  dockerComposeBoilerplate: string; // A valid YAML docker-compose.yml string configuring the chosen services (app, db, caching)
  boilerplateReadme: string; // Markdown documentation explaining local development instructions
}
Do not add any markdown formatting besides the JSON object. Do not escape YAML lines.`;

export async function runRecommendationAgent(
  request: AnalysisRequest,
  requirements: RequirementsAnalysis,
  architectures: ArchitectureOption[],
  cost: CostEstimate,
  risks: Risk[],
  logCallback: (msg: string) => void
): Promise<Recommendation> {
  logCallback('Initializing Recommendation Agent...');
  logCallback('Synthesizing technical criteria and ranking architectures...');
  logCallback('Compiling configuration boilerplate exporter configurations...');

  const recommendedArch = architectures.find(a => a.id === 'arch_rec') || architectures[0];

  const prompt = JSON.stringify({
    request,
    requirements,
    architecturesSummary: architectures.map(a => ({ name: a.name, database: a.database, hosting: a.hosting })),
    totalCosts: {
      tier1k: cost.userTier1k.totalCost,
      tier100k: cost.userTier100k.totalCost
    },
    topRisks: risks.map(r => r.name)
  });

  const result = await askGeminiJson<Recommendation>(SYSTEM_INSTRUCTION, prompt);

  if (result && result.dockerComposeBoilerplate) {
    logCallback('Successfully synthesized final stack selection via Gemini AI.');
    logCallback(`Winning Stack: "${result.chosenArchitectureName}"`);
    return result;
  }

  // Fallback to mock
  logCallback('Gemini API offline. Running local synthesis engine...');
  const mockResult = generateMockRecommendation(request, architectures);
  logCallback(`Winning Stack (Mock): "${mockResult.chosenArchitectureName}"`);
  return mockResult;
}
