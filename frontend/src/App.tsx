import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Workouts } from './features/workouts/Workouts';
import { ProgressTracking } from './features/progress/ProgressTracking';
import { Profile } from './features/profile/Profile';
import { AICoach } from './features/ai-coach/AICoach';
import { Auth } from './features/auth/Auth';
import { Today } from './features/dashboard/Today';
import { useAppContext } from './context/AppContext';
import { Cpu } from 'lucide-react';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('coach');
  const { isAuthenticated, isLoadingAuth } = useAppContext();

  if (isLoadingAuth) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', color: 'var(--accent)' }}>
        <Cpu size={48} className="animate-pulse" />
        <span style={{ fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase' }}>Initializing Forge AI</span>
      </div>
    </div>;
  }

  if (!isAuthenticated) {
    return <Auth />;
  }

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="main-content">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === 'coach' && <AICoach />}
        {activeTab === 'today' && <Today />}
        {activeTab === 'profile' && <Profile />}
        {activeTab === 'workouts' && <Workouts />}
        {activeTab === 'progress' && <ProgressTracking />}
      </main>
    </div>
  );
}

export default App;
