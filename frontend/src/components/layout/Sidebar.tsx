import { Activity, Dumbbell, LineChart, User, LogOut, Cpu, Calendar } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

type SidebarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { logout } = useAppContext();
  
  const navItems = [
    { id: 'coach', label: 'Forge AI', icon: Cpu, isAI: true },
    { id: 'today', label: 'Today', icon: Calendar },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'workouts', label: 'Workouts', icon: Dumbbell },
    { id: 'progress', label: 'Progress', icon: LineChart }
  ];

  return (
    <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2.5rem', marginTop: '0.5rem' }}>
          <Activity size={24} color="var(--accent)" />
          <span style={{ fontWeight: 800, fontSize: '1.25rem' }}>ForgeFit</span>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {navItems.map(({ id, label, icon: Icon, isAI }) => (
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
                fontWeight: isAI && activeTab === id ? 700 : 600,
                fontSize: '0.9rem',
                borderRadius: '8px',
                color: activeTab === id 
                  ? (isAI ? 'var(--accent)' : 'var(--text-primary)') 
                  : 'var(--text-secondary)',
                backgroundColor: activeTab === id 
                  ? (isAI ? 'rgba(234, 179, 8, 0.15)' : 'var(--bg-glass-active)') 
                  : 'transparent',
                border: isAI && activeTab === id ? '1px solid rgba(234, 179, 8, 0.3)' : '1px solid transparent'
              }}
            >
              <Icon size={18} color={isAI && activeTab === id ? 'var(--accent)' : 'currentColor'} />
              {label}
            </button>
          ))}
        </nav>
      </div>

      <div>
        <button 
          className="nav-link"
          onClick={logout}
          style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px', color: '#ef4444', fontWeight: 600, fontSize: '0.9rem', padding: '10px 12px', borderRadius: '8px' }}
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
