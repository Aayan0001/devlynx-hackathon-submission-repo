import { AnalysisRequest, RequirementsAnalysis, ResearchResults } from '../types';
import { searchExa } from '../utils/exa';
import { askGeminiJson } from '../utils/gemini';
import { generateMockResearch } from './mockDataGenerator';

const SYSTEM_INSTRUCTION = `You are the Lead Research Agent of TechStack AI.
Your task is to review a software request, a requirements breakdown, and web search snippets to compile:
1. Similar applications (real-world companies or systems using similar patterns).
2. Architectural case studies (summarized learnings from engineering blogs/articles).
3. Technical best practices (engineering guidelines for this category of product).

You MUST output your response strictly as a JSON object matching this TypeScript interface:
{
  "similarApplications": ["string"],
  "caseStudies": ["string"],
  "bestPractices": ["string"]
}
Do not add any markdown formatting besides the JSON object.`;

export async function runResearchAgent(
  request: AnalysisRequest,
  requirements: RequirementsAnalysis,
  logCallback: (msg: string) => void
): Promise<ResearchResults> {
  logCallback('Initializing Research Agent...');
  
  // Construct search query
  const query = `engineering case study architectural pattern tech stack for ${requirements.productType} ${request.description.substring(0, 80)}`;
  logCallback(`Formulated Exa semantic query: "${query}"`);
  logCallback('Contacting Exa AI search engine for index lookup...');
  
  const citations = await searchExa(query);
  logCallback(`Exa search completed. Found ${citations.length} technical references.`);
  
  citations.forEach((c, idx) => {
    logCallback(`[Citation ${idx + 1}] Found article: "${c.title}" -> ${c.url}`);
  });

  const prompt = JSON.stringify({
    request,
    requirements,
    searchReferences: citations
  });

  logCallback('Synthesizing research notes and engineering case studies...');
  const result = await askGeminiJson<Omit<ResearchResults, 'citations'>>(SYSTEM_INSTRUCTION, prompt);

  if (result) {
    logCallback('Research notes successfully synthesized via Gemini AI.');
    return {
      similarApplications: result.similarApplications,
      caseStudies: result.caseStudies,
      bestPractices: result.bestPractices,
      citations: citations
    };
  }

  // Fallback to mock
  logCallback('Gemini API offline. Synthesizing research notes locally...');
  return generateMockResearch(request, citations);
}
