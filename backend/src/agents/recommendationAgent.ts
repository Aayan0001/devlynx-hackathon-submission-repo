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

import { scoreArchitecture } from '../utils/scoring';

const SYSTEM_INSTRUCTION = `You are the Lead Principal Architect and Decision Orchestrator of TechStack AI.
Your job is to synthesize all analysis stages (Requirements, Architectures, Costs, and Risks) and write the final rationale, tradeoffs, and scaling roadmap for the pre-selected winning architecture.

You MUST recommend the pre-selected winning architecture provided in the prompt. Do not choose any other stack.
Provide the complete content for a docker-compose.yml file and a readme file for their boilerplate starter.

You MUST return your output strictly as a JSON object matching this TypeScript interface:
interface Recommendation {
  chosenArchitectureName: string; // Exact name of the recommended winning option
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
  logCallback('Synthesizing technical criteria and ranking architectures programmatically...');
  
  // 1. Calculate scores and select the winner using code
  const userScale = parseInt(request.expectedUsers.replace(/,/g, '')) || 50000;
  
  architectures.forEach(arch => {
    arch.scores = scoreArchitecture(arch, userScale);
  });

  // Pick winner with highest final score
  const winningArch = architectures.reduce((prev, curr) => 
    ((prev.scores?.finalScore || 0) > (curr.scores?.finalScore || 0)) ? prev : curr
  );

  logCallback(`Programmatic Scoring Complete. Winner selected by code: "${winningArch.name}" (Score: ${winningArch.scores?.finalScore}/100)`);
  logCallback('Compiling configuration boilerplate exporter configurations...');

  const prompt = JSON.stringify({
    request,
    requirements,
    architecturesSummary: architectures.map(a => ({ id: a.id, name: a.name, database: a.database, hosting: a.hosting, score: a.scores?.finalScore })),
    winningArchitectureId: winningArch.id,
    winningArchitectureName: winningArch.name,
    totalCosts: {
      tier1k: cost.userTier1k.totalCost,
      tier100k: cost.userTier100k.totalCost
    },
    topRisks: risks.map(r => r.name)
  });

  const result = await askGeminiJson<Recommendation>(SYSTEM_INSTRUCTION, prompt);

  if (result && result.dockerComposeBoilerplate) {
    logCallback('Successfully synthesized final stack selection justifications via Gemini AI.');
    logCallback(`Winning Stack: "${result.chosenArchitectureName}"`);
    return result;
  }

  // Fallback to mock
  logCallback('Gemini API offline. Running local synthesis engine...');
  // Force the mock selection to align with the programmatic winner
  const mockResult = generateMockRecommendation(request, architectures);
  mockResult.chosenArchitectureName = winningArch.name;
  logCallback(`Winning Stack (Mock): "${mockResult.chosenArchitectureName}"`);
  return mockResult;
}
