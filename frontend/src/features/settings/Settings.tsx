import { useState } from 'react';
import { User, Bell, Palette, Scale, AlertTriangle, LogOut } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export function Settings() {
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState(true);
  const { logout } = useAppContext();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '16px 0 0 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <User size={20} color="var(--accent)" /> Account Settings
      </h2>
      
      {/* Account Info Group */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-glass)' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Full Name</label>
          <input 
            type="text" 
            defaultValue="Abhay Nagpure" 
            style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '1rem', outline: 'none' }} 
          />
        </div>
        <div style={{ padding: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Email Address</label>
          <input 
            type="email" 
            defaultValue="abhay@example.com" 
            style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '1rem', outline: 'none' }} 
          />
        </div>
      </div>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '16px 0 0 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Palette size={20} color="var(--accent)" /> Preferences
      </h2>

      {/* Preferences Group */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        {/* Theme Select */}
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Palette size={18} color="var(--text-secondary)" />
            <span style={{ fontSize: '1rem' }}>App Theme</span>
          </div>
          <select 
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '1rem', outline: 'none', textAlign: 'right', cursor: 'pointer' }}
          >
            <option value="dark">Professional Dark</option>
            <option value="light">High Contrast Light</option>
            <option value="system">System Default</option>
          </select>
        </div>
        
        {/* Units Select */}
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Scale size={18} color="var(--text-secondary)" />
            <span style={{ fontSize: '1rem' }}>Units</span>
          </div>
          <select 
            defaultValue="metric"
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '1rem', outline: 'none', textAlign: 'right', cursor: 'pointer' }}
          >
            <option value="metric">Metric (kg, cm)</option>
            <option value="imperial">Imperial (lbs, in)</option>
          </select>
        </div>

        {/* Notifications Toggle */}
        <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Bell size={18} color="var(--text-secondary)" />
            <span style={{ fontSize: '1rem' }}>AI Push Notifications</span>
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
                width: '48px', height: '28px', backgroundColor: notifications ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
                borderRadius: '999px', transition: 'background-color 0.3s', position: 'relative'
              }}>
                <div style={{
                  position: 'absolute', top: '2px', left: notifications ? '22px' : '2px', width: '24px', height: '24px',
                  backgroundColor: '#fff', borderRadius: '50%', transition: 'left 0.3s ease', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }} />
              </div>
            </div>
          </label>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
        <button className="btn" style={{ background: 'var(--accent)', color: '#fff', padding: '12px 32px', borderRadius: '999px', fontWeight: 600, border: 'none', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)' }}>
          Save Changes
        </button>
      </div>

      {/* Logout & Danger Zone */}
      <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 4px 0', color: 'var(--text-primary)' }}>Sign Out</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>Log out of your account on this device.</p>
          </div>
          <button 
            onClick={logout}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-glass)', 
              color: 'var(--text-primary)', cursor: 'pointer', borderRadius: '12px', fontWeight: 600, transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; }}
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>

        <div className="card" style={{ border: '1px solid rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.02)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 16px 0', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={20} /> Danger Zone
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.5 }}>
            Once you delete your account, there is no going back. All your workout logs, PRs, and AI insights will be permanently erased. Please be certain.
          </p>
          <button style={{ 
            background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.4)',
            padding: '12px 24px', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', width: '100%'
          }}>
            Delete Account Permanently
          </button>
        </div>
      </div>
    </div>
  );
}
