import { Activity, Dumbbell, LineChart, Apple, User, LogOut, Cpu } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

type SidebarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { logout } = useAppContext();
  
  const navItems = [
    { id: 'coach', label: 'Forge AI', icon: Cpu, isAI: true },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'workouts', label: 'Workouts', icon: Dumbbell },
    { id: 'progress', label: 'Progress', icon: LineChart },
    { id: 'nutrition', label: 'Nutrition', icon: Apple },
  ];

  return (
    <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2.5rem', marginTop: '0.5rem' }}>
          <Activity size={24} color="var(--accent)" />
          <span style={{ fontWeight: 800, fontSize: '1.25rem' }}>ForgeFit</span>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {navItems.map(({ id, label, icon: Icon }) => (
            <button 
              key={id}
              className={`nav-link ${activeTab === id ? 'active' : ''}`}
              onClick={() => setActiveTab(id)}
              style={{ 
                width: '100%', 
                textAlign: 'left', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                padding: '10px 12px',
                fontWeight: 600,
                fontSize: '0.9rem',
                borderRadius: 'var(--radius)',
                color: activeTab === id ? 'var(--text-primary)' : 'var(--text-secondary)',
                backgroundColor: activeTab === id ? 'var(--bg-glass-active)' : 'transparent',
              }}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>
      </div>
      
      <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
        <button 
          className="nav-link"
          onClick={logout}
          style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px', color: '#ef4444', fontWeight: 600, fontSize: '0.9rem', padding: '10px 12px', borderRadius: 'var(--radius)' }}
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
