import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';

const EXERCISE_LIBRARY = [
  {
    name: 'Barbell Back Squat',
    target: 'Quads, Glutes, Core',
    tips: [
      'Keep your chest up and core braced.',
      'Initiate the movement by pushing your hips back.',
      'Drive through your mid-foot to stand up.'
    ],
    videoPlaceholder: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=600&auto=format&fit=crop'
  },
  {
    name: 'Bench Press',
    target: 'Chest, Shoulders, Triceps',
    tips: [
      'Plant your feet firmly on the ground.',
      'Maintain a slight arch in your lower back.',
      'Lower the bar to your mid-chest under control.'
    ],
    videoPlaceholder: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop'
  },
  {
    name: 'Conventional Deadlift',
    target: 'Hamstrings, Glutes, Back',
    tips: [
      'Keep the bar as close to your shins as possible.',
      'Ensure your spine remains neutral throughout.',
      'Squeeze your glutes at the top of the movement.'
    ],
    videoPlaceholder: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600&auto=format&fit=crop'
  }
];

export function Workouts() {
  const { addWorkout } = useAppContext();
  const [workoutName, setWorkoutName] = useState('');
  const [workoutType, setWorkoutType] = useState('strength');
  const [duration, setDuration] = useState('');
  const [selectedExercise, setSelectedExercise] = useState(EXERCISE_LIBRARY[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workoutName || !duration) return;

    addWorkout({
      name: workoutName,
      type: workoutType,
      duration: parseInt(duration, 10)
    });

    setWorkoutName('');
    setDuration('');
    alert('Workout saved!');
  };

  return (
    <div className="dashboard-layout">
      <div className="dashboard-columns">
        
        {/* Left Column: Log Workout */}
        <div className="card add-workout-container" style={{ maxWidth: '100%' }}>
          <h2 className="section-title">Log New Workout</h2>
          
          <form className="workout-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Workout Name</label>
              <input 
                type="text" 
                placeholder="e.g., Heavy Push Day" 
                className="form-control"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Type</label>
                <select 
                  className="form-control" 
                  value={workoutType}
                  onChange={(e) => setWorkoutType(e.target.value)}
                >
                  <option value="strength">Strength Training</option>
                  <option value="cardio">Cardio</option>
                  <option value="flexibility">Yoga / Flexibility</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Duration (minutes)</label>
                <input 
                  type="number" 
                  placeholder="45" 
                  className="form-control"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Notes / AI Prompt</label>
              <textarea 
                className="form-control" 
                rows={4} 
                placeholder="Felt weak on the bench press today. Ask AI to adjust my next chest day..."
              ></textarea>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Save Workout</button>
            </div>
          </form>
        </div>

        {/* Right Column: Exercise Library & Form */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 className="section-title">Exercise Library & Form Guide</h2>
          <p className="page-subtitle" style={{ marginBottom: '16px' }}>Master your form before lifting heavy.</p>

          <select 
            className="form-control" 
            style={{ marginBottom: '16px' }}
            value={selectedExercise.name}
            onChange={(e) => {
              const ex = EXERCISE_LIBRARY.find(ex => ex.name === e.target.value);
              if (ex) setSelectedExercise(ex);
            }}
          >
            {EXERCISE_LIBRARY.map((ex) => (
              <option key={ex.name} value={ex.name}>{ex.name}</option>
            ))}
          </select>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div 
              style={{ 
                width: '100%', 
                height: '200px', 
                backgroundColor: 'var(--bg-page)', 
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundImage: `url(${selectedExercise.videoPlaceholder})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Fake play button overlay */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '48px',
                height: '48px',
                backgroundColor: 'rgba(0,0,0,0.6)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '24px',
                border: '2px solid rgba(255,255,255,0.8)'
              }}>
                ▶
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '4px' }}>{selectedExercise.name}</h3>
              <p style={{ color: 'var(--accent)', fontSize: '0.8125rem', fontWeight: 600, margin: '0 0 12px 0' }}>Target: {selectedExercise.target}</p>
              
              <ul style={{ paddingLeft: '20px', margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedExercise.tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
