
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
          className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
          style={{ width: '100%', textAlign: 'left' }}
        >
          Profile
        </button>
        <button 
          className={`nav-link ${activeTab === 'workouts' ? 'active' : ''}`}
          onClick={() => setActiveTab('workouts')}
          style={{ width: '100%', textAlign: 'left' }}
        >
          Workouts
        </button>
        <button 
          className={`nav-link ${activeTab === 'progress' ? 'active' : ''}`}
          onClick={() => setActiveTab('progress')}
          style={{ width: '100%', textAlign: 'left' }}
        >
          Progress
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
      </nav>
    </aside>
  );
}
