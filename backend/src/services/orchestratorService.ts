import { AnalysisRequest, Report, LogEntry } from '../types';
import { saveReport, getReport } from '../utils/db';
import { runRequirementsAgent } from '../agents/requirementsAgent';
import { runResearchAgent } from '../agents/researchAgent';
import { runArchitectureAgent } from '../agents/architectureAgent';
import { runCostAgent } from '../agents/costAgent';
import { runRiskAgent } from '../agents/riskAgent';
import { runRecommendationAgent } from '../agents/recommendationAgent';

export function startAnalysis(request: AnalysisRequest): string {
  const reportId = `report_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  
  const initialLog: LogEntry = {
    timestamp: new Date().toISOString(),
    message: 'System Orchestrator: Received analysis trigger. Validating input parameters...'
  };

  const newReport: Report = {
    id: reportId,
    request,
    status: 'running',
    logs: [initialLog],
    createdAt: new Date().toISOString()
  };

  // Save report to initialize it
  saveReport(newReport).then(() => {
    // Start background sequential execution
    runPipelineAsync(reportId).catch((err) => {
      console.error(`Orchestrator pipeline error on report ${reportId}:`, err);
    });
  });

  return reportId;
}

async function runPipelineAsync(reportId: string): Promise<void> {
  const report = await getReport(reportId);
  if (!report) {
    console.error(`Report ${reportId} not found in database. Aborting pipeline.`);
    return;
  }

  const addLog = async (message: string) => {
    const freshReport = await getReport(reportId);
    if (freshReport) {
      freshReport.logs.push({
        timestamp: new Date().toISOString(),
        message
      });
      await saveReport(freshReport);
    }
  };

  try {
    await addLog('System Orchestrator: Multi-stage pipeline launched successfully.');

    // Stage 1: Requirements Agent
    await addLog('System Orchestrator: Activating Stage 1 - Requirements Analysis Agent...');
    const requirements = await runRequirementsAgent(report.request, addLog);
    
    // Update report
    let updatedReport = await getReport(reportId);
    if (updatedReport) {
      updatedReport.requirements = requirements;
      await saveReport(updatedReport);
    }

    // Stage 2: Research Agent
    await addLog('System Orchestrator: Activating Stage 2 - Exa AI Research Agent...');
    const research = await runResearchAgent(report.request, requirements, addLog);
    
    updatedReport = await getReport(reportId);
    if (updatedReport) {
      updatedReport.research = research;
      await saveReport(updatedReport);
    }

    // Stage 3: Architecture Agent
    await addLog('System Orchestrator: Activating Stage 3 - Systems Architecture Design Agent...');
    const architectures = await runArchitectureAgent(report.request, requirements, research, addLog);
    
    updatedReport = await getReport(reportId);
    if (updatedReport) {
      updatedReport.architectures = architectures;
      await saveReport(updatedReport);
    }

    // Stage 4: Cost Analysis Agent
    await addLog('System Orchestrator: Activating Stage 4 - FinOps Infrastructure Costing Agent...');
    const cost = await runCostAgent(report.request, requirements, architectures, addLog);
    
    updatedReport = await getReport(reportId);
    if (updatedReport) {
      updatedReport.cost = cost;
      await saveReport(updatedReport);
    }

    // Stage 5: Risk Agent
    await addLog('System Orchestrator: Activating Stage 5 - Technical Risk Assessor Agent...');
    const risks = await runRiskAgent(report.request, requirements, architectures, addLog);
    
    updatedReport = await getReport(reportId);
    if (updatedReport) {
      updatedReport.risks = risks;
      await saveReport(updatedReport);
    }

    // Stage 6: Recommendation Agent
    await addLog('System Orchestrator: Activating Stage 6 - Decision Recommendation Orchestrator...');
    const recommendation = await runRecommendationAgent(report.request, requirements, architectures, cost, risks, addLog);
    
    updatedReport = await getReport(reportId);
    if (updatedReport) {
      updatedReport.recommendation = recommendation;
      updatedReport.status = 'completed';
      updatedReport.logs.push({
        timestamp: new Date().toISOString(),
        message: 'System Orchestrator: TechStack AI analysis generated successfully. Compilation complete.'
      });
      await saveReport(updatedReport);
    }
    
    console.log(`Orchestrator pipeline completed successfully for report ${reportId}.`);
  } catch (error: any) {
    console.error(`Orchestrator pipeline crash for report ${reportId}:`, error);
    const failedReport = await getReport(reportId);
    if (failedReport) {
      failedReport.status = 'failed';
      failedReport.logs.push({
        timestamp: new Date().toISOString(),
        message: `FATAL ERROR: Orchestrator execution halted. Reason: ${error.message || error}`
      });
      await saveReport(failedReport);
    }
  }
}
