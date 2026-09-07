import { useState, useEffect } from 'react';
import { Activity, Dumbbell, LineChart, User, LogOut, Cpu, Calendar } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

type SidebarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { logout } = useAppContext();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const navItems = [
    { id: 'coach', label: 'Forge AI', icon: Cpu, isAI: true },
    { id: 'today', label: 'Today', icon: Calendar },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'workouts', label: 'Workouts', icon: Dumbbell },
    { id: 'progress', label: 'Progress', icon: LineChart }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-main">
        {!isMobile && (
          <div className="sidebar-brand">
            <Activity size={24} color="var(--accent)" />
            <span>ForgeFit</span>
          </div>
        )}
        <nav className="sidebar-nav">
          {navItems.map(({ id, label, icon: Icon, isAI }) => (
            <button 
              key={id}
              className={`nav-link ${activeTab === id ? 'active' : ''} ${isAI ? 'is-ai' : ''}`}
              onClick={() => setActiveTab(id)}
            >
              <Icon size={20} className="nav-icon" />
              <span className="nav-label">{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {!isMobile && (
        <div className="sidebar-footer">
          <button 
            className="nav-link signout-btn"
            onClick={logout}
          >
            <LogOut size={20} className="nav-icon" />
            <span className="nav-label">Sign Out</span>
          </button>
        </div>
      )}
    </aside>
  );
}
