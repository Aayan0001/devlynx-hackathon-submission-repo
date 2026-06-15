import { AnalysisRequest, RequirementsAnalysis, ArchitectureOption, Risk } from '../types';
import { askGeminiJson } from '../utils/gemini';
import { generateMockRisks } from './mockDataGenerator';

const SYSTEM_INSTRUCTION = `You are the Lead Cybersecurity and Risk Management Agent of TechStack AI.
Your job is to identify critical engineering risks for the recommended architecture stack and product requirements.
You must analyze:
1. Scalability Risks (e.g. database locks, thread blocking, connections exhaust)
2. Security Risks (e.g. data leak, prompt injection, API token theft)
3. Vendor Lock-in Risks (e.g. Firebase proprietary features, proprietary AWS components)
4. Technical Debt Risks (e.g. complex Elixir actor loops, monolithic builds)

You MUST return your output strictly as a JSON array of objects matching this TypeScript interface:
interface Risk {
  name: string; // Brief title of the risk (e.g., "PostgreSQL Write Bottleneck")
  type: "Scalability" | "Security" | "Vendor Lock-in" | "Technical Debt";
  severity: "High" | "Medium" | "Low";
  description: string; // Details on how this risk manifests in the proposed architecture
  mitigation: string; // Specific engineering actions to prevent or resolve the risk
}
Do not add any markdown besides the JSON array.`;

export async function runRiskAgent(
  request: AnalysisRequest,
  requirements: RequirementsAnalysis,
  architectures: ArchitectureOption[],
  logCallback: (msg: string) => void
): Promise<Risk[]> {
  logCallback('Initializing Engineering Risk Assessor Agent...');
  logCallback('Analyzing component integration vulnerabilities...');
  logCallback('Calculating risk exposure matrix and severity rankings...');

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

  const result = await askGeminiJson<Risk[]>(SYSTEM_INSTRUCTION, prompt);

  if (result && Array.isArray(result) && result.length > 0) {
    logCallback(`Successfully cataloged ${result.length} risk items via Gemini AI.`);
    result.forEach((risk) => {
      logCallback(`- [${risk.severity} Risk] ${risk.name} (${risk.type})`);
    });
    return result;
  }

  // Fallback to mock
  logCallback('Gemini API offline. Synthesizing risk index locally...');
  const mockResult = generateMockRisks(request);
  mockResult.forEach((risk) => {
    logCallback(`- [${risk.severity} Risk] ${risk.name} (Mock: ${risk.type})`);
  });
  return mockResult;
}
