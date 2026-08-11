import { useState } from 'react';

export function AddWorkout() {
  const [workoutType, setWorkoutType] = useState('strength');

  return (
    <div className="card add-workout-container">
      <h2 className="section-title">Log New Workout</h2>
      
      <form className="workout-form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label>Workout Name</label>
          <input type="text" placeholder="e.g., Heavy Push Day" className="form-control" />
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
            <input type="number" placeholder="45" className="form-control" />
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
