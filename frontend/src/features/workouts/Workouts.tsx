import { useState } from 'react';
import { EXERCISE_LIBRARY, MUSCLE_GROUPS } from './exerciseData';
import { Star, Sparkles, Shield, ChevronRight, Plus } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export function Workouts() {
  const [selectedGroup, setSelectedGroup] = useState(MUSCLE_GROUPS[0]);
  const { addWorkout } = useAppContext();
  
  const filteredExercises = EXERCISE_LIBRARY.filter(ex => ex.group === selectedGroup);

  // Group the filtered exercises by their subGroup and limit 'Essential' to max 2 per group
  const groupedExercises = filteredExercises.reduce((acc, ex) => {
    if (!acc[ex.subGroup]) {
      acc[ex.subGroup] = { items: [], essentialCount: 0 };
    }
    
    // Create a copy to safely mutate the rating for display
    const processedEx = { ...ex };
    
    if (processedEx.rating === 'Essential') {
      if (acc[ex.subGroup].essentialCount < 2) {
        acc[ex.subGroup].essentialCount++;
      } else {
        processedEx.rating = 'Recommended'; // Downgrade to Recommended if limit reached
      }
    }
    
    acc[ex.subGroup].items.push(processedEx);
    return acc;
  }, {} as Record<string, { items: typeof EXERCISE_LIBRARY, essentialCount: number }>);

  const handleQuickLog = () => {
    const defaultWorkout = {
      name: `${selectedGroup} Routine`,
      type: 'strength',
      duration: 45
    };
    addWorkout(defaultWorkout);
    alert(`Logged ${selectedGroup} Routine to your Progress!`);
  };

  return (
    <div className="dashboard-layout" style={{ gap: '32px' }}>
      {/* Header & Sticky Filter Pills */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '24px', zIndex: 10, padding: '24px', background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid var(--border-glass)', borderRadius: '24px', boxShadow: '0 12px 40px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 className="page-title">Exercise Library</h2>
            <p className="page-subtitle">Optimal form, target regions, and ratings.</p>
          </div>
          <button 
            onClick={handleQuickLog}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 16px', background: 'var(--accent)', color: '#fff',
              border: 'none', borderRadius: '12px', fontWeight: 600,
              cursor: 'pointer', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
            }}
          >
            <Plus size={18} />
            Log {selectedGroup} Workout
          </button>
        </div>
        
        {/* Horizontal Scrollable Pills */}
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {MUSCLE_GROUPS.map((group) => (
            <button
              key={group}
              onClick={() => setSelectedGroup(group)}
              style={{
                padding: '8px 20px',
                borderRadius: '999px',
                fontWeight: 600,
                fontSize: '0.875rem',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                border: `1px solid ${selectedGroup === group ? 'var(--accent)' : 'var(--border-glass)'}`,
                background: selectedGroup === group ? 'var(--accent)' : 'var(--bg-glass)',
                color: selectedGroup === group ? '#fff' : 'var(--text-secondary)',
                boxShadow: selectedGroup === group ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none'
              }}
            >
              {group}
            </button>
          ))}
        </div>
      </div>

      {/* Render each sub-group as a section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
        {Object.entries(groupedExercises).map(([subGroup, data]) => (
          <div key={subGroup} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ChevronRight size={20} color="var(--accent)" />
              {subGroup.replace('🔸 ', '').replace('⚪ ', '')}
            </h2>
            
            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {data.items.map((ex, index) => (
                <div key={index} className="card" style={{ display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden', border: '1px solid var(--border-glass-light)' }}>
                  
                  {/* Video Player Header */}
                  <div 
                    style={{ 
                      width: '100%', 
                      height: '220px', 
                      backgroundColor: '#000',
                      backgroundImage: ex.videoPlaceholder.endsWith('.mp4') ? 'none' : `url(${ex.videoPlaceholder})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative'
                    }}
                  >
                    {ex.videoPlaceholder.endsWith('.mp4') ? (
                      <video 
                        src={ex.videoPlaceholder} 
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        width: '48px', height: '48px', backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontSize: '20px', border: '1px solid rgba(255,255,255,0.2)'
                      }}>▶</div>
                    )}
                  </div>

                  {/* Exercise Details */}
                  <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ marginBottom: '16px' }}>
                      <h3 style={{ fontSize: '1.25rem', margin: '0 0 12px 0', fontWeight: 600, letterSpacing: '-0.02em' }}>{ex.name}</h3>
                      
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ 
                          display: 'inline-flex', alignItems: 'center', gap: '4px',
                          padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600,
                          backgroundColor: ex.rating === 'Essential' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                          color: ex.rating === 'Essential' ? '#10b981' : '#3b82f6',
                          border: `1px solid ${ex.rating === 'Essential' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`
                        }}>
                          {ex.rating === 'Essential' ? <Star size={14} fill="#10b981" /> : (ex.rating === 'Recommended' ? <Sparkles size={14} /> : <Shield size={14} />)}
                          {ex.rating === 'Essential' ? 'Essential' : (ex.rating === 'Recommended' ? 'Recommended' : 'Optional')}
                        </span>
                        
                        <span style={{ 
                          display: 'inline-flex', alignItems: 'center',
                          padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 500,
                          backgroundColor: 'var(--bg-glass)', color: 'var(--text-secondary)', border: '1px solid var(--border-glass)'
                        }}>
                          {ex.target}
                        </span>
                      </div>
                    </div>
                    
                    <ul style={{ 
                      paddingLeft: '20px', margin: 'auto 0 0 0', color: 'var(--text-secondary)', 
                      fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '10px' 
                    }}>
                      {ex.tips.map((tip, idx) => (
                        <li key={idx} style={{ lineHeight: '1.4' }}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
