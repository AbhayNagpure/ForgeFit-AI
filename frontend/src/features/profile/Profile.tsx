import { useAppContext } from '../../context/AppContext';
import { Settings } from '../settings/Settings';
import { Target, Activity, Flame, Ruler, Weight, ShieldCheck } from 'lucide-react';

export function Profile() {
  const { userProfile } = useAppContext();

  return (
    <div className="dashboard-layout" style={{ gap: '24px' }}>
      
      {/* Top Banner: Glass ID Card */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '32px', background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)', border: '1px solid var(--border-glass-light)' }}>
        <div style={{
          width: '96px', height: '96px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), #818cf8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', boxShadow: '0 8px 32px rgba(99, 102, 241, 0.4)',
          border: '4px solid var(--bg-surface)'
        }}>
          {userProfile?.gender === 'female' ? '👩' : '👨'}
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '2rem', margin: '0 0 8px 0', fontWeight: 700, letterSpacing: '-0.02em' }}>Abhay Nagpure</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <ShieldCheck size={16} color="var(--accent)" /> ForgeFit Pro Member
            </span>
            <span style={{ color: 'var(--border-glass)' }}>|</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <Target size={16} /> Goal: {userProfile?.goal || 'Build Muscle'}
            </span>
          </div>
        </div>
      </div>

      {/* Body Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', textAlign: 'center', padding: '24px' }}>
          <div style={{ padding: '12px', borderRadius: '16px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
            <Activity size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Age</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{userProfile?.age || 24}</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', textAlign: 'center', padding: '24px' }}>
          <div style={{ padding: '12px', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <Ruler size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Height</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{userProfile?.height || 180} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>cm</span></div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', textAlign: 'center', padding: '24px' }}>
          <div style={{ padding: '12px', borderRadius: '16px', background: 'rgba(249, 115, 22, 0.1)', color: '#f97316' }}>
            <Weight size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Current Weight</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{userProfile?.weight || 75} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>kg</span></div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', textAlign: 'center', padding: '24px' }}>
          <div style={{ padding: '12px', borderRadius: '16px', background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>
            <Flame size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Target Weight</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>82 <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>kg</span></div>
          </div>
        </div>
      </div>

      {/* Embedded Settings Section */}
      <div style={{ marginTop: '16px' }}>
        <Settings />
      </div>
    </div>
  );
}
