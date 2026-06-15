import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from backend/.env or root .env
dotenv.config();
dotenv.config({ path: path.join(__dirname, '../../../.env') });

export const config = {
  PORT: process.env.PORT || '5000',
  DATABASE_URL: process.env.DATABASE_URL,
  EXA_API_KEY: process.env.EXA_API_KEY,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  NODE_ENV: process.env.NODE_ENV || 'development',
  isDev: (process.env.NODE_ENV || 'development') === 'development',
  hasApiKeys: !!(process.env.EXA_API_KEY || process.env.GEMINI_API_KEY)
};

console.log('--- Environment Configuration Loaded ---');
console.log(`PORT: ${config.PORT}`);
console.log(`DATABASE_URL: ${config.DATABASE_URL ? 'Configured (PostgreSQL)' : 'Not Configured (Mock In-Memory DB Mode)'}`);
console.log(`EXA_API_KEY: ${config.EXA_API_KEY ? 'Configured' : 'Not Configured (Research mock fallback)'}`);
console.log(`GEMINI_API_KEY: ${config.GEMINI_API_KEY ? 'Configured' : 'Not Configured (AI agents mock fallback)'}`);
console.log(`NODE_ENV: ${config.NODE_ENV}`);
console.log('----------------------------------------');
