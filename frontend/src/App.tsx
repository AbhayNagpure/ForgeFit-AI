import { useState } from 'react';
import './index.css';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './features/dashboard/Dashboard';
import { AddWorkout } from './features/workouts/AddWorkout';
import { AICoach } from './features/ai-coach/AICoach';
import { Nutrition } from './features/nutrition/Nutrition';
import { Settings } from './features/settings/Settings';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="app-container">
      {/* Extracted Sidebar Layout */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="main-content">
        {/* Extracted Header Layout */}
        <Header activeTab={activeTab} />

        {/* Feature-Based Dynamic Content */}
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'workouts' && <AddWorkout />}
        {activeTab === 'nutrition' && <Nutrition />}
        {activeTab === 'coach' && <AICoach />}
        {activeTab === 'settings' && <Settings />}
      </main>
    </div>
  );
}

export default App;
