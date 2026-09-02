import { useAppContext } from '../../context/AppContext';
import { Settings } from '../settings/Settings';
import { 
  Target, Activity, ShieldCheck, 
  TrendingUp, Award
} from 'lucide-react';

export function Profile() {
  const { userProfile, workouts, personalRecords } = useAppContext();

  // Derived stats
  const totalWorkouts = workouts.length;
  const hoursTrained = Math.round(workouts.reduce((acc, w) => acc + (w.duration || 0), 0) / 60);
  const bmi = (userProfile?.weight && userProfile?.height) 
    ? (userProfile.weight / Math.pow(userProfile.height / 100, 2)).toFixed(1) 
    : 'N/A';
  
  const streak = totalWorkouts > 0 ? 3 : 0; 
  
  const targetCalories = userProfile?.dailyCalories || 2500;
  const targetProtein = userProfile?.dailyProtein || 150;

  // Today calculations
  const today = new Date().toDateString();
  const todaysWorkouts = workouts.filter(w => new Date(w.date).toDateString() === today);
  const todaysNutrition = userProfile?.nutritionLogs || [];
  
  const consumedCalories = todaysNutrition.reduce((acc, log) => acc + log.calories, 0);
  const consumedProtein = todaysNutrition.reduce((acc, log) => acc + log.protein, 0);

  const calPercent = Math.min((consumedCalories / targetCalories) * 100, 100);
  const proPercent = Math.min((consumedProtein / targetProtein) * 100, 100);

  return (
    <div className="dashboard-layout" style={{ gap: '24px' }}>
      
      {/* 1. TOP BANNER */}
      <div className="card" style={{ 
        display: 'flex', alignItems: 'center', gap: '20px', padding: '32px', 
        background: 'linear-gradient(90deg, #18181b 0%, #09090b 100%)', 
        border: '1px solid #27272a', borderLeft: '4px solid var(--accent)'
      }}>
        <div style={{
          width: '72px', height: '72px', background: '#000',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem',
          border: '2px solid var(--accent)', color: 'var(--accent)', textTransform: 'uppercase', fontWeight: 800
        }}>
          {userProfile?.name ? userProfile.name.charAt(0) : 'U'}
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '1.75rem', margin: '0 0 4px 0', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
            {userProfile?.name || 'Athlete Profile'}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginTop: '8px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase' }}>
              <ShieldCheck size={16} /> Elite Member
            </span>
            <span style={{ color: '#3f3f46' }}>|</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#a1a1aa', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              <Target size={16} /> Goal: <span style={{ color: '#fff', fontWeight: 600 }}>{userProfile?.goal || 'Build Muscle'}</span>
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        
        {/* TODAY'S ACTIVITY */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent)', borderBottom: '1px solid #27272a', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} /> Today's Activity
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {/* Nutrition Box */}
            <div style={{ background: '#000', padding: '16px', borderRadius: 'var(--radius)', border: '1px solid #27272a', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase' }}>Nutrition</span>
                <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>via AI Coach</span>
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#71717a', textTransform: 'uppercase', fontWeight: 600 }}>Calories</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>{consumedCalories} / {targetCalories} kcal</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#27272a', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                  <div style={{ width: `${calPercent}%`, height: '100%', background: 'var(--accent)' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#71717a', textTransform: 'uppercase', fontWeight: 600 }}>Protein</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>{consumedProtein} / {targetProtein} g</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#27272a', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                  <div style={{ width: `${proPercent}%`, height: '100%', background: '#ef4444' }} />
                </div>
              </div>
            </div>

            {/* Workout Box */}
            <div style={{ background: '#000', padding: '16px', borderRadius: 'var(--radius)', border: '1px solid #27272a', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase' }}>Training</span>
                <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>via AI Coach</span>
              </div>
              {todaysWorkouts.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {todaysWorkouts.map(w => (
                    <div key={w.id} style={{ display: 'flex', justifyContent: 'space-between', background: '#18181b', padding: '10px', borderRadius: 'var(--radius)' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{w.name}</span>
                      <span style={{ fontSize: '0.875rem', color: '#a1a1aa' }}>{w.duration} min</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#71717a', fontSize: '0.875rem', fontStyle: 'italic', background: '#18181b', borderRadius: 'var(--radius)' }}>
                  No training logged today.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* LIFETIME STATS (Grid layout inside) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', color: '#fff', borderBottom: '1px solid #27272a', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
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

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', color: '#fff', borderBottom: '1px solid #27272a', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={18} /> Best PRs
            </h3>
            {personalRecords.length > 0 ? (
              <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
                {personalRecords.map(pr => (
                  <div key={pr.id} style={{ minWidth: '150px', background: '#000', border: '1px solid #27272a', borderRadius: 'var(--radius)', padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
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

      </div>

      {/* Embedded Settings & Privacy Section */}
      <div style={{ marginTop: '16px' }}>
        <Settings />
      </div>
    </div>
  );
}
