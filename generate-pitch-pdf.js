const fs = require('fs');
const PDFDocument = require('pdfkit');

// Initialize the PDF Document with letter size and margins
const doc = new PDFDocument({
  size: 'LETTER',
  margins: { top: 54, bottom: 54, left: 54, right: 54 },
  bufferPages: true // Enables page tracking for second-pass footer addition
});

// Stream the output to a local PDF file
doc.pipe(fs.createWriteStream('TechStack_AI_Executive_Summary_and_Moat.pdf'));

// Global styling constants
const COLOR_PRIMARY = '#1E1B4B';   // Deep Indigo
const COLOR_ACCENT = '#4F46E5';    // Premium Indigo Accent
const COLOR_TEXT_DARK = '#1F2937'; // Charcoal body text
const COLOR_TEXT_MUTED = '#4B5563';// Slate gray muted text
const COLOR_BG_LIGHT = '#F9FAFB';  // Warm white / Light gray for panels
const COLOR_BORDER = '#E5E7EB';    // Border gray
const COLOR_HIGHLIGHT = '#EEF2F6'; // Info panel background

// Helper to draw a top accent header bar
function drawHeaderBar() {
  doc.save();
  doc.rect(0, 0, 612, 10).fill(COLOR_PRIMARY);
  doc.restore();
}

// Helper to draw section headers with a premium vertical accent bar
function drawSectionTitle(title, tag = null) {
  doc.moveDown(1.2);
  const currentY = doc.y;
  
  if (tag) {
    doc.fillColor(COLOR_ACCENT).font('Helvetica-Bold').fontSize(8).text(tag.toUpperCase(), 54, currentY, { characterSpacing: 1.5 });
    doc.moveDown(0.25);
  }
  
  const headerY = doc.y;
  
  // Draw the vertical accent strip
  doc.save();
  doc.rect(54, headerY + 1, 4, 15).fill(COLOR_ACCENT);
  doc.restore();
  
  // Text shifted to the right of the vertical bar
  doc.fillColor(COLOR_PRIMARY).font('Helvetica-Bold').fontSize(13).text(title, 64, headerY);
  
  // Reset horizontal cursor
  doc.x = 54;
  doc.moveDown(0.4);
  
  // Draw light divider line under the heading
  doc.strokeColor(COLOR_BORDER).lineWidth(1).moveTo(54, doc.y).lineTo(558, doc.y).stroke();
  doc.moveDown(0.6);
}

// ==========================================
// PAGE 1: BRANDING & EXECUTIVE SUMMARY
// ==========================================
drawHeaderBar();

// Main branding header
doc.moveDown(2);
doc.fillColor(COLOR_PRIMARY).font('Helvetica-Bold').fontSize(24).text('TECHSTACK ', { continued: true });
doc.fillColor(COLOR_ACCENT).text('AI');

doc.fillColor(COLOR_TEXT_MUTED).font('Helvetica-Bold').fontSize(9).text('AUTONOMOUS TECHNICAL DECISION COPILOT', { characterSpacing: 2.5 });
doc.moveDown(0.5);

// Main header separator
doc.strokeColor(COLOR_BORDER).lineWidth(1.5).moveTo(54, doc.y).lineTo(558, doc.y).stroke();
doc.moveDown(1);

// Hook statement
doc.fillColor(COLOR_TEXT_DARK)
   .font('Helvetica-BoldOblique')
   .fontSize(10.5)
   .text('A production-grade, multi-agent orchestrator that structures requirements, queries live web pricing, and builds executable stack blueprints in under 60 seconds.', { lineGap: 3 });
doc.moveDown(1.2);

// SECTION: What is TechStack AI?
drawSectionTitle('What is TechStack AI?', 'Executive Summary');

// Layman Analogy Panel
const analogyY = doc.y;
doc.save();
doc.fillColor(COLOR_BG_LIGHT)
   .strokeColor(COLOR_BORDER)
   .lineWidth(1)
   .roundedRect(54, analogyY, 504, 95, 6)
   .fillAndStroke();
doc.restore();

doc.fillColor(COLOR_PRIMARY).font('Helvetica-Bold').fontSize(11).text('The House-Building Analogy (For Laymen)', 70, analogyY + 12);
doc.fillColor(COLOR_TEXT_DARK).font('Helvetica').fontSize(9.5).text(
  'Building a software application is like constructing a house. You cannot just start laying bricks. You need an architect to design the blueprint, a surveyor to evaluate the soil, a budget planner to estimate costs, and a safety inspector to check for hazards. TechStack AI acts as this entire professional team in one unified digital intelligence. You state what you want to build in plain English, and it designs, budgets, and safety-audits your app\'s technical foundation.',
  { width: 472, lineGap: 3 }
);

// Reset Y cursor below the analogy panel
doc.x = 54;
doc.y = analogyY + 112;

// Column layout: Problem vs. Solution
const colWidth = 242;
const colGap = 20;
const leftColX = 54;
const rightColX = leftColX + colWidth + colGap;
const colsTopY = doc.y;

// Left Column: The Problem
doc.fillColor(COLOR_PRIMARY).font('Helvetica-Bold').fontSize(11).text('The Problem We Solve', leftColX, colsTopY);
doc.moveDown(0.4);
doc.fillColor(COLOR_TEXT_DARK).font('Helvetica').fontSize(9.5).text(
  'Engineers often pick technologies based on familiarity or hype rather than suitability. When trying to research better options, they face a wall of stale articles. Generic AI models fail to solve this: they have old knowledge cutoffs, cannot query live vendor rates, and frequently hallucinate software versions, leading to costly architectural debt.',
  { width: colWidth, lineGap: 3.5 }
);
const leftColEndY = doc.y;

// Right Column: The Solution
doc.fillColor(COLOR_PRIMARY).font('Helvetica-Bold').fontSize(11).text('The Intelligent Solution', rightColX, colsTopY);
doc.moveDown(0.4);
doc.fillColor(COLOR_TEXT_DARK).font('Helvetica').fontSize(9.5).text(
  'TechStack AI automates technical decision-making. By taking simple feature prompts, it performs real-time semantic web research on database and cloud costs, outlines three tailored blueprints (Lightweight, Enterprise, Bleeding-Edge), models cost-scaling formulas, audits system vulnerabilities, and writes executable configurations.',
  { width: colWidth, lineGap: 3.5 }
);
const rightColEndY = doc.y;

// Resume layout below columns
doc.x = 54;
doc.y = Math.max(leftColEndY, rightColEndY) + 12;

// SECTION: System Pipeline
drawSectionTitle('The Multi-Agent Pipeline', 'Technical Architecture');

doc.fillColor(COLOR_TEXT_DARK).font('Helvetica').fontSize(9.5).text(
  'Rather than generating a flat response, TechStack AI delegates architectural design to six sequential agents. The structured output of each stage feeds the next, eliminating hallucinations and ensuring technical rigor:',
  { lineGap: 3 }
);
doc.moveDown(0.6);

const agents = [
  { name: '1. Requirements Analyst', desc: 'Distills informal features into strict engineering parameters.' },
  { name: '2. Research Agent (Exa AI)', desc: 'Performs semantic web queries to fetch live database and infrastructure rates.' },
  { name: '3. Architecture Agent', desc: 'Synthesizes three blueprint tiers: Lightweight, Enterprise-Grade, and Bleeding-Edge.' },
  { name: '4. FinOps Cost Auditor', desc: 'Constructs mathematical cost formulas to support interactive user scaling simulations.' },
  { name: '5. Engineering Risk Agent', desc: 'Performs a comprehensive safety audit, highlighting lock-in and security gaps.' },
  { name: '6. Recommendation Agent', desc: 'Selects the winner and generates ready-to-use Docker and DB schema setups.' }
];

agents.forEach(agent => {
  doc.fillColor(COLOR_PRIMARY).font('Helvetica-Bold').fontSize(9.5).text(`  *  ${agent.name}: `, { continued: true });
  doc.fillColor(COLOR_TEXT_DARK).font('Helvetica').fontSize(9.5).text(agent.desc);
  doc.moveDown(0.35);
});

// ==========================================
// PAGE 2: PRODUCT MOAT & SUBMISSION
// ==========================================
doc.addPage();
drawHeaderBar();

// Title for Page 2
doc.moveDown(2);
doc.fillColor(COLOR_PRIMARY).font('Helvetica-Bold').fontSize(20).text('The TechStack AI Moat');
doc.fillColor(COLOR_TEXT_MUTED).font('Helvetica-Bold').fontSize(9).text('WHY THIS SOLUTION IS DEFENSIBLE & DEEP FOR JUDGES', { characterSpacing: 1.5 });
doc.moveDown(0.5);
doc.strokeColor(COLOR_BORDER).lineWidth(1).moveTo(54, doc.y).lineTo(558, doc.y).stroke();
doc.moveDown(1);

// Moat Intro
doc.fillColor(COLOR_TEXT_DARK).font('Helvetica').fontSize(9.5).text(
  'TechStack AI goes beyond simple prompt wrappers by incorporating custom architectural patterns, live cost functions, and local runtime resilience that establish a true technical moat:',
  { lineGap: 3.5 }
);
doc.moveDown(0.8);

const moats = [
  {
    title: '1. Real-time Neural Web Search & Verification',
    desc: 'Standard LLMs cannot verify active vendor updates. We integrate Exa AI API to run semantic web searches. Rather than keyword matches, it queries raw engineering documentation to fetch real-world performance, returning verifiable, clickable citations in the user dashboard.'
  },
  {
    title: '2. Dynamic Cost Parametrization (Dynamic Sliders)',
    desc: 'Static charts become outdated immediately. TechStack AI isolates operational cost models (base compute, storage scaling multipliers, API charges) as raw variables. The client UI parses this model to build dynamic scaling calculators, letting users sweep sliders from 1k to 100k users to visualize costs.'
  },
  {
    title: '3. Concrete Code Synthesis & Custom Database Indexing',
    desc: 'The tool designs concrete schemas tailored to stack choices. If geographic services are needed, it generates PostGIS spatial tables and GIST indices; if vector AI capabilities are specified, it builds pgvector HNSW cosine-distance tables, bypassing standard AI code placeholders.'
  },
  {
    title: '4. Local-First Zero-Config Resilience',
    desc: 'Built with production reliability, the server detects missing keys on startup. It falls back to a rules-based template library and transitions database storage to a custom in-memory mock engine. This makes the application run seamlessly without complex local setup.'
  }
];

moats.forEach(moat => {
  doc.fillColor(COLOR_PRIMARY).font('Helvetica-Bold').fontSize(11).text(moat.title);
  doc.moveDown(0.25);
  doc.fillColor(COLOR_TEXT_DARK).font('Helvetica').fontSize(9.5).text(moat.desc, { lineGap: 3.5 });
  doc.moveDown(0.85);
});

// Technical Submission context
doc.moveDown(0.5);
const contextY = doc.y;
doc.save();
doc.fillColor(COLOR_HIGHLIGHT)
   .strokeColor(COLOR_BORDER)
   .lineWidth(1)
   .roundedRect(54, contextY, 504, 75, 6)
   .fillAndStroke();
doc.restore();

doc.fillColor(COLOR_PRIMARY).font('Helvetica-Bold').fontSize(10.5).text('Submission & Integration Context', 70, contextY + 12);
doc.fillColor(COLOR_TEXT_MUTED).font('Helvetica').fontSize(8.5).text(
  '  *  GitHub Repo: https://github.com/Aayan0001/devlynx-hackathon-submission-repo\n' +
  '  *  Auto-Sync Watcher: PowerShell auto-sync script runs locally to sync codebase changes live.\n' +
  '  *  Architecture: Express + TypeScript API, React + Tailwind Frontend, PostgreSQL + Memory DB layers.\n' +
  '  *  Heroku Deploy: Standard buildpack configuration, Procfile, and deploy scripts are committed.',
  { width: 472, lineGap: 3 }
);

// ==========================================
// SECOND PASS: ADD FOOTERS & PAGE NUMBERS
// ==========================================
const range = doc.bufferedPageRange();
for (let i = 0; i < range.count; i++) {
  doc.switchToPage(i);
  
  // Footer text
  doc.fillColor(COLOR_TEXT_MUTED)
     .font('Helvetica')
     .fontSize(8)
     .text(
       `TechStack AI  *  Hackathon Executive Pitch  *  Page ${i + 1} of ${range.count}`,
       54,
       738,
       { align: 'center', width: 504 }
     );
}

// Finalize the PDF
doc.end();
console.log('PDF Compiled Successfully: TechStack_AI_Executive_Summary_and_Moat.pdf');
