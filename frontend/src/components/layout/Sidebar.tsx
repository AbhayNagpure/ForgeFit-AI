import { Activity, Dumbbell, LineChart, Apple, User, BrainCircuit } from 'lucide-react';

type SidebarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const navItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'workouts', label: 'Workouts', icon: Dumbbell },
    { id: 'progress', label: 'Progress', icon: LineChart },
    { id: 'nutrition', label: 'Nutrition', icon: Apple },
    { id: 'coach', label: 'AI Coach', icon: BrainCircuit },
  ];

  return (
    <aside className="sidebar">
      <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Activity size={24} color="var(--accent)" />
        ForgeFit
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map(({ id, label, icon: Icon }) => (
          <button 
            key={id}
            className={`nav-link ${activeTab === id ? 'active' : ''}`}
            onClick={() => setActiveTab(id)}
            style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px' }}
          >
            <Icon size={18} strokeWidth={activeTab === id ? 2.5 : 2} opacity={activeTab === id ? 1 : 0.7} />
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
