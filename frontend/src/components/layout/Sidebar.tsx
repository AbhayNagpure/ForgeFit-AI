import React from 'react';

type SidebarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
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
          className={`nav-link ${activeTab === 'nutrition' ? 'active' : ''}`}
          onClick={() => setActiveTab('nutrition')}
          style={{ width: '100%', textAlign: 'left' }}
        >
          Nutrition
        </button>
        <button 
          className={`nav-link ${activeTab === 'coach' ? 'active' : ''}`}
          onClick={() => setActiveTab('coach')}
          style={{ width: '100%', textAlign: 'left' }}
        >
          AI Coach
        </button>
        <button 
          className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
          style={{ width: '100%', textAlign: 'left' }}
        >
          Settings
        </button>
      </nav>
    </aside>
  );
}
