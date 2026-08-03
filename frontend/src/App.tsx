import { useState } from 'react';
import './index.css';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Profile } from './features/profile/Profile';
import { AddWorkout } from './features/workouts/AddWorkout';
import { ProgressTracking } from './features/progress/ProgressTracking';
import { AICoach } from './features/ai-coach/AICoach';
import { Nutrition } from './features/nutrition/Nutrition';
import { Onboarding } from './features/onboarding/Onboarding';
import { useAppContext } from './context/AppContext';

function App() {
  const [activeTab, setActiveTab] = useState('profile');
  const { userProfile } = useAppContext();

  // If no profile exists, show the full-screen onboarding flow
  if (!userProfile) {
    return <Onboarding />;
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
        {activeTab === 'workouts' && <AddWorkout />}
        {activeTab === 'progress' && <ProgressTracking />}
        {activeTab === 'nutrition' && <Nutrition />}
        {activeTab === 'coach' && <AICoach />}
        {activeTab === 'settings' && <Settings />}
      </main>
    </div>
  );
}

export default App;
