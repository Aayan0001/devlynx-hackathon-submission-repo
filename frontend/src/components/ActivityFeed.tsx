import React, { useEffect, useRef } from 'react';
import { Play, CheckCircle2, AlertCircle, Loader2, Terminal, ShieldAlert } from 'lucide-react';
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

  useEffect(() => {
    // Auto scroll terminal to bottom
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const stages = [
    { name: 'Stage 1: Requirements Analysis', done: requirementsCompleted, running: status === 'running' && !requirementsCompleted },
    { name: 'Stage 2: Web Research Agent (Exa AI)', done: researchCompleted, running: requirementsCompleted && !researchCompleted },
    { name: 'Stage 3: Systems Architecture Agent', done: architectureCompleted, running: researchCompleted && !architectureCompleted },
    { name: 'Stage 4: FinOps Cost Analysis Agent', done: costCompleted, running: architectureCompleted && !costCompleted },
    { name: 'Stage 5: Engineering Risk Agent', done: riskCompleted, running: costCompleted && !riskCompleted },
    { name: 'Stage 6: Decision Orchestrator', done: recommendationCompleted, running: riskCompleted && !recommendationCompleted },
  ];

  return (
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-7xl mx-auto py-4">
      
      {/* Stages Progress Panel */}
      <div class="glass-panel p-6 rounded-2xl flex flex-col justify-between h-fit">
        <div>
          <h3 class="font-bold text-white text-lg mb-6 flex items-center gap-2">
            <Loader2 class={`w-5 h-5 text-accent ${status === 'running' ? 'animate-spin' : ''}`} />
            Orchestrator Sequence
          </h3>
          <div class="space-y-5">
            {stages.map((stage, idx) => (
              <div key={idx} class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class={`w-7 h-7 rounded-lg flex items-center justify-center border text-xs font-bold ${
                    stage.done 
                      ? 'bg-success/15 border-success/30 text-success' 
                      : stage.running 
                        ? 'bg-accent/15 border-accent/30 text-accent animate-pulse' 
                        : 'bg-white/5 border-white/10 text-gray-500'
                  }`}>
                    {stage.done ? '✓' : idx + 1}
                  </div>
                  <span class={`text-sm ${
                    stage.done 
                      ? 'text-gray-300' 
                      : stage.running 
                        ? 'text-white font-medium' 
                        : 'text-gray-500'
                  }`}>
                    {stage.name}
                  </span>
                </div>
                <div>
                  {stage.done && <CheckCircle2 class="w-4 h-4 text-success" />}
                  {stage.running && <Loader2 class="w-4 h-4 text-accent animate-spin" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {status === 'failed' && (
          <div class="mt-8 p-4 bg-danger/10 border border-danger/20 rounded-xl flex items-start gap-3">
            <ShieldAlert class="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
            <div>
              <div class="font-bold text-danger text-sm">Execution Interrupted</div>
              <div class="text-xs text-gray-400 mt-1 font-light">The pipeline crashed. Check the console log outputs on the right for troubleshooting details.</div>
            </div>
          </div>
        )}
      </div>

      {/* Live System Console Logs */}
      <div class="lg:col-span-2 flex flex-col h-[400px] bg-black/80 border border-white/10 rounded-2xl overflow-hidden font-mono shadow-2xl">
        {/* Terminal Header */}
        <div class="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between text-xs text-gray-400">
          <div class="flex items-center gap-2">
            <Terminal class="w-4 h-4 text-accent" />
            <span>Developer Console Log Stream</span>
          </div>
          <div class="flex items-center gap-1.5">
            <div class="w-2.5 h-2.5 rounded-full bg-danger/55"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-warning/55"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-success/55"></div>
          </div>
        </div>

        {/* Logs List */}
        <div class="flex-grow p-4 overflow-y-auto text-xs space-y-2.5 terminal-scrollbar select-text">
          {logs.map((log, idx) => {
            let color = 'text-gray-400';
            if (log.message.includes('System Orchestrator')) {
              color = 'text-accent font-semibold';
            } else if (log.message.includes('successfully') || log.message.includes('completed')) {
              color = 'text-success';
            } else if (log.message.includes('ERROR') || log.message.includes('failed')) {
              color = 'text-danger';
            } else if (log.message.includes('[Citation')) {
              color = 'text-gray-500';
            } else if (log.message.includes('Stage')) {
              color = 'text-indigo-300';
            }
            
            return (
              <div key={idx} class="leading-relaxed flex gap-2">
                <span class="text-gray-600 flex-shrink-0 select-none">
                  [{log.timestamp.split('T')[1].substring(0, 8)}]
                </span>
                <span class={color}>
                  {log.message}
                </span>
              </div>
            );
          })}
          <div ref={terminalEndRef} />
        </div>
      </div>
      
    </div>
  );
}
