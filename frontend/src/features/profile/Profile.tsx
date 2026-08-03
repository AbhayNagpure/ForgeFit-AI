import { useAppContext } from '../../context/AppContext';
import { Settings } from '../settings/Settings';

export function Profile() {
  const { userProfile } = useAppContext();
  const mockStreak = 14;

  return (
    <div className="dashboard-layout">
      {/* Top Banner: User Info */}
      <div className="card profile-banner">
        <div className="profile-banner-content">
          <div className="profile-avatar-large">
            {userProfile?.gender === 'female' ? '👩' : '👨'}
          </div>
          <div className="profile-details">
            <h2 style={{ fontSize: '1.5rem', margin: '0 0 4px', fontWeight: 600 }}>Abhay Nagpure</h2>
            <div className="profile-badges">
              <span className="badge">Goal: {userProfile?.goal || 'Maintain'}</span>
              <span className="badge">Age: {userProfile?.age || '--'}</span>
              <span className="badge">Weight: {userProfile?.weight || '--'} kg</span>
              <span className="badge">Height: {userProfile?.height || '--'} cm</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-columns" style={{ gridTemplateColumns: '1fr' }}>
        {/* Consistency Streak */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 className="section-title">Consistency</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '8px 0 16px' }}>
            <div style={{ fontSize: '2.5rem' }}>🔥</div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1 }}>{mockStreak}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Day Streak</div>
            </div>
          </div>
          
          <div className="activity-grid" style={{ gridTemplateColumns: 'repeat(14, 1fr)' }}>
            {Array.from({ length: 28 }).map((_, i) => (
              <div 
                key={i} 
                className={`activity-dot ${i >= 28 - mockStreak ? 'active' : ''}`}
                title={`Day ${i + 1}`}
              />
            ))}
          </div>
          <p className="page-subtitle" style={{ marginTop: '16px' }}>Top 5% of active users this week.</p>
        </div>
      </div>

      {/* Embedded Settings Section */}
      <div style={{ marginTop: '16px' }}>
        <Settings />
      </div>
    </div>
  );
}
