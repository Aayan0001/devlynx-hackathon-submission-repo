import React, { useState } from 'react';
import { 
  Award, ShieldAlert, DollarSign, Database, Copy, Check, Download, 
  ExternalLink, Layers, GitFork, RefreshCw, Cpu, Activity 
} from 'lucide-react';
import { Report, ArchitectureOption, Risk, Citation } from '../types';

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
    <div class="space-y-12 w-full max-w-7xl mx-auto py-6">
      
      {/* 1. Executive Summary / Final Recommendation */}
      {recommendation && (
        <div class="relative p-6 sm:p-8 rounded-3xl overflow-hidden glass-panel border border-accent/30 shadow-glow-accent">
          <div class="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-accent/5 filter blur-[60px] -z-10"></div>
          
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
            <div>
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-3">
                <Award class="w-3.5 h-3.5" /> Recommended Decision
              </div>
              <h2 class="text-2xl sm:text-3xl font-extrabold text-white">
                Winner: {recommendation.chosenArchitectureName}
              </h2>
            </div>
            
            <button 
              onClick={handleDownloadFiles}
              class="px-5 py-3 bg-gradient-to-r from-accent to-indigo-600 hover:from-indigo-600 hover:to-accent text-white font-semibold rounded-xl text-sm transition-all duration-200 shadow-lg flex items-center gap-2"
            >
              <Download class="w-4 h-4" /> Download Tech Stack Boilerplate
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-4">
              <div>
                <h4 class="text-xs font-bold text-accent uppercase tracking-wider mb-1">Decision Rationale</h4>
                <p class="text-gray-300 text-sm leading-relaxed font-light">{recommendation.rationale}</p>
              </div>
              <div>
                <h4 class="text-xs font-bold text-accent uppercase tracking-wider mb-1">Architectural Trade-offs</h4>
                <p class="text-gray-300 text-sm leading-relaxed font-light">{recommendation.tradeoffs}</p>
              </div>
            </div>
            
            <div class="p-5 bg-black/30 border border-white/5 rounded-2xl">
              <h4 class="text-xs font-bold text-success uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Activity class="w-4 h-4" /> Future Scaling Roadmap
              </h4>
              <div class="space-y-3">
                {recommendation.scalingPath.split('Phase').filter(p => p.trim()).map((phase, idx) => (
                  <div key={idx} class="flex gap-3 text-sm">
                    <div class="w-5 h-5 rounded-full bg-success/15 border border-success/30 text-success text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p class="text-gray-400 font-light leading-relaxed">
                      <span class="text-gray-300 font-medium">Phase {phase.trim().substring(0, 1)}:</span> 
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
        <h2 class="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Layers class="w-5 h-5 text-accent" /> Compare Architecture Stacks
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          {architectures.map((arch) => (
            <div 
              key={arch.id} 
              onClick={() => setSelectedArchId(arch.id)}
              class={`cursor-pointer p-6 rounded-2xl border transition-all duration-300 ${
                selectedArchId === arch.id 
                  ? 'bg-card border-accent shadow-glow-accent ring-1 ring-accent/30' 
                  : 'bg-card/40 border-white/5 hover:border-white/10'
              }`}
            >
              <div class="flex justify-between items-start mb-4">
                <h3 class="font-bold text-white text-md tracking-tight leading-tight">{arch.name}</h3>
                <input 
                  type="radio" 
                  name="selectedArch" 
                  checked={selectedArchId === arch.id} 
                  onChange={() => setSelectedArchId(arch.id)}
                  class="text-accent focus:ring-accent"
                />
              </div>
              
              <div class="space-y-3 text-xs mb-6">
                <div><span class="text-gray-500">Frontend:</span> <span class="text-gray-300">{arch.frontend.split('(')[0]}</span></div>
                <div><span class="text-gray-500">Backend:</span> <span class="text-gray-300">{arch.backend.split('(')[0]}</span></div>
                <div><span class="text-gray-500">Database:</span> <span class="text-gray-300">{arch.database.split('(')[0]}</span></div>
                <div><span class="text-gray-500">Hosting:</span> <span class="text-gray-300">{arch.hosting.split('(')[0]}</span></div>
              </div>

              {/* Progress Bar Metrics */}
              <div class="space-y-2.5 border-t border-white/5 pt-4">
                <div class="flex justify-between items-center text-[10px] text-gray-500">
                  <span>Scalability</span>
                  <span class="text-gray-300 font-bold">{arch.scalabilityMetric}/10</span>
                </div>
                <div class="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div class="bg-accent h-full" style={{ width: `${arch.scalabilityMetric * 10}%` }}></div>
                </div>

                <div class="flex justify-between items-center text-[10px] text-gray-500">
                  <span>Budget Friendliness</span>
                  <span class="text-gray-300 font-bold">{arch.budgetFriendlinessMetric}/10</span>
                </div>
                <div class="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div class="bg-emerald-500 h-full" style={{ width: `${arch.budgetFriendlinessMetric * 10}%` }}></div>
                </div>

                <div class="flex justify-between items-center text-[10px] text-gray-500">
                  <span>Time-to-Market</span>
                  <span class="text-gray-300 font-bold">{arch.timeToMarketMetric}/10</span>
                </div>
                <div class="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div class="bg-amber-500 h-full" style={{ width: `${arch.timeToMarketMetric * 10}%` }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Interactive Architectural Node Diagram (CSS/SVG) */}
      <div>
        <h2 class="text-xl sm:text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <GitFork class="w-5 h-5 text-accent" /> System Topology Diagram
        </h2>
        <p class="text-xs text-gray-500 mb-6">Interactive schema detailing requests and component flow for the selected stack.</p>
        
        <div class="p-8 bg-[#0c0d15] border border-white/5 rounded-3xl relative flex flex-col items-center justify-center overflow-x-auto min-h-[300px]">
          
          <div class="flex items-center gap-4 sm:gap-12 min-w-[650px] justify-center relative">
            
            {/* Frontend Block */}
            <div class="flex flex-col items-center w-36 text-center z-10">
              <div class="p-4 bg-accent/15 border border-accent/40 rounded-2xl w-full flex flex-col items-center gap-2 shadow-glow-accent">
                <Cpu class="w-6 h-6 text-accent" />
                <span class="text-xs font-bold text-white">Client / UI</span>
                <span class="text-[10px] text-gray-400 font-light truncate w-full">{activeArch.frontend ? activeArch.frontend.split(' ')[0] : 'React'}</span>
              </div>
            </div>

            {/* Arrow 1 */}
            <div class="flex flex-col items-center w-12 text-gray-600">
              <span class="text-[9px] text-gray-500 mb-1">HTTP/WS</span>
              <div class="w-full h-0.5 bg-gradient-to-r from-accent to-indigo-500 relative">
                <div class="absolute right-0 -top-1 w-2 h-2 border-t-2 border-r-2 border-indigo-500 transform rotate-45"></div>
              </div>
            </div>

            {/* Backend Server Block */}
            <div class="flex flex-col items-center w-40 text-center z-10">
              <div class="p-4 bg-indigo-500/10 border border-indigo-500/35 rounded-2xl w-full flex flex-col items-center gap-2">
                <Layers class="w-6 h-6 text-indigo-400" />
                <span class="text-xs font-bold text-white">Application API</span>
                <span class="text-[10px] text-gray-400 font-light truncate w-full">{activeArch.backend ? activeArch.backend.split(' ')[0] : 'Express'}</span>
              </div>
            </div>

            {/* Split Arrows */}
            <div class="flex flex-col items-center justify-center w-12 text-gray-600 relative h-32">
              {/* Database arrow (downwards/slant) */}
              <div class="absolute w-12 h-[2px] bg-gradient-to-r from-indigo-500 to-emerald-500 top-8 transform rotate-[30deg]"></div>
              {/* Cache arrow (horizontal) */}
              <div class="absolute w-12 h-[2px] bg-gradient-to-r from-indigo-500 to-amber-500 top-16"></div>
              {/* AI integration arrow (upwards/slant) */}
              <div class="absolute w-12 h-[2px] bg-gradient-to-r from-indigo-500 to-cyan-500 top-24 transform -rotate-[30deg]"></div>
            </div>

            {/* Data, Caching & AI Service Blocks */}
            <div class="flex flex-col gap-4 w-44 z-10">
              {/* AI Block */}
              <div class="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex items-center gap-2.5">
                <Cpu class="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <div class="text-left leading-tight min-w-0">
                  <div class="text-[10px] font-bold text-white">AI Services</div>
                  <div class="text-[9px] text-gray-400 font-light truncate w-full">{activeArch.aiIntegrations ? activeArch.aiIntegrations.split(' ')[0] : 'Gemini API'}</div>
                </div>
              </div>

              {/* Cache Block */}
              <div class="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center gap-2.5">
                <RefreshCw class="w-4 h-4 text-amber-400 flex-shrink-0" />
                <div class="text-left leading-tight min-w-0">
                  <div class="text-[10px] font-bold text-white">Cache Layer</div>
                  <div class="text-[9px] text-gray-400 font-light truncate w-full">{activeArch.caching ? activeArch.caching.split(' ')[0] : 'Redis'}</div>
                </div>
              </div>

              {/* DB Block */}
              <div class="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2.5">
                <Database class="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <div class="text-left leading-tight min-w-0">
                  <div class="text-[10px] font-bold text-white">Primary DB</div>
                  <div class="text-[9px] text-gray-400 font-light truncate w-full">{activeArch.database ? activeArch.database.split(' ')[0] : 'PostgreSQL'}</div>
                </div>
              </div>
            </div>

          </div>

          {/* Grid background for aesthetics */}
          <div class="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10 grid-glow"></div>
        </div>
      </div>

      {/* 4. Dynamic Scaling & Cost Simulator Slider */}
      {cost && (
        <div class="p-6 sm:p-8 bg-[#121420] border border-white/5 rounded-3xl">
          <div class="flex justify-between items-center mb-6">
            <div>
              <h2 class="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <DollarSign class="w-5 h-5 text-success animate-bounce" /> Traffic & Cost Simulator
              </h2>
              <p class="text-xs text-gray-500 mt-1">Simulate monthly running costs in real-time as users scale.</p>
            </div>
            
            <div class="text-right">
              <span class="text-xs text-gray-500 uppercase tracking-wider block">Estimated Total Cost</span>
              <span class="text-3xl font-extrabold text-success cyber-glow-green">${simTotal.toLocaleString()} <span class="text-xs font-normal text-gray-400">/ mo</span></span>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div class="lg:col-span-2 space-y-6">
              
              {/* User Slider */}
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <label class="text-gray-300 font-semibold">Monthly Active Users (MAU)</label>
                  <span class="text-accent font-bold font-mono">{simUsers.toLocaleString()} Users</span>
                </div>
                <input 
                  type="range" 
                  min="1000" 
                  max="500000" 
                  step="5000" 
                  value={simUsers} 
                  onChange={(e) => setSimUsers(parseInt(e.target.value))}
                  class="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer accent-accent"
                />
                <div class="flex justify-between text-[10px] text-gray-500 font-mono">
                  <span>1k users</span>
                  <span>100k users</span>
                  <span>250k users</span>
                  <span>500k users</span>
                </div>
              </div>

              {/* DB Read/Write volume multiplier */}
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <label class="text-gray-300 font-semibold">Database Load Intensity</label>
                  <span class="text-emerald-400 font-bold font-mono">
                    {readWriteMultiplier === 0.5 ? 'Light Writes' : readWriteMultiplier === 1.0 ? 'Normal Reads/Writes' : 'Heavy Concurrent Writes (x1.5)'}
                  </span>
                </div>
                <div class="grid grid-cols-3 gap-3">
                  <button 
                    onClick={() => setReadWriteMultiplier(0.5)}
                    class={`px-4 py-2 text-xs font-medium rounded-xl border transition ${readWriteMultiplier === 0.5 ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-white/5 border-white/5 hover:border-white/10 text-gray-400'}`}
                  >
                    Low Write
                  </button>
                  <button 
                    onClick={() => setReadWriteMultiplier(1.0)}
                    class={`px-4 py-2 text-xs font-medium rounded-xl border transition ${readWriteMultiplier === 1.0 ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-white/5 border-white/5 hover:border-white/10 text-gray-400'}`}
                  >
                    Balanced
                  </button>
                  <button 
                    onClick={() => setReadWriteMultiplier(1.5)}
                    class={`px-4 py-2 text-xs font-medium rounded-xl border transition ${readWriteMultiplier === 1.5 ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-white/5 border-white/5 hover:border-white/10 text-gray-400'}`}
                  >
                    Heavy IO
                  </button>
                </div>
              </div>
            </div>

            {/* Price breakdown bar matrix */}
            <div class="p-6 bg-black/40 border border-white/5 rounded-2xl space-y-4">
              <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/5 pb-2">Line-Item Estimations</h4>
              
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-400 font-light">Hosting Compute Cost</span>
                <span class="text-white font-mono font-bold">${simHosting.toLocaleString()}</span>
              </div>
              <div class="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div class="bg-accent h-full" style={{ width: `${(simHosting / simTotal) * 100}%` }}></div>
              </div>

              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-400 font-light">Database Storage / I/O</span>
                <span class="text-white font-mono font-bold">${simDatabase.toLocaleString()}</span>
              </div>
              <div class="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div class="bg-emerald-500 h-full" style={{ width: `${(simDatabase / simTotal) * 100}%` }}></div>
              </div>

              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-400 font-light">AI Model API Usage</span>
                <span class="text-white font-mono font-bold">${simAI.toLocaleString()}</span>
              </div>
              <div class="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div class="bg-cyan-500 h-full" style={{ width: `${(simAI / simTotal) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Engineering Risk Matrix */}
      {risks.length > 0 && (
        <div>
          <h2 class="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <ShieldAlert class="w-5 h-5 text-accent" /> Security & Architecture Risk Matrix
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {risks.map((risk, idx) => (
              <div key={idx} class="p-6 rounded-2xl bg-card border border-white/5 flex gap-4">
                <div class={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  risk.severity === 'High' 
                    ? 'bg-danger/10 text-danger border border-danger/25' 
                    : risk.severity === 'Medium' 
                      ? 'bg-warning/10 text-warning border border-warning/25' 
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                }`}>
                  <ShieldAlert class="w-5 h-5" />
                </div>
                
                <div class="space-y-2 min-w-0">
                  <div class="flex items-center gap-2.5">
                    <h3 class="font-bold text-white text-sm truncate">{risk.name}</h3>
                    <span class={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      risk.severity === 'High' 
                        ? 'bg-danger/10 text-danger border border-danger/20' 
                        : risk.severity === 'Medium' 
                          ? 'bg-warning/10 text-warning border border-warning/20' 
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>{risk.severity}</span>
                  </div>
                  <p class="text-xs text-gray-400 font-light leading-relaxed">{risk.description}</p>
                  <div class="text-xs p-3 bg-black/30 border border-white/5 rounded-xl mt-2">
                    <span class="text-success font-semibold block text-[10px] uppercase tracking-wider mb-1">Mitigation Strategy</span>
                    <p class="text-gray-300 font-light">{risk.mitigation}</p>
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
          <h2 class="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <ExternalLink class="w-5 h-5 text-accent" /> Verified Sourced References (Exa AI)
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            {research.citations.map((cite, idx) => (
              <a 
                key={idx} 
                href={cite.url} 
                target="_blank" 
                rel="noopener noreferrer"
                class="glass-panel glass-panel-hover p-6 rounded-2xl block text-left space-y-3"
              >
                <div class="flex items-start justify-between gap-3">
                  <h4 class="font-bold text-white text-xs leading-snug line-clamp-2">{cite.title}</h4>
                  <ExternalLink class="w-3.5 h-3.5 text-accent flex-shrink-0 mt-0.5" />
                </div>
                {cite.snippet && <p class="text-[11px] text-gray-500 line-clamp-3 leading-relaxed font-light">{cite.snippet}</p>}
                <div class="text-[9px] text-accent font-semibold truncate font-mono">{new URL(cite.url).hostname}</div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* 7. Boilerplate Code Viewer */}
      {recommendation && (
        <div>
          <h2 class="text-xl sm:text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Layers class="w-5 h-5 text-accent" /> Generated System Boilerplates
          </h2>
          <p class="text-xs text-gray-500 mb-6">Instantly export these files to spin up your dockerized stack or deploy to production.</p>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* File 1: docker-compose.yml */}
            <div class="flex flex-col bg-black/40 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
              <div class="px-4 py-3 bg-white/5 border-b border-white/5 flex items-center justify-between">
                <span class="text-xs font-bold text-white font-mono">docker-compose.yml</span>
                <button 
                  onClick={() => handleCopyCode(recommendation.dockerComposeBoilerplate, 'docker')}
                  class="text-[10px] font-bold text-gray-400 hover:text-white transition flex items-center gap-1.5 px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded"
                >
                  {copiedFile === 'docker' ? <Check class="w-3 h-3 text-success" /> : <Copy class="w-3 h-3" />}
                  {copiedFile === 'docker' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre class="p-4 overflow-x-auto text-[10px] text-gray-300 font-mono leading-relaxed h-[350px] scrollbar-thin">
                {recommendation.dockerComposeBoilerplate}
              </pre>
            </div>

            {/* File 2: README.md */}
            <div class="flex flex-col bg-black/40 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
              <div class="px-4 py-3 bg-white/5 border-b border-white/5 flex items-center justify-between">
                <span class="text-xs font-bold text-white font-mono">README.md</span>
                <button 
                  onClick={() => handleCopyCode(recommendation.boilerplateReadme, 'readme')}
                  class="text-[10px] font-bold text-gray-400 hover:text-white transition flex items-center gap-1.5 px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded"
                >
                  {copiedFile === 'readme' ? <Check class="w-3 h-3 text-success" /> : <Copy class="w-3 h-3" />}
                  {copiedFile === 'readme' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre class="p-4 overflow-x-auto text-[10px] text-gray-300 font-mono leading-relaxed h-[350px] scrollbar-thin">
                {recommendation.boilerplateReadme}
              </pre>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
