import { useState } from 'react';
import { User, Bell, Palette, LogOut, Info } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export function Settings() {
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState(true);
  const { userProfile, logout } = useAppContext();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px', width: '100%' }}>
      
      {/* AI Data Entry Notice */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(234, 179, 8, 0.1)', border: '1px solid var(--accent)', padding: '16px', borderRadius: '4px' }}>
        <Info size={20} color="var(--accent)" />
        <span style={{ fontSize: '0.875rem', color: '#eab308', fontWeight: 600 }}>
          This platform is strictly AI-first. To update your name, email, height, goals, or nutrition targets, simply ask the AI Coach.
        </span>
      </div>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', margin: '0', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
        <User size={20} color="var(--accent)" /> Account Settings
      </h2>
      
      {/* Account Info Group (Read-Only) */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '1px' }}>Full Name</span>
          <span style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 700 }}>{userProfile?.name || 'Not Set'}</span>
        </div>
        <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '1px' }}>Core Goal</span>
          <span style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 700 }}>{userProfile?.goal || 'Not Set'}</span>
        </div>
      </div>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', margin: '16px 0 0 0', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
        <Palette size={20} color="var(--accent)" /> System Preferences
      </h2>

      {/* Preferences Group */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        {/* Theme Select */}
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Palette size={18} color="var(--text-secondary)" />
            <span style={{ fontSize: '1rem', fontWeight: 600 }}>App Theme</span>
          </div>
          <select 
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '1rem', outline: 'none', textAlign: 'right', cursor: 'pointer' }}
          >
            <option value="dark">Hardcore Dark</option>
            <option value="light">High Contrast Light</option>
            <option value="system">System Default</option>
          </select>
        </div>
        
        {/* Notifications Toggle */}
        <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Bell size={18} color="var(--text-secondary)" />
            <span style={{ fontSize: '1rem', fontWeight: 600 }}>Push Notifications</span>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <div style={{ position: 'relative' }}>
              <input 
                type="checkbox" 
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
              />
              <div style={{
                width: '48px', height: '24px', backgroundColor: notifications ? 'var(--accent)' : 'var(--bg-glass-active)',
                borderRadius: '4px', transition: 'background-color 0.3s', position: 'relative', border: '1px solid var(--border-color)'
              }}>
                <div style={{
                  position: 'absolute', top: '2px', left: notifications ? '24px' : '2px', width: '18px', height: '18px',
                  backgroundColor: notifications ? '#000' : '#fff', borderRadius: '2px', transition: 'left 0.3s ease'
                }} />
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Logout & Danger Zone */}
      <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase', margin: '0 0 4px 0', color: 'var(--text-primary)' }}>End Session</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>Log out of your account on this device.</p>
          </div>
          <button 
            onClick={logout}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px', background: 'transparent', border: '1px solid var(--border-color)', 
              color: 'var(--text-primary)', cursor: 'pointer', borderRadius: '4px', fontWeight: 600, textTransform: 'uppercase', transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'var(--bg-glass-active)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
