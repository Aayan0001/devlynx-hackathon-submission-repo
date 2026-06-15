import React, { useState, useEffect } from 'react';
import { 
  Play, Cpu, History, ArrowLeft, Terminal, AlertTriangle, 
  HelpCircle, ChevronRight, FileText, CheckCircle2, Clock 
} from 'lucide-react';
import { Report, LogEntry } from '../types';
import ActivityFeed from './ActivityFeed';
import ResultsView from './ResultsView';

interface Preset {
  description: string;
  expectedUsers: string;
  budget: string;
  timeline: string;
}

interface DashboardProps {
  preset: Preset | null;
  onBack: () => void;
}

export default function Dashboard({ preset, onBack }: DashboardProps) {
  // Input fields
  const [description, setDescription] = useState<string>('');
  const [expectedUsers, setExpectedUsers] = useState<string>('50,000');
  const [budget, setBudget] = useState<string>('$500 / month');
  const [timeline, setTimeline] = useState<string>('3 months');

  // Active Report state
  const [activeReportId, setActiveReportId] = useState<string | null>(null);
  const [activeReport, setActiveReport] = useState<Report | null>(null);
  
  // History lists
  const [reportsHistory, setReportsHistory] = useState<Omit<Report, 'logs'>[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Load history list on mount
  useEffect(() => {
    fetchHistory();
  }, []);

  // Handle auto-triggered preset from landing page
  useEffect(() => {
    if (preset) {
      setDescription(preset.description);
      setExpectedUsers(preset.expectedUsers);
      setBudget(preset.budget);
      setTimeline(preset.timeline);
      triggerAnalysisWithData(preset.description, preset.expectedUsers, preset.budget, preset.timeline);
    }
  }, [preset]);

  // Poll report details if running
  useEffect(() => {
    if (!activeReportId) return;

    let pollInterval: any;

    const pollReport = async () => {
      try {
        const response = await fetch(`/api/report/${activeReportId}`);
        if (!response.ok) throw new Error('Failed to fetch report status');
        
        const data: Report = await response.json();
        setActiveReport(data);

        if (data.status === 'completed' || data.status === 'failed') {
          setIsSubmitting(false);
          fetchHistory(); // Refresh history listing
        } else {
          // Continue polling
          pollInterval = setTimeout(pollReport, 1500);
        }
      } catch (error) {
        console.error('Error polling report:', error);
        setIsSubmitting(false);
      }
    };

    pollReport();

    return () => {
      if (pollInterval) clearTimeout(pollInterval);
    };
  }, [activeReportId]);

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/reports');
      if (response.ok) {
        const data = await response.json();
        setReportsHistory(data);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const triggerAnalysisWithData = async (desc: string, users: string, bud: string, time: string) => {
    setIsSubmitting(true);
    setActiveReport(null);
    setActiveReportId(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: desc.trim(),
          expectedUsers: users,
          budget: bud,
          timeline: time
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to submit analysis');
      }

      const data = await response.json();
      setActiveReportId(data.id);
      
      // Initialize basic report state locally while we wait for poll updates
      setActiveReport({
        id: data.id,
        request: { description: desc, expectedUsers: users, budget: bud, timeline: time },
        status: 'running',
        logs: [{ timestamp: new Date().toISOString(), message: 'Transmitting request packet to backend orchestrator...' }],
        createdAt: new Date().toISOString()
      });

    } catch (error: any) {
      alert(error.message || 'Error occurred during request submission.');
      setIsSubmitting(false);
    }
  };

  const handleStartAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || description.trim().length < 5) return;
    await triggerAnalysisWithData(description, expectedUsers, budget, timeline);
  };

  const handleLoadHistoryItem = async (id: string) => {
    setActiveReportId(id);
    setIsSubmitting(false);
    
    // Set to loading status momentarily
    setActiveReport({
      id: id,
      request: { description: 'Loading...', expectedUsers: '', budget: '', timeline: '' },
      status: 'pending',
      logs: [],
      createdAt: ''
    });
  };

  const fillSample = (desc: string, users: string, b: string, t: string) => {
    setDescription(desc);
    setExpectedUsers(users);
    setBudget(b);
    setTimeline(t);
  };

  return (
    <div className="min-h-screen py-10 px-6 max-w-7xl mx-auto flex flex-col justify-between">
      
      {/* Top Navbar */}
      <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/5 border border-transparent hover:border-white/10 rounded-xl transition text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-extrabold text-lg tracking-wider text-white">
            Decision Console <span className="text-accent">v1.2</span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
          <span>API Gateways: Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-grow">
        
        {/* Left side: Inputs form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="font-bold text-white text-md mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-accent" /> Parameters Input
            </h3>
            
            <form onSubmit={handleStartAnalysis} className="space-y-4">
              
              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-medium">Project Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., Uber clone with real-time GPS coordinate syncing for 100k users..."
                  rows={4}
                  required
                  disabled={isSubmitting}
                  className="w-full bg-black/40 border border-white/10 hover:border-white/20 focus:border-accent text-sm rounded-xl p-3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-accent/50 resize-none font-light leading-relaxed disabled:opacity-50"
                />
              </div>

              {/* Expected Users */}
              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-medium">Expected Users (MAU)</label>
                <select 
                  value={expectedUsers}
                  onChange={(e) => setExpectedUsers(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full bg-black/40 border border-white/10 focus:border-accent text-sm rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-accent/50 font-light disabled:opacity-50"
                >
                  <option value="1,000">1,000 (Small Startup / MVP)</option>
                  <option value="10,000">10,000 (Growing SaaS)</option>
                  <option value="50,000">50,000 (Mid scale Product)</option>
                  <option value="100,000">100,000 (High traffic Web/App)</option>
                  <option value="500,000">500,000 (Enterprise / Global scale)</option>
                </select>
              </div>

              {/* Monthly Budget */}
              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-medium">Target Monthly Budget</label>
                <input 
                  type="text" 
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. $500 / month"
                  disabled={isSubmitting}
                  className="w-full bg-black/40 border border-white/10 focus:border-accent text-sm rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-accent/50 font-light disabled:opacity-50"
                />
              </div>

              {/* Development Timeline */}
              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-medium">Deployment Timeline</label>
                <input 
                  type="text" 
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  placeholder="e.g. 3 months"
                  disabled={isSubmitting}
                  className="w-full bg-black/40 border border-white/10 focus:border-accent text-sm rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-accent/50 font-light disabled:opacity-50"
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting || !description.trim()}
                className="w-full py-3.5 bg-gradient-to-r from-accent to-indigo-600 hover:from-indigo-600 hover:to-accent disabled:from-white/5 disabled:to-white/5 disabled:border-white/5 border border-transparent disabled:text-gray-600 text-white font-semibold rounded-xl text-sm transition-all duration-200 shadow-glow-accent flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                {isSubmitting ? 'Analyzing System...' : 'Generate Analysis'}
              </button>
            </form>
          </div>

          {/* Quick presets helper */}
          <div className="p-5 bg-card/20 border border-white/5 rounded-2xl space-y-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Templates</span>
            <div className="space-y-2 text-xs">
              <button 
                onClick={() => fillSample('Uber clone with real-time GPS coordinate driver passenger matching and routing maps.', '100,000', '$1,000 / month', '4 months')}
                className="w-full text-left p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition block truncate"
              >
                🚗 Ride-Sharing Uber Clone
              </button>
              <button 
                onClick={() => fillSample('AI SaaS application offering automated SEO audit generation, scraping, and RAG search summaries.', '10,000', '$300 / month', '2 months')}
                className="w-full text-left p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition block truncate"
              >
                🤖 AI SaaS & SEO Automation
              </button>
              <button 
                onClick={() => fillSample('High frequency real-time multiplayer card matching lobby web game with persistent rooms.', '50,000', '$200 / month', '3 months')}
                className="w-full text-left p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition block truncate"
              >
                🎮 Realtime Multiplayer Game
              </button>
            </div>
          </div>
        </div>

        {/* Right side: Active Output (Activity logs or Results view) */}
        <div className="lg:col-span-3 space-y-6 flex flex-col justify-between">
          
          {!activeReport ? (
            // Idle State: Welcome display and Past History list
            <div className="flex-grow flex flex-col justify-center items-center p-8 border border-white/5 rounded-3xl bg-card/10 relative overflow-hidden min-h-[450px]">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:32px_32px]"></div>
              
              <div className="z-10 text-center max-w-xl space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto text-accent mb-4 shadow-glow-accent animate-bounce">
                  <Terminal className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">System Architect Console Idle</h3>
                <p className="text-sm text-gray-500 font-light leading-relaxed">
                  Enter a software idea in the parameters panel on the left, click **Generate**, and watch the multi-agent pipeline stream real-world technical options in real-time.
                </p>

                {/* Past analyses history list */}
                {reportsHistory.length > 0 && (
                  <div className="mt-8 text-left max-w-2xl mx-auto w-full border-t border-white/5 pt-6">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <History className="w-4 h-4 text-accent" /> Recent Analyses History
                    </h4>
                    <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-2 terminal-scrollbar">
                      {reportsHistory.map((hReport) => (
                        <div 
                          key={hReport.id}
                          onClick={() => handleLoadHistoryItem(hReport.id)}
                          className="p-3.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-accent/20 rounded-xl cursor-pointer transition flex justify-between items-center"
                        >
                          <div className="min-w-0 pr-4">
                            <span className="text-xs font-bold text-white block truncate">{hReport.request.description}</span>
                            <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1.5 mt-1">
                              <Clock className="w-3 h-3" /> {new Date(hReport.createdAt).toLocaleDateString()} &bull; {hReport.request.expectedUsers} MAU
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              hReport.status === 'completed' 
                                ? 'bg-success/15 border border-success/30 text-success' 
                                : 'bg-white/5 border border-white/10 text-gray-400'
                            }`}>{hReport.status}</span>
                            <ChevronRight className="w-4 h-4 text-gray-500" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Active Run State (logs feed or results page)
            <div className="flex-grow space-y-6">
              
              {/* Header active indicators */}
              <div className="p-5 bg-card/60 border border-white/5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="min-w-0">
                  <span className="text-xs text-gray-500 block truncate">Target Product Description</span>
                  <span className="text-sm font-bold text-white truncate block">{activeReport.request.description}</span>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div>
                    <span className="text-xs text-gray-500 block">Status Code</span>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono border inline-block mt-0.5 uppercase ${
                      activeReport.status === 'completed' 
                        ? 'bg-success/10 border-success/30 text-success' 
                        : activeReport.status === 'failed' 
                          ? 'bg-danger/10 border-danger/30 text-danger' 
                          : 'bg-accent/10 border-accent/30 text-accent animate-pulse'
                    }`}>{activeReport.status}</span>
                  </div>
                  {activeReport.status === 'completed' && (
                    <button 
                      onClick={() => {
                        setActiveReport(null);
                        setActiveReportId(null);
                      }}
                      className="px-4 py-2 border border-white/10 hover:bg-white/5 rounded-xl text-xs font-medium text-gray-400 hover:text-white transition"
                    >
                      New Blueprint
                    </button>
                  )}
                </div>
              </div>

              {activeReport.status === 'running' || activeReport.status === 'pending' || activeReport.status === 'failed' ? (
                // Render live streaming agent activity feed
                <ActivityFeed
                  status={activeReport.status}
                  logs={activeReport.logs}
                  requirementsCompleted={!!activeReport.requirements}
                  researchCompleted={!!activeReport.research}
                  architectureCompleted={!!activeReport.architectures}
                  costCompleted={!!activeReport.cost}
                  riskCompleted={!!activeReport.risks}
                  recommendationCompleted={!!activeReport.recommendation}
                />
              ) : (
                // Render complete comparative cards results view
                <ResultsView report={activeReport} />
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
