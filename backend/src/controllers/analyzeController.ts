import { Request, Response } from 'express';
import { startAnalysis } from '../services/orchestratorService';
import { getReport, listReports } from '../utils/db';
import { config } from '../config/env';

export async function analyzeProject(req: Request, res: Response): Promise<void> {
  try {
    const { description, expectedUsers, budget, timeline } = req.body;

    if (!description || typeof description !== 'string' || description.trim().length < 5) {
      res.status(400).json({ error: 'Please provide a valid project description (minimum 5 characters).' });
      return;
    }

    const requestData = {
      description: description.trim(),
      expectedUsers: expectedUsers ? String(expectedUsers).trim() : '10,000',
      budget: budget ? String(budget).trim() : 'Negotiable',
      timeline: timeline ? String(timeline).trim() : 'Not Specified'
    };

    const reportId = startAnalysis(requestData);
    res.status(202).json({ id: reportId, message: 'Analysis pipeline started successfully.' });
  } catch (error: any) {
    console.error('Error in analyzeProject controller:', error);
    res.status(500).json({ error: 'Internal server error while starting analysis.' });
  }
}

export async function getReportById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const report = await getReport(id);

    if (!report) {
      res.status(404).json({ error: `Analysis report with ID ${id} not found.` });
      return;
    }

    res.json(report);
  } catch (error) {
    console.error('Error in getReportById controller:', error);
    res.status(500).json({ error: 'Internal server error while loading report.' });
  }
}

export async function getAllReports(req: Request, res: Response): Promise<void> {
  try {
    const reports = await listReports();
    res.json(reports);
  } catch (error) {
    console.error('Error in getAllReports controller:', error);
    res.status(500).json({ error: 'Internal server error while listing reports.' });
  }
}

export async function checkHealth(req: Request, res: Response): Promise<void> {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    apiKeys: {
      exaConfigured: !!config.EXA_API_KEY,
      geminiConfigured: !!config.GEMINI_API_KEY
    },
    database: {
      postgresConfigured: !!config.DATABASE_URL
    }
  });
}
