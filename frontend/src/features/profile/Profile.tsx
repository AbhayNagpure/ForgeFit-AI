import { useAppContext } from '../../context/AppContext';
import { Award, TrendingUp } from 'lucide-react';
import { Settings } from '../settings/Settings';

export function Profile() {
  const { userProfile, workouts, personalRecords } = useAppContext();
  
  const totalWorkouts = workouts.length;
  const hoursTrained = Math.round(workouts.reduce((acc, w) => acc + w.duration, 0) / 60);

  // Mock streak calculation
  const streak = totalWorkouts > 0 ? 3 : 0;
  
  const bmi = userProfile?.weight && userProfile?.height 
    ? (userProfile.weight / Math.pow(userProfile.height / 100, 2)).toFixed(1)
    : '--';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '24px' }}>
      
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 4px 0' }}>{userProfile?.name || 'Athlete Profile'}</h1>
        <p style={{ color: 'var(--text-secondary)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)' }}></span>
          {userProfile?.goal || 'General Fitness'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        
        {/* Lifetime Stats */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', color: '#fff', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
            Lifetime Stats
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#71717a', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '1px' }}>Current Weight</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{userProfile?.weight || '--'} <span style={{ fontSize: '0.875rem', color: '#a1a1aa' }}>kg</span></div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#71717a', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '1px' }}>Height</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{userProfile?.height || '--'} <span style={{ fontSize: '0.875rem', color: '#a1a1aa' }}>cm</span></div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#71717a', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '1px' }}>BMI</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{bmi}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#71717a', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '1px' }}>Current Streak</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent)' }}>{streak} Days</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#71717a', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '1px' }}>Total Workouts</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{totalWorkouts}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#71717a', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '1px' }}>Hours Trained</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{hoursTrained}</div>
            </div>
          </div>
        </div>

        {/* PRs */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', color: '#fff', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={18} /> Best PRs
          </h3>
          {personalRecords.length > 0 ? (
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
              {personalRecords.map(pr => (
                <div key={pr.id} style={{ minWidth: '150px', background: '#000', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase' }}>{pr.exerciseName}</span>
                    <TrendingUp size={14} color="var(--accent)" />
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{pr.weight} <span style={{ fontSize: '0.875rem', color: '#71717a' }}>kg</span></div>
                  {pr.reps && <div style={{ fontSize: '0.75rem', color: '#71717a' }}>for {pr.reps} reps</div>}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: '#71717a', fontSize: '0.875rem', fontStyle: 'italic' }}>No PRs logged yet.</div>
          )}
        </div>

      </div>

      {/* Embedded Settings Section */}
      <div style={{ marginTop: '16px' }}>
        <Settings />
      </div>
    </div>
  );
}
