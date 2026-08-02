import React, { useState } from 'react';

export function Settings() {
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="dashboard-layout" style={{ maxWidth: '800px' }}>
      <div className="card">
        <h2 className="section-title">Account Settings</h2>
        
        <form className="workout-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" defaultValue="Abhay Nagpure" className="form-control" />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" defaultValue="abhay@example.com" className="form-control" />
            </div>
          </div>

          <h2 className="section-title" style={{ marginTop: '24px' }}>Preferences</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label>App Theme</label>
              <select 
                className="form-control" 
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              >
                <option value="dark">Professional Dark (Default)</option>
                <option value="light">High Contrast Light</option>
                <option value="system">System Default</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Units</label>
              <select className="form-control" defaultValue="metric">
                <option value="metric">Metric (kg, cm)</option>
                <option value="imperial">Imperial (lbs, in)</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
            <input 
              type="checkbox" 
              id="notif"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: 'var(--accent)' }}
            />
            <label htmlFor="notif" style={{ margin: 0, cursor: 'pointer' }}>Enable AI push notifications (Reminders & Motivation)</label>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </div>
        </form>
      </div>

      <div className="card" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
        <h2 className="section-title" style={{ color: '#ef4444', borderBottomColor: 'rgba(239, 68, 68, 0.3)' }}>Danger Zone</h2>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button type="button" className="btn" style={{ backgroundColor: 'transparent', border: '1px solid #ef4444', color: '#ef4444' }}>
          Delete Account
        </button>
      </div>
    </div>
  );
}
