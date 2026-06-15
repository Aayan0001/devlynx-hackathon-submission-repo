import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';

type ViewMode = 'landing' | 'dashboard';

interface Preset {
  description: string;
  expectedUsers: string;
  budget: string;
  timeline: string;
}

export default function App() {
  const [view, setView] = useState<ViewMode>('landing');
  const [activePreset, setActivePreset] = useState<Preset | null>(null);

  const handleStartWithPreset = (preset?: Preset) => {
    if (preset) {
      setActivePreset(preset);
    } else {
      setActivePreset(null);
    }
    setView('dashboard');
  };

  return (
    <div className="min-h-screen text-gray-100 bg-[#090a10] selection:bg-indigo-500/30 selection:text-white">
      {view === 'landing' ? (
        <LandingPage onStart={handleStartWithPreset} />
      ) : (
        <Dashboard 
          preset={activePreset} 
          onBack={() => {
            setActivePreset(null);
            setView('landing');
          }} 
        />
      )}
    </div>
  );
}
