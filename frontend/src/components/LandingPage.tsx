import React from 'react';
import { Cpu, Search, DollarSign, ShieldAlert, FileText, ArrowRight, Zap, Code, Award } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div class="min-h-screen relative overflow-hidden flex flex-col justify-between">
      
      {/* Header */}
      <header class="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-10">
        <div class="flex items-center gap-3">
          <div class="p-2.5 bg-gradient-to-tr from-accent to-[#818cf8] rounded-xl shadow-glow-accent">
            <Cpu class="w-6 h-6 text-white" />
          </div>
          <span class="font-extrabold text-2xl tracking-wider bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            TECHSTACK <span class="text-accent font-black">AI</span>
          </span>
        </div>
        <button 
          onClick={onStart}
          class="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition duration-200 font-medium text-sm text-gray-200 flex items-center gap-2"
        >
          Developer Console <ArrowRight class="w-4 h-4" />
        </button>
      </header>

      {/* Hero Section */}
      <main class="flex-grow flex flex-col items-center justify-center text-center px-6 max-w-5xl mx-auto py-12 z-10">
        
        {/* Badge */}
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
          <Zap class="w-3.5 h-3.5" /> Next-Generation Architectural Copilot
        </div>

        {/* Headline */}
        <h1 class="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
          Architect Systems <br class="hidden sm:inline" />
          With <span class="bg-gradient-to-r from-accent via-indigo-400 to-emerald-400 bg-clip-text text-transparent">Agentic Intelligence</span>
        </h1>

        {/* Subhead */}
        <p class="text-lg sm:text-xl text-gray-400 max-w-3xl mb-10 leading-relaxed font-light">
          Stop guessing your system architecture. TechStack AI orchestrates 6 specialized autonomous agents to research engineering case studies, compare structural topologies, project costs, evaluate security risks, and export launch-ready Docker setups.
        </p>

        {/* CTA Button */}
        <div class="flex flex-col sm:flex-row gap-4 mb-20">
          <button 
            onClick={onStart}
            class="px-8 py-4 bg-gradient-to-r from-accent to-indigo-600 hover:from-indigo-600 hover:to-accent text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.03] shadow-glow-accent flex items-center justify-center gap-3"
          >
            Launch Decision Copilot <ArrowRight class="w-5 h-5" />
          </button>
        </div>

        {/* Feature Grid */}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
          <div class="glass-panel glass-panel-hover p-6 rounded-2xl text-left">
            <div class="w-10 h-10 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-center text-accent mb-4">
              <Cpu class="w-5 h-5" />
            </div>
            <h3 class="font-bold text-white text-lg mb-2">6-Stage Agent Pipeline</h3>
            <p class="text-sm text-gray-400 font-light leading-relaxed">
              Sequentially analyzes requirements, searches the web, weighs blueprints, estimates scales, checks risks, and advises solutions.
            </p>
          </div>

          <div class="glass-panel glass-panel-hover p-6 rounded-2xl text-left">
            <div class="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 mb-4">
              <Search class="w-5 h-5" />
            </div>
            <h3 class="font-bold text-white text-lg mb-2">Sourced Exa AI Research</h3>
            <p class="text-sm text-gray-400 font-light leading-relaxed">
              Bypasses generic LLM knowledge by performing real-time semantic lookups on top engineering publications and company stacks.
            </p>
          </div>

          <div class="glass-panel glass-panel-hover p-6 rounded-2xl text-left">
            <div class="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-400 mb-4">
              <DollarSign class="w-5 h-5" />
            </div>
            <h3 class="font-bold text-white text-lg mb-2">Interactive Scaling Playgrounds</h3>
            <p class="text-sm text-gray-400 font-light leading-relaxed">
              Compare 3 architectures side-by-side. Calculate exact infrastructure cost breakdowns dynamically via mathematical traffic sliders.
            </p>
          </div>
        </div>

        {/* Demo Stacks Section */}
        <div class="mt-24 w-full">
          <h2 class="text-2xl font-bold text-white mb-10 flex items-center justify-center gap-3">
            <Award class="w-6 h-6 text-accent" /> Try Common Architectures
          </h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="p-5 rounded-2xl glass-card text-center cursor-pointer border border-white/5 hover:border-accent/30 transition duration-200" onClick={onStart}>
              <Code class="w-6 h-6 text-accent mx-auto mb-2" />
              <div class="font-bold text-white text-sm">Ride-Sharing App</div>
              <div class="text-xs text-gray-500 mt-1">Real-time GPS</div>
            </div>
            <div class="p-5 rounded-2xl glass-card text-center cursor-pointer border border-white/5 hover:border-accent/30 transition duration-200" onClick={onStart}>
              <Cpu class="w-6 h-6 text-indigo-400 mx-auto mb-2" />
              <div class="font-bold text-white text-sm">AI SaaS Agent</div>
              <div class="text-xs text-gray-500 mt-1">Vector DB + LLM</div>
            </div>
            <div class="p-5 rounded-2xl glass-card text-center cursor-pointer border border-white/5 hover:border-accent/30 transition duration-200" onClick={onStart}>
              <Zap class="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <div class="font-bold text-white text-sm">Multiplayer Game</div>
              <div class="text-xs text-gray-500 mt-1">Socket Sync</div>
            </div>
            <div class="p-5 rounded-2xl glass-card text-center cursor-pointer border border-white/5 hover:border-accent/30 transition duration-200" onClick={onStart}>
              <DollarSign class="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <div class="font-bold text-white text-sm">Marketplace Platform</div>
              <div class="text-xs text-gray-500 mt-1">ACID Relational</div>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer class="w-full py-8 text-center text-xs text-gray-600 border-t border-white/5 z-10 bg-[#07080c]">
        TechStack AI &copy; 2026. Made for engineers, startup founders, and architectural decision compliance.
      </footer>

      {/* Background glow animations */}
      <div class="absolute top-[20%] left-[10%] w-[350px] h-[350px] rounded-full bg-accent/10 filter blur-[80px] -z-10 animate-pulse"></div>
      <div class="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-emerald-500/5 filter blur-[100px] -z-10"></div>
    </div>
  );
}
