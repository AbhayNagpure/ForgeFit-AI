import { useAppContext } from '../../context/AppContext';
import { Flame, Scale, Dumbbell, Trophy, TrendingUp, Medal, Activity } from 'lucide-react';

export function ProgressTracking() {
  const { userProfile, workouts, personalRecords } = useAppContext();

  const currentStreak = 12; // In a real app, you'd calculate this from workouts
  const totalWorkouts = workouts.length;
  const currentWeight = userProfile?.weight || 75;
  const weightChange = -2.5; 
  
  // Format PRs nicely from the backend
  const formattedPRs = personalRecords.slice(0, 5).map((pr, idx) => ({
    name: pr.exerciseName,
    weight: `${pr.weight} lbs`, // Or kg depending on preference
    date: new Date(pr.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    icon: idx % 2 === 0 ? Dumbbell : Trophy,
    color: idx % 3 === 0 ? '#ef4444' : idx % 3 === 1 ? '#3b82f6' : '#eab308'
  }));

  return (
    <div className="dashboard-layout" style={{ gap: '24px' }}>
      
      {/* Top Highlights: Stats Grid */}
      <div className="stats-grid">
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(249, 115, 22, 0.2)', color: '#f97316' }}>
            <Flame size={28} />
          </div>
          <div>
            <div className="stat-label">Current Streak</div>
            <div className="stat-value" style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              {currentStreak} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Days</span>
            </div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' }}>
            <Scale size={28} />
          </div>
          <div>
            <div className="stat-label">Current Weight</div>
            <div className="stat-value" style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              {currentWeight} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>kg</span>
            </div>
            <div className="stat-change" style={{ color: weightChange <= 0 ? 'var(--accent)' : '#ef4444' }}>
              <TrendingUp size={12} style={{ marginRight: '4px', transform: weightChange <= 0 ? 'rotate(180deg)' : 'none' }} />
              {Math.abs(weightChange)} kg this month
            </div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
            <Medal size={28} />
          </div>
          <div>
            <div className="stat-label">Total Workouts</div>
            <div className="stat-value">{totalWorkouts}</div>
          </div>
        </div>
      </div>

      <div className="dashboard-columns">
        <div className="card chart-section" style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} /> Volume Progression
          </h2>
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '12px', paddingTop: '32px' }}>
            {[30, 45, 40, 60, 55, 80, 100].map((height, i) => (
              <div 
                key={i} 
                style={{ 
                  flex: 1, 
                  height: `${height}%`, 
                  background: i === 6 ? 'linear-gradient(to top, var(--accent), #6ee7b7)' : 'rgba(255, 255, 255, 0.1)', 
                  borderRadius: '6px 6px 0 0',
                  transition: 'height 0.5s ease',
                  position: 'relative'
                }}
              >
                {i === 6 && (
                  <div style={{ position: 'absolute', top: '-24px', width: '100%', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)' }}>
                    Peak
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Trophy size={18} /> Personal Records
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {formattedPRs.length === 0 && (
              <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem' }}>
                No PRs logged yet. Tell your AI Coach to log one!
              </div>
            )}
            {formattedPRs.map((pr, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ padding: '8px', borderRadius: '8px', background: `${pr.color}20`, color: pr.color }}>
                    <pr.icon size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{pr.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{pr.date}</div>
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                  {pr.weight}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
