
import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';

type HeaderProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export function Header({ activeTab, setActiveTab }: HeaderProps) {
  const { userProfile } = useAppContext();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <h1 className="page-title">
          {activeTab === 'profile' && 'Profile & Settings'}
          {activeTab === 'workouts' && 'Workouts'}
          {activeTab === 'progress' && 'Progress Tracking'}
          {activeTab === 'nutrition' && 'Nutrition Tracker'}
          {activeTab === 'coach' && 'AI Personal Coach'}
        </h1>
        <p className="page-subtitle">
          {activeTab === 'profile' && 'Manage your account, settings, and baseline metrics.'}
          {activeTab === 'workouts' && 'Log and track your training sessions.'}
          {activeTab === 'progress' && 'View your historical data and charts.'}
          {activeTab === 'nutrition' && 'Track your daily macros and calories.'}
          {activeTab === 'coach' && 'Ask your AI coach to analyze your data and build routines.'}
        </p>
      </div>

      {userProfile && (
        <div style={{ position: 'relative' }}>
          <button 
            className="avatar-circle"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent)',
              color: '#000',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              border: '2px solid var(--border-color)',
            }}
          >
            {userProfile.gender === 'male' ? '👨' : userProfile.gender === 'female' ? '👩' : '👤'}
          </button>

          {isProfileOpen && (
            <div className="card" style={{ 
              position: 'absolute', 
              top: '50px', 
              right: 0, 
              width: '240px',
              zIndex: 10,
              padding: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
            }}>
              <h3 style={{ fontSize: '0.875rem', marginBottom: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Your Profile</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8125rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="stat-label" style={{ margin: 0 }}>Goal</span>
                  <strong style={{ textTransform: 'capitalize' }}>{userProfile.goal}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="stat-label" style={{ margin: 0 }}>Age</span>
                  <strong>{userProfile.age}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="stat-label" style={{ margin: 0 }}>Weight</span>
                  <strong>{userProfile.weight} kg</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="stat-label" style={{ margin: 0 }}>Height</span>
                  <strong>{userProfile.height} cm</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
