import { useAppContext } from '../../context/AppContext';
import { CircularTracer } from '../../components/ui/Progress';
import { Activity, Dumbbell, Utensils, Target, Droplets, Zap, Moon } from 'lucide-react';

export function Today() {
  const { workouts, userProfile } = useAppContext();
  
  const todayDate = new Date().toDateString();
  const todaysWorkouts = workouts.filter(w => new Date(w.date).toDateString() === todayDate);
  const todaysNutrition = userProfile?.nutritionLogs || [];
  
  const consumedCalories = todaysNutrition.reduce((acc, log) => acc + log.calories, 0);
  const consumedProtein = todaysNutrition.reduce((acc, log) => acc + log.protein, 0);
  
  // Fake calculated macros for UI density
  const consumedCarbs = Math.round((consumedCalories * 0.4) / 4); // 40% carbs
  const consumedFat = Math.round((consumedCalories * 0.3) / 9); // 30% fat
  
  const targetCalories = 2500;
  const targetProtein = 160;
  const targetCarbs = 250;
  const targetFat = 80;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '24px' }}>
      
      {/* Quick Stats Header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '8px' }}>
        <div style={{ background: 'var(--bg-glass)', padding: '16px', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(234, 179, 8, 0.1)', color: 'var(--accent)', padding: '12px', borderRadius: '50%' }}><Zap size={24} /></div>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Active Energy</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{todaysWorkouts.reduce((acc, w) => acc + (w.duration * 8), 0)} <span style={{ fontSize: '0.875rem', fontWeight: 400, color: '#71717a' }}>kcal</span></div>
          </div>
        </div>
        <div style={{ background: 'var(--bg-glass)', padding: '16px', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '12px', borderRadius: '50%' }}><Droplets size={24} /></div>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Water Intake</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>1.2 <span style={{ fontSize: '0.875rem', fontWeight: 400, color: '#71717a' }}>/ 3.0 L</span></div>
          </div>
        </div>
        <div style={{ background: 'var(--bg-glass)', padding: '16px', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', padding: '12px', borderRadius: '50%' }}><Moon size={24} /></div>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Sleep</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>6.5 <span style={{ fontSize: '0.875rem', fontWeight: 400, color: '#71717a' }}>hrs</span></div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        
        {/* Column 1: Energy & Macros */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h2 className="section-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={18} /> Energy & Macros
          </h2>
          
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <CircularTracer value={consumedCalories} max={targetCalories} label="kcal" color="var(--accent)" />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 16px', fontSize: '0.875rem', marginTop: '-16px' }}>
            <div style={{ textAlign: 'center' }}>
              <strong style={{ display: 'block', fontSize: '1.25rem', color: 'var(--text-primary)' }}>{consumedCalories}</strong>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Eaten</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <strong style={{ display: 'block', fontSize: '1.25rem', color: 'var(--text-primary)' }}>{Math.max(0, targetCalories - consumedCalories)}</strong>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Remaining</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.75rem', color: '#a1a1aa', textTransform: 'uppercase', fontWeight: 600 }}>Protein</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>{consumedProtein} / {targetProtein} g</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: '#27272a', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (consumedProtein / targetProtein) * 100)}%`, height: '100%', background: '#3b82f6', borderRadius: '4px' }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.75rem', color: '#a1a1aa', textTransform: 'uppercase', fontWeight: 600 }}>Carbs</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>{consumedCarbs} / {targetCarbs} g</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: '#27272a', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (consumedCarbs / targetCarbs) * 100)}%`, height: '100%', background: '#eab308', borderRadius: '4px' }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.75rem', color: '#a1a1aa', textTransform: 'uppercase', fontWeight: 600 }}>Fat</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>{consumedFat} / {targetFat} g</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: '#27272a', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (consumedFat / targetFat) * 100)}%`, height: '100%', background: '#ef4444', borderRadius: '4px' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Meals Log */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 className="section-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Utensils size={18} /> Meals Log
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flexGrow: 1 }}>
            {todaysNutrition.length > 0 ? (
              todaysNutrition.map((log: any, idx: number) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-dark)', padding: '16px', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{log.foodItem}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{log.protein}g protein • {Math.round(log.calories * 0.4 / 4)}g carbs</div>
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent)' }}>
                    {log.calories} <span style={{ fontSize: '0.75rem', color: '#71717a', fontWeight: 500 }}>kcal</span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#71717a', background: 'var(--bg-dark)', borderRadius: 'var(--radius)', padding: '32px', border: '1px dashed var(--border-color)' }}>
                <Utensils size={32} style={{ opacity: 0.3, marginBottom: '12px' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>No Meals Logged</span>
                <span style={{ fontSize: '0.75rem', marginTop: '4px', textAlign: 'center' }}>Tell Forge AI what you ate to log it here.</span>
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Training Log */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 className="section-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} /> Training Log
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flexGrow: 1 }}>
            {todaysWorkouts.length > 0 ? (
              todaysWorkouts.map(w => (
                <div key={w.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-dark)', padding: '16px', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(234, 179, 8, 0.1)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Dumbbell size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{w.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{w.type.replace('_', ' ')}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                    {w.duration} <span style={{ fontSize: '0.75rem', color: '#71717a', fontWeight: 500 }}>min</span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#71717a', background: 'var(--bg-dark)', borderRadius: 'var(--radius)', padding: '32px', border: '1px dashed var(--border-color)' }}>
                <Dumbbell size={32} style={{ opacity: 0.3, marginBottom: '12px' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Rest Day</span>
                <span style={{ fontSize: '0.75rem', marginTop: '4px', textAlign: 'center' }}>No workouts recorded for today.</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
