import { Pool } from 'pg';
import { Report } from '../types';
import { config } from '../config/env';

// In-Memory Fallback Map
const inMemoryReports = new Map<string, Report>();

let pool: Pool | null = null;

if (config.DATABASE_URL) {
  try {
    pool = new Pool({
      connectionString: config.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false // Required for Heroku Postgres in many cases
      }
    });
    console.log('PostgreSQL Pool initialized.');
  } catch (error) {
    console.error('Failed to initialize PostgreSQL pool, falling back to In-Memory mode:', error);
    pool = null;
  }
}

export async function initDb() {
  if (!pool) {
    console.log('Using in-memory mock database store (no setup required).');
    return;
  }

  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS reports (
        id VARCHAR(50) PRIMARY KEY,
        request JSONB NOT NULL,
        status VARCHAR(20) NOT NULL,
        logs JSONB NOT NULL,
        requirements JSONB,
        research JSONB,
        architectures JSONB,
        cost JSONB,
        risks JSONB,
        recommendation JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(createTableQuery);
    console.log('PostgreSQL "reports" table verified/created.');
  } catch (error) {
    console.error('PostgreSQL table creation failed, falling back to In-Memory mode:', error);
    pool = null; // Disable postgres if connection fails
  }
}

export async function saveReport(report: Report): Promise<void> {
  // Always write to in-memory as well so it's cached/available
  inMemoryReports.set(report.id, report);

  if (!pool) {
    return;
  }

  try {
    const query = `
      INSERT INTO reports (id, request, status, logs, requirements, research, architectures, cost, risks, recommendation)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (id) DO UPDATE SET
        status = EXCLUDED.status,
        logs = EXCLUDED.logs,
        requirements = EXCLUDED.requirements,
        research = EXCLUDED.research,
        architectures = EXCLUDED.architectures,
        cost = EXCLUDED.cost,
        risks = EXCLUDED.risks,
        recommendation = EXCLUDED.recommendation;
    `;
    await pool.query(query, [
      report.id,
      JSON.stringify(report.request),
      report.status,
      JSON.stringify(report.logs),
      report.requirements ? JSON.stringify(report.requirements) : null,
      report.research ? JSON.stringify(report.research) : null,
      report.architectures ? JSON.stringify(report.architectures) : null,
      report.cost ? JSON.stringify(report.cost) : null,
      report.risks ? JSON.stringify(report.risks) : null,
      report.recommendation ? JSON.stringify(report.recommendation) : null
    ]);
  } catch (error) {
    console.error(`PostgreSQL save error for report ${report.id}:`, error);
  }
}

export async function getReport(id: string): Promise<Report | null> {
  // Try in-memory first for quick responses during active runs
  const memReport = inMemoryReports.get(id);
  if (memReport && memReport.status === 'running') {
    return memReport;
  }

  if (!pool) {
    return memReport || null;
  }

  try {
    const res = await pool.query('SELECT * FROM reports WHERE id = $1', [id]);
    if (res.rows.length === 0) {
      return memReport || null;
    }

    const row = res.rows[0];
    const report: Report = {
      id: row.id,
      request: typeof row.request === 'string' ? JSON.parse(row.request) : row.request,
      status: row.status,
      logs: typeof row.logs === 'string' ? JSON.parse(row.logs) : row.logs,
      requirements: row.requirements ? (typeof row.requirements === 'string' ? JSON.parse(row.requirements) : row.requirements) : undefined,
      research: row.research ? (typeof row.research === 'string' ? JSON.parse(row.research) : row.research) : undefined,
      architectures: row.architectures ? (typeof row.architectures === 'string' ? JSON.parse(row.architectures) : row.architectures) : undefined,
      cost: row.cost ? (typeof row.cost === 'string' ? JSON.parse(row.cost) : row.cost) : undefined,
      risks: row.risks ? (typeof row.risks === 'string' ? JSON.parse(row.risks) : row.risks) : undefined,
      recommendation: row.recommendation ? (typeof row.recommendation === 'string' ? JSON.parse(row.recommendation) : row.recommendation) : undefined,
      createdAt: row.created_at
    };
    
    // Cache in memory
    inMemoryReports.set(report.id, report);
    return report;
  } catch (error) {
    console.error(`PostgreSQL load error for report ${id}:`, error);
    return memReport || null;
  }
}

export async function listReports(): Promise<Report[]> {
  if (!pool) {
    return Array.from(inMemoryReports.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  try {
    const res = await pool.query('SELECT id, request, status, created_at FROM reports ORDER BY created_at DESC');
    return res.rows.map(row => ({
      id: row.id,
      request: typeof row.request === 'string' ? JSON.parse(row.request) : row.request,
      status: row.status,
      logs: [],
      createdAt: row.created_at
    }));
  } catch (error) {
    console.error('PostgreSQL list error, listing in-memory:', error);
    return Array.from(inMemoryReports.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}
