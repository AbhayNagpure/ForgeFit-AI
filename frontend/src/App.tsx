import { useState } from 'react';
import './index.css';
import { Dashboard } from './components/Dashboard';
import { AddWorkout } from './components/AddWorkout';
import { AICoach } from './components/AICoach';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="brand">ForgeFit</div>
        
        <nav>
          <button 
            className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
            style={{ width: '100%', textAlign: 'left' }}
          >
            Dashboard
          </button>
          <button 
            className={`nav-link ${activeTab === 'workouts' ? 'active' : ''}`}
            onClick={() => setActiveTab('workouts')}
            style={{ width: '100%', textAlign: 'left' }}
          >
            Workouts
          </button>
          <button 
            className={`nav-link ${activeTab === 'coach' ? 'active' : ''}`}
            onClick={() => setActiveTab('coach')}
            style={{ width: '100%', textAlign: 'left' }}
          >
            AI Coach
          </button>
          <button className="nav-link" style={{ width: '100%', textAlign: 'left' }}>Nutrition</button>
          <button className="nav-link" style={{ width: '100%', textAlign: 'left' }}>Settings</button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="page-header">
          <h1 className="page-title">
            {activeTab === 'dashboard' && 'Dashboard'}
            {activeTab === 'workouts' && 'Workouts'}
            {activeTab === 'coach' && 'AI Personal Coach'}
          </h1>
          <p className="page-subtitle">
            {activeTab === 'dashboard' && 'Welcome back. Here is your overview for today.'}
            {activeTab === 'workouts' && 'Log and track your training sessions.'}
            {activeTab === 'coach' && 'Ask your AI coach to analyze your data and build routines.'}
          </p>
        </header>

        {/* Dynamic Content */}
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'workouts' && <AddWorkout />}
        {activeTab === 'coach' && <AICoach />}
      </main>
    </div>
  );
}

export default App;
