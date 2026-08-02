import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';

export function AddWorkout() {
  const { addWorkout } = useAppContext();
  const [workoutName, setWorkoutName] = useState('');
  const [workoutType, setWorkoutType] = useState('strength');
  const [duration, setDuration] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workoutName || !duration) return;

    addWorkout({
      name: workoutName,
      type: workoutType,
      duration: parseInt(duration, 10)
    });

    // Reset form
    setWorkoutName('');
    setDuration('');
    alert('Workout saved!');
  };

  return (
    <div className="card add-workout-container">
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
          <button type="button" className="btn btn-secondary">Cancel</button>
          <button type="submit" className="btn btn-primary">Save Workout</button>
        </div>
      </form>
    </div>
  );
}
