import React, { useState } from 'react';
import { 
  Award, ShieldAlert, DollarSign, Database, Copy, Check, Download, 
  ExternalLink, Layers, GitFork, RefreshCw, Cpu, Activity 
} from 'lucide-react';
import { Report, ArchitectureOption, Risk, Citation } from '../types';

interface SchemaField {
  name: string;
  type: string;
  constraints: string;
}

interface SchemaTable {
  tableName: string;
  fields: SchemaField[];
  indexes: string[];
}

function getDatabaseSchema(description: string): SchemaTable[] {
  const desc = description.toLowerCase();
  
  if (desc.includes('uber') || desc.includes('ride') || desc.includes('map') || desc.includes('gps')) {
    return [
      {
        tableName: 'drivers',
        fields: [
          { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY' },
          { name: 'name', type: 'VARCHAR(100)', constraints: 'NOT NULL' },
          { name: 'rating', type: 'NUMERIC(3,2)', constraints: 'DEFAULT 5.00' },
          { name: 'status', type: 'VARCHAR(20)', constraints: 'NOT NULL DEFAULT \'offline\'' },
          { name: 'created_at', type: 'TIMESTAMP', constraints: 'DEFAULT CURRENT_TIMESTAMP' }
        ],
        indexes: [
          'CREATE INDEX idx_drivers_status ON drivers(status);'
        ]
      },
      {
        tableName: 'driver_locations',
        fields: [
          { name: 'id', type: 'BIGSERIAL', constraints: 'PRIMARY KEY' },
          { name: 'driver_id', type: 'UUID', constraints: 'REFERENCES drivers(id) ON DELETE CASCADE' },
          { name: 'coords', type: 'GEOMETRY(Point, 4326)', constraints: 'NOT NULL' },
          { name: 'speed_kmh', type: 'NUMERIC(5,2)', constraints: 'DEFAULT 0.00' },
          { name: 'heading_deg', type: 'INTEGER', constraints: 'CHECK (heading_deg >= 0 AND heading_deg <= 360)' },
          { name: 'updated_at', type: 'TIMESTAMP', constraints: 'DEFAULT CURRENT_TIMESTAMP' }
        ],
        indexes: [
          'CREATE INDEX idx_driver_locations_spatial ON driver_locations USING gist(coords);',
          'CREATE INDEX idx_driver_locations_driver_id ON driver_locations(driver_id);'
        ]
      },
      {
        tableName: 'trips',
        fields: [
          { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY' },
          { name: 'passenger_id', type: 'UUID', constraints: 'NOT NULL' },
          { name: 'driver_id', type: 'UUID', constraints: 'REFERENCES drivers(id)' },
          { name: 'status', type: 'VARCHAR(30)', constraints: 'NOT NULL DEFAULT \'requested\'' },
          { name: 'pickup_coords', type: 'GEOMETRY(Point, 4326)', constraints: 'NOT NULL' },
          { name: 'dropoff_coords', type: 'GEOMETRY(Point, 4326)', constraints: 'NOT NULL' },
          { name: 'fare_amount', type: 'NUMERIC(10,2)', constraints: 'DEFAULT 0.00' },
          { name: 'created_at', type: 'TIMESTAMP', constraints: 'DEFAULT CURRENT_TIMESTAMP' }
        ],
        indexes: [
          'CREATE INDEX idx_trips_driver_passenger ON trips(driver_id, passenger_id);',
          'CREATE INDEX idx_trips_status ON trips(status);'
        ]
      }
    ];
  } else if (desc.includes('ai') || desc.includes('saas') || desc.includes('openai') || desc.includes('llm') || desc.includes('seo') || desc.includes('automation') || desc.includes('rag')) {
    return [
      {
        tableName: 'users',
        fields: [
          { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY' },
          { name: 'email', type: 'VARCHAR(255)', constraints: 'UNIQUE NOT NULL' },
          { name: 'password_hash', type: 'VARCHAR(255)', constraints: 'NOT NULL' },
          { name: 'plan_tier', type: 'VARCHAR(50)', constraints: 'DEFAULT \'free\'' },
          { name: 'created_at', type: 'TIMESTAMP', constraints: 'DEFAULT CURRENT_TIMESTAMP' }
        ],
        indexes: [
          'CREATE INDEX idx_users_email ON users(email);'
        ]
      },
      {
        tableName: 'documents',
        fields: [
          { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY' },
          { name: 'user_id', type: 'UUID', constraints: 'REFERENCES users(id) ON DELETE CASCADE' },
          { name: 'title', type: 'VARCHAR(255)', constraints: 'NOT NULL' },
          { name: 'raw_content', type: 'TEXT', constraints: 'NOT NULL' },
          { name: 'created_at', type: 'TIMESTAMP', constraints: 'DEFAULT CURRENT_TIMESTAMP' }
        ],
        indexes: [
          'CREATE INDEX idx_documents_user_id ON documents(user_id);'
        ]
      },
      {
        tableName: 'document_chunks',
        fields: [
          { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY' },
          { name: 'document_id', type: 'UUID', constraints: 'REFERENCES documents(id) ON DELETE CASCADE' },
          { name: 'chunk_text', type: 'TEXT', constraints: 'NOT NULL' },
          { name: 'embedding', type: 'VECTOR(1536)', constraints: 'NOT NULL' }
        ],
        indexes: [
          'CREATE INDEX idx_document_chunks_vector ON document_chunks USING hnsw (embedding vector_cosine_ops);',
          'CREATE INDEX idx_document_chunks_doc_id ON document_chunks(document_id);'
        ]
      }
    ];
  } else {
    return [
      {
        tableName: 'users',
        fields: [
          { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY' },
          { name: 'email', type: 'VARCHAR(255)', constraints: 'UNIQUE NOT NULL' },
          { name: 'password_hash', type: 'VARCHAR(255)', constraints: 'NOT NULL' },
          { name: 'role', type: 'VARCHAR(50)', constraints: 'NOT NULL DEFAULT \'buyer\'' },
          { name: 'created_at', type: 'TIMESTAMP', constraints: 'DEFAULT CURRENT_TIMESTAMP' }
        ],
        indexes: [
          'CREATE INDEX idx_users_email ON users(email);'
        ]
      },
      {
        tableName: 'storefronts',
        fields: [
          { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY' },
          { name: 'owner_id', type: 'UUID', constraints: 'REFERENCES users(id) ON DELETE CASCADE' },
          { name: 'name', type: 'VARCHAR(150)', constraints: 'NOT NULL' },
          { name: 'description', type: 'TEXT', constraints: '' }
        ],
        indexes: [
          'CREATE INDEX idx_storefronts_owner ON storefronts(owner_id);'
        ]
      },
      {
        tableName: 'products',
        fields: [
          { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY' },
          { name: 'storefront_id', type: 'UUID', constraints: 'REFERENCES storefronts(id) ON DELETE CASCADE' },
          { name: 'name', type: 'VARCHAR(200)', constraints: 'NOT NULL' },
          { name: 'description', type: 'TEXT', constraints: '' },
          { name: 'price_cents', type: 'INTEGER', constraints: 'NOT NULL CHECK (price_cents >= 0)' },
          { name: 'stock_quantity', type: 'INTEGER', constraints: 'NOT NULL DEFAULT 0' }
        ],
        indexes: [
          'CREATE INDEX idx_products_storefront_id ON products(storefront_id);',
          'CREATE INDEX idx_products_search_idx ON products USING gin(to_tsvector(\'english\', name || \' \' || description));'
        ]
      }
    ];
  }
}

interface ResultsViewProps {
  report: Report;
}

export default function ResultsView({ report }: ResultsViewProps) {
  const { requirements, research, architectures = [], cost, risks = [], recommendation } = report;

  // Selected architecture option to explore detailed diagram / code files
  const [selectedArchId, setSelectedArchId] = useState<string>('arch_rec');
  
  // Cost Simulator states
  const [simUsers, setSimUsers] = useState<number>(50000);
  const [readWriteMultiplier, setReadWriteMultiplier] = useState<number>(1.0); // 0.5 for light, 1.0 for normal, 1.5 for heavy
  
  // Copy feedback states
  const [copiedFile, setCopiedFile] = useState<'docker' | 'readme' | null>(null);

  const activeArch = architectures.find(a => a.id === selectedArchId) || architectures[0] || {} as ArchitectureOption;
  const recommendedArch = architectures.find(a => a.id === 'arch_rec') || architectures[0];

  // Exporter: download configurations
  const handleDownloadFiles = () => {
    if (!recommendation) return;
    
    // Create combined configurations bundle as file
    const content = `=== DOCKER-COMPOSE.YML ===\n${recommendation.dockerComposeBoilerplate}\n\n=== README.MD ===\n${recommendation.boilerplateReadme}`;
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `techstack_${selectedArchId}_config.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopyCode = (text: string, type: 'docker' | 'readme') => {
    navigator.clipboard.writeText(text);
    setCopiedFile(type);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  // Dynamic Cost Calculations
  const coeffs = cost?.costFormulaCoefficients || { hostingFactor: 0.05, databaseFactor: 0.08, aiFactor: 0.12 };
  const simHosting = Math.max(15, Math.round(simUsers * coeffs.hostingFactor * 0.1));
  const simDatabase = Math.max(20, Math.round(simUsers * coeffs.databaseFactor * 0.1 * readWriteMultiplier));
  const simAI = report.request.description.toLowerCase().includes('ai') 
    ? Math.max(10, Math.round(simUsers * coeffs.aiFactor * 0.5))
    : Math.round(simUsers * coeffs.aiFactor * 0.1);
  const simTotal = simHosting + simDatabase + simAI;

  return (
    <div className="space-y-12 w-full max-w-7xl mx-auto py-6">
      
      {/* 1. Executive Summary / Final Recommendation */}
      {recommendation && (
        <div className="relative p-6 sm:p-8 rounded-3xl overflow-hidden glass-panel border border-accent/30 shadow-glow-accent">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-accent/5 filter blur-[60px] -z-10"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-3">
                <Award className="w-3.5 h-3.5" /> Recommended Decision
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Winner: {recommendation.chosenArchitectureName}
              </h2>
            </div>
            
            <button 
              onClick={handleDownloadFiles}
              className="px-5 py-3 bg-gradient-to-r from-accent to-indigo-600 hover:from-indigo-600 hover:to-accent text-white font-semibold rounded-xl text-sm transition-all duration-200 shadow-lg flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Download Tech Stack Boilerplate
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-accent uppercase tracking-wider mb-1">Decision Rationale</h4>
                <p className="text-gray-300 text-sm leading-relaxed font-light">{recommendation.rationale}</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-accent uppercase tracking-wider mb-1">Architectural Trade-offs</h4>
                <p className="text-gray-300 text-sm leading-relaxed font-light">{recommendation.tradeoffs}</p>
              </div>
            </div>
            
            <div className="p-5 bg-black/30 border border-white/5 rounded-2xl">
              <h4 className="text-xs font-bold text-success uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Activity className="w-4 h-4" /> Future Scaling Roadmap
              </h4>
              <div className="space-y-3">
                {recommendation.scalingPath.split('Phase').filter(p => p.trim()).map((phase, idx) => (
                  <div key={idx} className="flex gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-success/15 border border-success/30 text-success text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-gray-400 font-light leading-relaxed">
                      <span className="text-gray-300 font-medium">Phase {phase.trim().substring(0, 1)}:</span> 
                      {phase.trim().substring(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Three-Column Architecture Option Comparison */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Layers className="w-5 h-5 text-accent" /> Compare Architecture Stacks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {architectures.map((arch) => (
            <div 
              key={arch.id} 
              onClick={() => setSelectedArchId(arch.id)}
              className={`cursor-pointer p-6 rounded-2xl border transition-all duration-300 ${
                selectedArchId === arch.id 
                  ? 'bg-card border-accent shadow-glow-accent ring-1 ring-accent/30' 
                  : 'bg-card/40 border-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-white text-md tracking-tight leading-tight">{arch.name}</h3>
                <input 
                  type="radio" 
                  name="selectedArch" 
                  checked={selectedArchId === arch.id} 
                  onChange={() => setSelectedArchId(arch.id)}
                  className="text-accent focus:ring-accent"
                />
              </div>
              
              <div className="space-y-3 text-xs mb-6">
                <div><span className="text-gray-500">Frontend:</span> <span className="text-gray-300">{arch.frontend.split('(')[0]}</span></div>
                <div><span className="text-gray-500">Backend:</span> <span className="text-gray-300">{arch.backend.split('(')[0]}</span></div>
                <div><span className="text-gray-500">Database:</span> <span className="text-gray-300">{arch.database.split('(')[0]}</span></div>
                <div><span className="text-gray-500">Hosting:</span> <span className="text-gray-300">{arch.hosting.split('(')[0]}</span></div>
              </div>

              {/* Progress Bar Metrics */}
              <div className="space-y-2.5 border-t border-white/5 pt-4">
                <div className="flex justify-between items-center text-[10px] text-gray-500">
                  <span>Scalability</span>
                  <span className="text-gray-300 font-bold">{arch.scalabilityMetric}/10</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-accent h-full" style={{ width: `${arch.scalabilityMetric * 10}%` }}></div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-gray-500">
                  <span>Budget Friendliness</span>
                  <span className="text-gray-300 font-bold">{arch.budgetFriendlinessMetric}/10</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: `${arch.budgetFriendlinessMetric * 10}%` }}></div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-gray-500">
                  <span>Time-to-Market</span>
                  <span className="text-gray-300 font-bold">{arch.timeToMarketMetric}/10</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full" style={{ width: `${arch.timeToMarketMetric * 10}%` }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Side-by-Side Architectural Evaluation Matrix */}
        <div className="mt-8 p-6 bg-card border border-white/5 rounded-3xl">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-accent" /> Side-by-Side Architectural Evaluation Matrix
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-gray-400">
              <thead>
                <tr className="border-b border-white/5 text-[10px] uppercase tracking-wider text-gray-500">
                  <th className="py-3 pr-4">Evaluation Metric</th>
                  {architectures.map((a) => (
                    <th key={a.id} className="py-3 px-4 text-white font-semibold">{a.name.split(':')[0]}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-3.5 pr-4 font-medium text-gray-300">Scalability & Peak Capacity</td>
                  {architectures.map((a) => (
                    <td key={a.id} className="py-3.5 px-4 font-mono font-bold text-accent">{a.scalabilityMetric}/10</td>
                  ))}
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-3.5 pr-4 font-medium text-gray-300">Budget Friendliness</td>
                  {architectures.map((a) => (
                    <td key={a.id} className="py-3.5 px-4 font-mono font-bold text-emerald-400">{a.budgetFriendlinessMetric}/10</td>
                  ))}
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-3.5 pr-4 font-medium text-gray-300">Time-to-Market Speed</td>
                  {architectures.map((a) => (
                    <td key={a.id} className="py-3.5 px-4 font-mono font-bold text-amber-400">{a.timeToMarketMetric}/10</td>
                  ))}
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-3.5 pr-4 font-medium text-gray-300">Operational Simplicity</td>
                  {architectures.map((a) => (
                    <td key={a.id} className="py-3.5 px-4 font-mono font-bold text-cyan-400">{a.operationalSimplicityMetric}/10</td>
                  ))}
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-3.5 pr-4 font-medium text-gray-300">Talent Pool / Ease of Hiring</td>
                  {architectures.map((a) => (
                    <td key={a.id} className="py-3.5 px-4 font-mono font-bold text-indigo-300">{a.hiringEaseMetric}/10</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 3. Interactive Architectural Node Diagram (CSS/SVG) */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <GitFork className="w-5 h-5 text-accent" /> System Topology Diagram
        </h2>
        <p className="text-xs text-gray-500 mb-6">Interactive schema detailing requests and component flow for the selected stack.</p>
        
        <div className="p-8 bg-[#0c0d15] border border-white/5 rounded-3xl relative flex flex-col items-center justify-center overflow-x-auto min-h-[300px]">
          
          <div className="flex items-center gap-4 sm:gap-12 min-w-[650px] justify-center relative">
            
            {/* Frontend Block */}
            <div className="flex flex-col items-center w-36 text-center z-10">
              <div className="p-4 bg-accent/15 border border-accent/40 rounded-2xl w-full flex flex-col items-center gap-2 shadow-glow-accent">
                <Cpu className="w-6 h-6 text-accent" />
                <span className="text-xs font-bold text-white">Client / UI</span>
                <span className="text-[10px] text-gray-400 font-light truncate w-full">{activeArch.frontend ? activeArch.frontend.split(' ')[0] : 'React'}</span>
              </div>
            </div>

            {/* Arrow 1 */}
            <div className="flex flex-col items-center w-12 text-gray-600">
              <span className="text-[9px] text-gray-500 mb-1">HTTP/WS</span>
              <div className="w-full h-0.5 bg-gradient-to-r from-accent to-indigo-500 relative">
                <div className="absolute right-0 -top-1 w-2 h-2 border-t-2 border-r-2 border-indigo-500 transform rotate-45"></div>
              </div>
            </div>

            {/* Backend Server Block */}
            <div className="flex flex-col items-center w-40 text-center z-10">
              <div className="p-4 bg-indigo-500/10 border border-indigo-500/35 rounded-2xl w-full flex flex-col items-center gap-2">
                <Layers className="w-6 h-6 text-indigo-400" />
                <span className="text-xs font-bold text-white">Application API</span>
                <span className="text-[10px] text-gray-400 font-light truncate w-full">{activeArch.backend ? activeArch.backend.split(' ')[0] : 'Express'}</span>
              </div>
            </div>

            {/* Split Arrows */}
            <div className="flex flex-col items-center justify-center w-12 text-gray-600 relative h-32">
              {/* Database arrow (downwards/slant) */}
              <div className="absolute w-12 h-[2px] bg-gradient-to-r from-indigo-500 to-emerald-500 top-8 transform rotate-[30deg]"></div>
              {/* Cache arrow (horizontal) */}
              <div className="absolute w-12 h-[2px] bg-gradient-to-r from-indigo-500 to-amber-500 top-16"></div>
              {/* AI integration arrow (upwards/slant) */}
              <div className="absolute w-12 h-[2px] bg-gradient-to-r from-indigo-500 to-cyan-500 top-24 transform -rotate-[30deg]"></div>
            </div>

            {/* Data, Caching & AI Service Blocks */}
            <div className="flex flex-col gap-4 w-44 z-10">
              {/* AI Block */}
              <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex items-center gap-2.5">
                <Cpu className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <div className="text-left leading-tight min-w-0">
                  <div className="text-[10px] font-bold text-white">AI Services</div>
                  <div className="text-[9px] text-gray-400 font-light truncate w-full">{activeArch.aiIntegrations ? activeArch.aiIntegrations.split(' ')[0] : 'Gemini API'}</div>
                </div>
              </div>

              {/* Cache Block */}
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center gap-2.5">
                <RefreshCw className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <div className="text-left leading-tight min-w-0">
                  <div className="text-[10px] font-bold text-white">Cache Layer</div>
                  <div className="text-[9px] text-gray-400 font-light truncate w-full">{activeArch.caching ? activeArch.caching.split(' ')[0] : 'Redis'}</div>
                </div>
              </div>

              {/* DB Block */}
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2.5">
                <Database className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <div className="text-left leading-tight min-w-0">
                  <div className="text-[10px] font-bold text-white">Primary DB</div>
                  <div className="text-[9px] text-gray-400 font-light truncate w-full">{activeArch.database ? activeArch.database.split(' ')[0] : 'PostgreSQL'}</div>
                </div>
              </div>
            </div>

          </div>

          {/* Grid background for aesthetics */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10 grid-glow"></div>
        </div>
      </div>

    {/* Recommended Database Schema Blueprint */}
    <div className="p-6 sm:p-8 bg-[#121420]/60 border border-white/5 rounded-3xl">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 flex items-center gap-2">
        <Database className="w-5 h-5 text-accent animate-pulse" /> Recommended Database Schema Blueprint
      </h2>
      <p className="text-xs text-gray-500 mb-6 font-light">Targeted database tables structures, relational constraints, and performance query indexes.</p>
      
      <div className="space-y-6">
        {getDatabaseSchema(report.request.description).map((table, tIdx) => (
          <div key={tIdx} className="border border-white/5 rounded-2xl overflow-hidden bg-black/30">
            {/* Table Header */}
            <div className="px-4 py-3 bg-white/5 border-b border-white/5 flex items-center justify-between">
              <span className="text-xs font-bold text-white font-mono flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" /> Table: {table.tableName}
              </span>
            </div>
            
            {/* Columns Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-gray-400 font-mono">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] text-gray-500 uppercase tracking-wider">
                    <th className="py-2.5 px-4">Field Name</th>
                    <th className="py-2.5 px-4">Data Type</th>
                    <th className="py-2.5 px-4">Attributes / Constraints</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {table.fields.map((f, fIdx) => (
                    <tr key={fIdx} className="hover:bg-white/[0.01]">
                      <td className="py-2.5 px-4 text-emerald-400 font-bold">{f.name}</td>
                      <td className="py-2.5 px-4 text-indigo-300">{f.type}</td>
                      <td className="py-2.5 px-4 text-gray-500 font-light">{f.constraints || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Indexes */}
            {table.indexes.length > 0 && (
              <div className="p-4 bg-black/40 border-t border-white/5 font-mono text-[10px] text-gray-400">
                <span className="text-[9px] font-bold text-accent uppercase tracking-wider block mb-2">Performance Optimization Indexes</span>
                <div className="space-y-1">
                  {table.indexes.map((idxStr, idxKey) => (
                    <div key={idxKey} className="text-gray-300 bg-white/5 p-2 rounded border border-white/5 select-all">{idxStr}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>

      {/* 4. Dynamic Scaling & Cost Simulator Slider */}
      {cost && (
        <div className="p-6 sm:p-8 bg-[#121420] border border-white/5 rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-success animate-bounce" /> Traffic & Cost Simulator
              </h2>
              <p className="text-xs text-gray-500 mt-1">Simulate monthly running costs in real-time as users scale.</p>
            </div>
            
            <div className="text-right">
              <span className="text-xs text-gray-500 uppercase tracking-wider block">Estimated Total Cost</span>
              <span className="text-3xl font-extrabold text-success cyber-glow-green">${simTotal.toLocaleString()} <span className="text-xs font-normal text-gray-400">/ mo</span></span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 space-y-6">
              
              {/* User Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <label className="text-gray-300 font-semibold">Monthly Active Users (MAU)</label>
                  <span className="text-accent font-bold font-mono">{simUsers.toLocaleString()} Users</span>
                </div>
                <input 
                  type="range" 
                  min="1000" 
                  max="500000" 
                  step="5000" 
                  value={simUsers} 
                  onChange={(e) => setSimUsers(parseInt(e.target.value))}
                  className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer accent-accent"
                />
                <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                  <span>1k users</span>
                  <span>100k users</span>
                  <span>250k users</span>
                  <span>500k users</span>
                </div>
              </div>

              {/* DB Read/Write volume multiplier */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <label className="text-gray-300 font-semibold">Database Load Intensity</label>
                  <span className="text-emerald-400 font-bold font-mono">
                    {readWriteMultiplier === 0.5 ? 'Light Writes' : readWriteMultiplier === 1.0 ? 'Normal Reads/Writes' : 'Heavy Concurrent Writes (x1.5)'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <button 
                    onClick={() => setReadWriteMultiplier(0.5)}
                    className={`px-4 py-2 text-xs font-medium rounded-xl border transition ${readWriteMultiplier === 0.5 ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-white/5 border-white/5 hover:border-white/10 text-gray-400'}`}
                  >
                    Low Write
                  </button>
                  <button 
                    onClick={() => setReadWriteMultiplier(1.0)}
                    className={`px-4 py-2 text-xs font-medium rounded-xl border transition ${readWriteMultiplier === 1.0 ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-white/5 border-white/5 hover:border-white/10 text-gray-400'}`}
                  >
                    Balanced
                  </button>
                  <button 
                    onClick={() => setReadWriteMultiplier(1.5)}
                    className={`px-4 py-2 text-xs font-medium rounded-xl border transition ${readWriteMultiplier === 1.5 ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-white/5 border-white/5 hover:border-white/10 text-gray-400'}`}
                  >
                    Heavy IO
                  </button>
                </div>
              </div>
            </div>

            {/* Price breakdown bar matrix */}
            <div className="p-6 bg-black/40 border border-white/5 rounded-2xl space-y-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/5 pb-2">Line-Item Estimations</h4>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 font-light">Hosting Compute Cost</span>
                <span className="text-white font-mono font-bold">${simHosting.toLocaleString()}</span>
              </div>
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div className="bg-accent h-full" style={{ width: `${(simHosting / simTotal) * 100}%` }}></div>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 font-light">Database Storage / I/O</span>
                <span className="text-white font-mono font-bold">${simDatabase.toLocaleString()}</span>
              </div>
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full" style={{ width: `${(simDatabase / simTotal) * 100}%` }}></div>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 font-light">AI Model API Usage</span>
                <span className="text-white font-mono font-bold">${simAI.toLocaleString()}</span>
              </div>
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full" style={{ width: `${(simAI / simTotal) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Engineering Risk Matrix */}
      {risks.length > 0 && (
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-accent" /> Security & Architecture Risk Matrix
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {risks.map((risk, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-card border border-white/5 flex gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  risk.severity === 'High' 
                    ? 'bg-danger/10 text-danger border border-danger/25' 
                    : risk.severity === 'Medium' 
                      ? 'bg-warning/10 text-warning border border-warning/25' 
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                }`}>
                  <ShieldAlert className="w-5 h-5" />
                </div>
                
                <div className="space-y-2 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-bold text-white text-sm truncate">{risk.name}</h3>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      risk.severity === 'High' 
                        ? 'bg-danger/10 text-danger border border-danger/20' 
                        : risk.severity === 'Medium' 
                          ? 'bg-warning/10 text-warning border border-warning/20' 
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>{risk.severity}</span>
                  </div>
                  <p className="text-xs text-gray-400 font-light leading-relaxed">{risk.description}</p>
                  <div className="text-xs p-3 bg-black/30 border border-white/5 rounded-xl mt-2">
                    <span className="text-success font-semibold block text-[10px] uppercase tracking-wider mb-1">Mitigation Strategy</span>
                    <p className="text-gray-300 font-light">{risk.mitigation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Citations Sourced by Exa AI */}
      {research && research.citations && research.citations.length > 0 && (
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-accent" /> Verified Sourced References (Exa AI)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {research.citations.map((cite, idx) => (
              <a 
                key={idx} 
                href={cite.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="glass-panel glass-panel-hover p-6 rounded-2xl block text-left space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <h4 className="font-bold text-white text-xs leading-snug line-clamp-2">{cite.title}</h4>
                  <ExternalLink className="w-3.5 h-3.5 text-accent flex-shrink-0 mt-0.5" />
                </div>
                {cite.snippet && <p className="text-[11px] text-gray-500 line-clamp-3 leading-relaxed font-light">{cite.snippet}</p>}
                <div className="text-[9px] text-accent font-semibold truncate font-mono">{new URL(cite.url).hostname}</div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* 7. Boilerplate Code Viewer */}
      {recommendation && (
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Layers className="w-5 h-5 text-accent" /> Generated System Boilerplates
          </h2>
          <p className="text-xs text-gray-500 mb-6">Instantly export these files to spin up your dockerized stack or deploy to production.</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* File 1: docker-compose.yml */}
            <div className="flex flex-col bg-black/40 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
              <div className="px-4 py-3 bg-white/5 border-b border-white/5 flex items-center justify-between">
                <span className="text-xs font-bold text-white font-mono">docker-compose.yml</span>
                <button 
                  onClick={() => handleCopyCode(recommendation.dockerComposeBoilerplate, 'docker')}
                  className="text-[10px] font-bold text-gray-400 hover:text-white transition flex items-center gap-1.5 px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded"
                >
                  {copiedFile === 'docker' ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
                  {copiedFile === 'docker' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="p-4 overflow-x-auto text-[10px] text-gray-300 font-mono leading-relaxed h-[350px] scrollbar-thin">
                {recommendation.dockerComposeBoilerplate}
              </pre>
            </div>

            {/* File 2: README.md */}
            <div className="flex flex-col bg-black/40 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
              <div className="px-4 py-3 bg-white/5 border-b border-white/5 flex items-center justify-between">
                <span className="text-xs font-bold text-white font-mono">README.md</span>
                <button 
                  onClick={() => handleCopyCode(recommendation.boilerplateReadme, 'readme')}
                  className="text-[10px] font-bold text-gray-400 hover:text-white transition flex items-center gap-1.5 px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded"
                >
                  {copiedFile === 'readme' ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
                  {copiedFile === 'readme' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="p-4 overflow-x-auto text-[10px] text-gray-300 font-mono leading-relaxed h-[350px] scrollbar-thin">
                {recommendation.boilerplateReadme}
              </pre>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
