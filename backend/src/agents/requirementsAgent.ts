import { AnalysisRequest, RequirementsAnalysis } from '../types';
import { askGeminiJson } from '../utils/gemini';
import { generateMockRequirements } from './mockDataGenerator';

const SYSTEM_INSTRUCTION = `You are the Lead Technical Requirements Analyst of TechStack AI, an autonomous system architect.
Your task is to analyze a software project proposal and extract key technical constraints and non-functional requirements.
You MUST output your response strictly as a JSON object matching this TypeScript interface:
{
  "productType": "string (categorized category of this project)",
  "expectedUsers": "string (summarized volume constraints)",
  "realTimeRequirements": "string (latency, protocol, socket specifications)",
  "storageRequirements": "string (database features, geospatial, spatial, relational data requirements)",
  "aiRequirements": "string (agentic, LLM, prompt, model retrieval requirements)",
  "securityRequirements": "string (encryption, privacy, regulatory rules)",
  "scalabilityRequirements": "string (scaling bounds, horizontal vs vertical specifications)"
}
Do not add any markdown markup besides the JSON object. Do not include any backticks or explanation outside the JSON.`;

export async function runRequirementsAgent(
  request: AnalysisRequest,
  logCallback: (msg: string) => void
): Promise<RequirementsAnalysis> {
  logCallback('Initializing Requirements Analysis Agent...');
  logCallback(`Parsing details for product: "${request.description.substring(0, 50)}..."`);
  logCallback(`Parameters: ${request.expectedUsers} users, budget ${request.budget}, timeline ${request.timeline}`);

  // Query Gemini API
  const prompt = JSON.stringify(request);
  const result = await askGeminiJson<RequirementsAnalysis>(SYSTEM_INSTRUCTION, prompt);

  if (result) {
    logCallback('Requirements analysis successfully generated via Gemini API.');
    logCallback(`Identified Product Category: ${result.productType}`);
    return result;
  }

  // Fallback to mock
  logCallback('Gemini API offline or missing key. Falling back to local Requirements Analyser...');
  const mockResult = generateMockRequirements(request);
  logCallback(`Identified Product Category (Mock): ${mockResult.productType}`);
  return mockResult;
}
