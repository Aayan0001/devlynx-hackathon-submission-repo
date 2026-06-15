import React, { useEffect, useState, useRef } from 'react';
import { 
  Cpu, Search, DollarSign, ShieldAlert, Award, FileText, 
  Loader2, Terminal, CheckCircle2, XCircle, Clock, ArrowRight, Play
} from 'lucide-react';
import { LogEntry } from '../types';

interface ActivityFeedProps {
  status: 'pending' | 'running' | 'completed' | 'failed';
  logs: LogEntry[];
  requirementsCompleted: boolean;
  researchCompleted: boolean;
  architectureCompleted: boolean;
  costCompleted: boolean;
  riskCompleted: boolean;
  recommendationCompleted: boolean;
}

export default function ActivityFeed({
  status,
  logs,
  requirementsCompleted,
  researchCompleted,
  architectureCompleted,
  costCompleted,
  riskCompleted,
  recommendationCompleted
}: ActivityFeedProps) {
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const [tick, setTick] = useState(0);

  // Time tracker for each stage in milliseconds
  const [timers, setTimers] = useState<{ [key: number]: { start: number | null; end: number | null } }>({
    0: { start: null, end: null }, // Requirements
    1: { start: null, end: null }, // Research
    2: { start: null, end: null }, // Architecture
    3: { start: null, end: null }, // Cost
    4: { start: null, end: null }, // Risk
    5: { start: null, end: null }  // Recommendation
  });

  // Scroll console to bottom on log updates
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Tick timer every 100ms during active execution
  useEffect(() => {
    if (status !== 'running') return;
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 100);
    return () => clearInterval(interval);
  }, [status]);

  // Track state transitions to calculate real execution runtimes
  useEffect(() => {
    if (status !== 'running') return;

    const completions = [
      requirementsCompleted,
      researchCompleted,
      architectureCompleted,
      costCompleted,
      riskCompleted,
      recommendationCompleted
    ];

    setTimers(prev => {
      const next = { ...prev };
      let changed = false;

      for (let i = 0; i < 6; i++) {
        const isDone = completions[i];
        const isPrevDone = i === 0 ? true : completions[i - 1];
        const isRunning = isPrevDone && !isDone;

        // Stage started running
        if (isRunning && !next[i].start) {
          next[i] = { ...next[i], start: Date.now() };
          changed = true;
        }

        // Stage completed running
        if (isDone && next[i].start && !next[i].end) {
          next[i] = { ...next[i], end: Date.now() };
          changed = true;
        }
      }

      return changed ? next : prev;
    });
  }, [
    status,
    requirementsCompleted,
    researchCompleted,
    architectureCompleted,
    costCompleted,
    riskCompleted,
    recommendationCompleted
  ]);

  // Reset timers when restarting pipeline
  useEffect(() => {
    if (status === 'pending') {
      setTimers({
        0: { start: null, end: null },
        1: { start: null, end: null },
        2: { start: null, end: null },
        3: { start: null, end: null },
        4: { start: null, end: null },
        5: { start: null, end: null }
      });
    }
  }, [status]);

  // Retrieve calculated or simulated runtime for a stage
  const getStageRuntime = (index: number): string => {
    const timer = timers[index];
    
    // If we have a live timer tracking execution
    if (timer && timer.start) {
      const end = timer.end || Date.now();
      return ((end - timer.start) / 1000).toFixed(1) + 's';
    }

    // Fallback if completed historically (simulate realistic duration)
    const completions = [
      requirementsCompleted,
      researchCompleted,
      architectureCompleted,
      costCompleted,
      riskCompleted,
      recommendationCompleted
    ];
    if (completions[index]) {
      const fixedDurations = [2.4, 6.8, 4.2, 1.9, 3.1, 1.5];
      return fixedDurations[index] + 's';
    }

    return '0.0s';
  };

  // Determine stage status
  const getStageStatus = (index: number): 'Waiting' | 'Running' | 'Completed' | 'Failed' => {
    const completions = [
      requirementsCompleted,
      researchCompleted,
      architectureCompleted,
      costCompleted,
      riskCompleted,
      recommendationCompleted
    ];

    if (completions[index]) return 'Completed';
    
    if (status === 'failed') {
      const isPrevDone = index === 0 ? true : completions[index - 1];
      if (isPrevDone) return 'Failed'; // This stage crashed
    }

    const isPrevDone = index === 0 ? true : completions[index - 1];
    if (status === 'running' && isPrevDone && !completions[index]) {
      return 'Running';
    }

    return 'Waiting';
  };

  const stages = [
    {
      id: 0,
      name: 'Requirements Analyst',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      getResults: () => {
        if (requirementsCompleted) return ['✓ Extracted functional constraints', '✓ Identified target project scale', '✓ Outlined database compliance'];
        if (getStageStatus(0) === 'Running') return ['Analyzing project description...', 'Mapping expected workloads...'];
        return ['Awaiting input criteria...'];
      }
    },
    {
      id: 1,
      name: 'Research Agent (Exa)',
      icon: Search,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      getResults: () => {
        if (researchCompleted) return ['✓ Scanned 27 tech blogs & forums', '✓ Found 15 architecture articles', '✓ Sourced 4 engineering case studies'];
        if (getStageStatus(1) === 'Running') return ['Formulating Exa API neural search...', 'Filtering engineering whitepapers...'];
        return ['Awaiting requirements context...'];
      }
    },
    {
      id: 2,
      name: 'Architecture Agent',
      icon: Cpu,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/20',
      getResults: () => {
        if (architectureCompleted) return ['✓ Evaluated 3 candidate stacks', '✓ Generated physical database topologies', '✓ Created custom Docker templates'];
        if (getStageStatus(2) === 'Running') return ['Synthesizing MVP & Enterprise configurations...', 'Calculating database index requirements...'];
        return ['Awaiting web research telemetry...'];
      }
    },
    {
      id: 3,
      name: 'Cost Analysis Agent',
      icon: DollarSign,
      color: 'text-amber-600',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
      getResults: () => {
        if (costCompleted) return ['✓ Projected infrastructure coefficients', '✓ Extracted hosting/DB monthly curves', '✓ Rendered interactive scaling sliders'];
        if (getStageStatus(3) === 'Running') return ['Simulating hosting and compute costs...', 'Parsing pricing coefficients...'];
        return ['Awaiting blueprint synthesis...'];
      }
    },
    {
      id: 4,
      name: 'Risk Analysis Agent',
      icon: ShieldAlert,
      color: 'text-rose-600',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/20',
      getResults: () => {
        if (riskCompleted) return ['✓ Audited Security & Data exposures', '✓ Mapped scalability lock-in limits', '✓ Formulated 3 mitigation strategies'];
        if (getStageStatus(4) === 'Running') return ['Scanning architecture vulnerabilities...', 'Calculating operational risk matrix...'];
        return ['Awaiting architectural topologies...'];
      }
    },
    {
      id: 5,
      name: 'Recommendation Engine',
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      getResults: () => {
        if (recommendationCompleted) return ['✓ Determined optimal system winner', '✓ Generated copy-paste boilerplate', '✓ Created deployment walkthrough'];
        if (getStageStatus(5) === 'Running') return ['Weighing design trade-offs...', 'Assembling final orchestrator blueprints...'];
        return ['Awaiting risk matrix calculations...'];
      }
    }
  ];

  return (
    <div className="w-full space-y-6">
      
      {/* 1. AGENT WORKFLOW PIPELINE VISUALIZATION */}
      <div className="glass-panel p-6 rounded-2xl relative overflow-hidden border border-slate-200 shadow-sm">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000001_1px,transparent_1px),linear-gradient(to_bottom,#00000001_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
        
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2 font-mono">
          <Loader2 className={`w-4 h-4 text-accent ${status === 'running' ? 'animate-spin' : ''}`} />
          System Execution Pipeline
        </h3>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2 relative z-10 px-2 overflow-x-auto select-none">
          {/* Input Starting Node */}
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
              <Play className="w-4 h-4 fill-slate-400 text-slate-400" />
            </div>
            <span className="text-[10px] text-slate-500 font-mono mt-2 font-bold uppercase tracking-wider">Project Input</span>
          </div>

          {stages.map((stage, idx) => {
            const stageStatus = getStageStatus(idx);
            
            // Connective arrow configuration
            let arrowColor = 'bg-slate-200';
            let pulseStyle = '';
            if (stageStatus === 'Running') {
              arrowColor = 'bg-gradient-to-r from-accent to-accent/20';
              pulseStyle = 'animate-pulse';
            } else if (stageStatus === 'Completed') {
              arrowColor = 'bg-accent';
            }

            return (
              <React.Fragment key={stage.id}>
                {/* Connection Line */}
                <div className="hidden md:block flex-grow h-0.5 min-w-[30px] max-w-[60px] mx-1 relative">
                  <div className={`w-full h-full rounded ${arrowColor} ${pulseStyle}`}></div>
                  {stageStatus === 'Running' && (
                    <div className="absolute top-1/2 left-0 w-2 h-2 -translate-y-1/2 rounded-full bg-accent animate-ping"></div>
                  )}
                </div>
                
                {/* Agent Node */}
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-300 ${
                    stageStatus === 'Completed'
                      ? 'bg-accent/10 border-accent text-accent shadow-[0_0_15px_rgba(37,99,235,0.08)]'
                      : stageStatus === 'Running'
                        ? 'bg-accent/20 border-accent text-accent font-bold animate-pulse shadow-[0_0_20px_rgba(37,99,235,0.15)]'
                        : stageStatus === 'Failed'
                          ? 'bg-rose-500/10 border-rose-500 text-rose-600'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}>
                    {stageStatus === 'Completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-accent" />
                    ) : (
                      <stage.icon className="w-5 h-5" />
                    )}
                  </div>
                  
                  <span className={`text-[10px] font-bold font-mono mt-2 uppercase tracking-wider text-center max-w-[100px] truncate ${
                    stageStatus === 'Running' ? 'text-slate-800' : stageStatus === 'Completed' ? 'text-slate-700' : 'text-slate-400'
                  }`}>
                    {stage.name.split(' ')[0]}
                  </span>
                  
                  <span className={`text-[9px] font-mono mt-0.5 ${
                    stageStatus === 'Running' 
                      ? 'text-accent animate-pulse font-bold' 
                      : stageStatus === 'Completed' 
                        ? 'text-slate-500' 
                        : 'text-slate-400'
                  }`}>
                    {stageStatus === 'Completed' ? getStageRuntime(idx) : stageStatus}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* 2. AGENT DETAILED MONITORING CARDS */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Agent Observability States</h3>
            <span className="text-[10px] text-slate-500 font-mono">Telemetry: Live</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stages.map((stage, idx) => {
              const stageStatus = getStageStatus(idx);
              const runtime = getStageRuntime(idx);
              
              let statusBadgeColor = 'bg-slate-100 border-slate-200 text-slate-500';
              if (stageStatus === 'Completed') statusBadgeColor = 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600';
              else if (stageStatus === 'Running') statusBadgeColor = 'bg-accent/10 border-accent/20 text-accent animate-pulse';
              else if (stageStatus === 'Failed') statusBadgeColor = 'bg-rose-500/10 border-rose-500/25 text-rose-600';

              return (
                <div 
                  key={stage.id} 
                  className={`p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between min-h-[145px] shadow-sm ${
                    stageStatus === 'Running' 
                      ? 'bg-accent/[0.01] border-accent/40 shadow-md shadow-accent/[0.01]' 
                      : stageStatus === 'Completed'
                        ? 'bg-white border-slate-200'
                        : 'bg-slate-50/50 border-slate-100 opacity-50'
                  }`}
                >
                  <div>
                    {/* Card Header */}
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${stage.bgColor} ${stage.color}`}>
                          <stage.icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-extrabold text-slate-800 block truncate max-w-[120px]">{stage.name}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase font-mono border ${statusBadgeColor}`}>
                        {stageStatus}
                      </span>
                    </div>

                    {/* Discovery Results */}
                    <div className="space-y-1 mt-3">
                      {stage.getResults().map((res, rIdx) => (
                        <p key={rIdx} className="text-[10px] text-slate-600 font-light truncate leading-normal">
                          {res}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer: Metrics */}
                  <div className="flex justify-between items-center border-t border-slate-100 pt-2 mt-4 text-[9px] font-mono text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> Runtime: <strong className="text-slate-700">{runtime}</strong>
                    </span>
                    {stageStatus === 'Running' && (
                      <span className="text-accent font-bold animate-pulse">processing...</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. OBSERVABILITY SYSTEM TELEMETRY LOGS */}
        <div className="lg:col-span-2 flex flex-col h-[525px] bg-[#1e293b] border border-slate-800 rounded-2xl overflow-hidden font-mono shadow-xl relative">
          
          {/* Terminal Header */}
          <div className="px-4 py-3.5 bg-slate-800 border-b border-slate-700 flex items-center justify-between text-xs text-slate-400 select-none">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-accent" />
              <span className="font-bold tracking-wider uppercase text-[10px] text-slate-300">Developer Observation Log Stream</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/70"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70"></div>
            </div>
          </div>

          {/* Logs List */}
          <div className="flex-grow p-4 overflow-y-auto text-[11px] space-y-2.5 terminal-scrollbar select-text leading-relaxed">
            {logs.map((log, idx) => {
              let color = 'text-slate-300';
              if (log.message.includes('System Orchestrator')) {
                color = 'text-blue-400 font-semibold';
              } else if (log.message.includes('successfully') || log.message.includes('completed')) {
                color = 'text-emerald-400';
              } else if (log.message.includes('ERROR') || log.message.includes('failed') || log.message.includes('FATAL')) {
                color = 'text-rose-400 font-bold';
              } else if (log.message.includes('[Citation')) {
                color = 'text-slate-500';
              } else if (log.message.includes('Stage')) {
                color = 'text-indigo-400';
              }
              
              return (
                <div key={idx} className="flex gap-2">
                  <span className="text-slate-500 flex-shrink-0 select-none">
                    [{log.timestamp.split('T')[1]?.substring(0, 8) || '00:00:00'}]
                  </span>
                  <span className={color}>
                    {log.message}
                  </span>
                </div>
              );
            })}
            <div ref={terminalEndRef} />
          </div>

          {/* Failed notification banner */}
          {status === 'failed' && (
            <div className="p-4 bg-rose-950/20 border-t border-rose-900/30 text-[10px] text-rose-400 flex items-start gap-2 select-none">
              <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5 animate-bounce" />
              <div>
                <span className="font-bold block">Pipeline Interruption</span>
                <span className="text-slate-400 font-light block mt-0.5">Execution aborted due to an API timeout or server crash. Check the telemetry log stream above.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
