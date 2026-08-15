import { useState } from 'react';
import './index.css';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Profile } from './features/profile/Profile';
import { Workouts } from './features/workouts/Workouts';
import { ProgressTracking } from './features/progress/ProgressTracking';
import { AICoach } from './features/ai-coach/AICoach';
import { Nutrition } from './features/nutrition/Nutrition';
import { Settings } from './features/settings/Settings';
import { Auth } from './features/auth/Auth';
import { useAppContext } from './context/AppContext';
import { Loader2 } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('profile');
  const { isAuthenticated, isLoadingAuth } = useAppContext();

  if (isLoadingAuth) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
        <Loader2 className="animate-spin" color="#38bdf8" size={48} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Auth />;
  }

  return (
    <div className="app-container">
      {/* Extracted Sidebar Layout */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="main-content">
        {/* Extracted Header Layout */}
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Feature-Based Dynamic Content */}
        {activeTab === 'profile' && <Profile />}
        {activeTab === 'workouts' && <Workouts />}
        {activeTab === 'progress' && <ProgressTracking />}
        {activeTab === 'nutrition' && <Nutrition />}
        {activeTab === 'coach' && <AICoach />}
        {activeTab === 'settings' && <Settings />}
      </main>
    </div>
  );
}

export default App;
