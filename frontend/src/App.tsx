import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';

type ViewMode = 'landing' | 'dashboard';

export default function App() {
  const [view, setView] = useState<ViewMode>('landing');

  return (
    <div class="min-h-screen text-gray-100 bg-[#090a10] selection:bg-indigo-500/30 selection:text-white">
      {view === 'landing' ? (
        <LandingPage onStart={() => setView('dashboard')} />
      ) : (
        <Dashboard onBack={() => setView('landing')} />
      )}
    </div>
  );
}
