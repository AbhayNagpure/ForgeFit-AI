import { useState, useEffect } from 'react';
import { Activity, Dumbbell, LineChart, User, LogOut, Sparkles, Calendar } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

type SidebarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { logout, userProfile } = useAppContext();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const navItems = [
    { id: 'coach', label: 'Forge AI', icon: Sparkles, isAI: true },
    { id: 'today', label: 'Today', icon: Calendar },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'workouts', label: 'Training', icon: Dumbbell },
    { id: 'progress', label: 'Progress', icon: LineChart }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-main">
        {!isMobile && (
          <div className="sidebar-brand">
            <div className="brand-mark"><Activity size={18} /></div>
            <span>Forge<span>Fit</span></span>
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
          <div className="sidebar-user">
            <div>{userProfile?.name?.slice(0, 1).toUpperCase() || 'A'}</div>
            <span><strong>{userProfile?.name || 'Athlete'}</strong><small>{userProfile?.goal || 'Building consistency'}</small></span>
          </div>
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
