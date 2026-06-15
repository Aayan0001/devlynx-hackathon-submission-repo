import { AnalysisRequest, RequirementsAnalysis, ArchitectureOption, CostEstimate } from '../types';
import { askGeminiJson } from '../utils/gemini';
import { generateMockCost } from './mockDataGenerator';

const SYSTEM_INSTRUCTION = `You are the Lead FinOps & Cost Analysis Agent of TechStack AI.
Your task is to analyze the recommended architecture and requirements to generate monthly infrastructure cost estimates at three user tiers: 1k users, 10k users, and 100k users.
You must also provide linear cost coefficients for a dynamic slider on the frontend:
- hostingFactor: monthly dollar multiplier per user for hosting resources (e.g. 0.05 means $0.05 per user per month)
- databaseFactor: monthly dollar multiplier per user for database writes/storage (e.g. 0.08)
- aiFactor: monthly dollar multiplier per user for AI API token consumption (e.g. 0.25)

You MUST return your output strictly as a JSON object matching this TypeScript interface:
interface CostEstimate {
  userTier1k: { hostingCost: number; databaseCost: number; aiCost: number; totalCost: number; };
  userTier10k: { hostingCost: number; databaseCost: number; aiCost: number; totalCost: number; };
  userTier100k: { hostingCost: number; databaseCost: number; aiCost: number; totalCost: number; };
  costFormulaCoefficients: {
    hostingFactor: number;
    databaseFactor: number;
    aiFactor: number;
  };
}
Ensure costs are non-zero integers reflecting realistic production costs. Do not add any markdown besides the JSON object.`;

export async function runCostAgent(
  request: AnalysisRequest,
  requirements: RequirementsAnalysis,
  architectures: ArchitectureOption[],
  logCallback: (msg: string) => void
): Promise<CostEstimate> {
  logCallback('Initializing FinOps Cost Analysis Agent...');
  logCallback('Pricing compute resources, storage volumes, and AI tokens...');
  logCallback('Formulating cost projection models across traffic tiers...');

  const recommendedArch = architectures.find(a => a.id === 'arch_rec') || architectures[0];

  const prompt = JSON.stringify({
    request,
    requirements,
    selectedArchitecture: {
      name: recommendedArch.name,
      database: recommendedArch.database,
      hosting: recommendedArch.hosting,
      aiIntegrations: recommendedArch.aiIntegrations
    }
  });

  const result = await askGeminiJson<CostEstimate>(SYSTEM_INSTRUCTION, prompt);

  if (result && result.userTier1k && result.costFormulaCoefficients) {
    logCallback('Successfully projected infrastructure budgets via Gemini AI.');
    logCallback(`Estimated 100k tier cost: $${result.userTier100k.totalCost}/mo`);
    return result;
  }

  // Fallback to mock
  logCallback('Gemini API offline. Running local cost projection engine...');
  const mockResult = generateMockCost(request);
  logCallback(`Estimated 100k tier cost (Mock): $${mockResult.userTier100k.totalCost}/mo`);
  return mockResult;
}
