import React from 'react';

const MOCK_MACROS = [
  { label: 'Protein', current: 120, target: 160, unit: 'g', color: '#3b82f6' }, // Blue
  { label: 'Carbs', current: 200, target: 250, unit: 'g', color: '#eab308' }, // Yellow
  { label: 'Fats', current: 45, target: 60, unit: 'g', color: '#ef4444' }, // Red
];

const MOCK_MEALS = [
  { id: 1, name: 'Oatmeal & Protein Shake', time: '8:00 AM', calories: 450, macros: '40p / 50c / 10f' },
  { id: 2, name: 'Grilled Chicken Salad', time: '1:00 PM', calories: 350, macros: '45p / 15c / 12f' },
  { id: 3, name: 'Greek Yogurt & Almonds', time: '4:30 PM', calories: 220, macros: '15p / 10c / 14f' },
];

export function Nutrition() {
  const totalCalories = MOCK_MEALS.reduce((acc, meal) => acc + meal.calories, 0);

  return (
    <div className="dashboard-layout">
      {/* Top Stats Overview */}
      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-label">Total Calories</div>
          <div className="stat-value">{totalCalories}</div>
          <div className="stat-change" style={{ color: 'var(--text-secondary)' }}>Target: 2,200 kcal</div>
        </div>
        
        {MOCK_MACROS.map((macro, i) => (
          <div key={i} className="card stat-card">
            <div className="stat-label">{macro.label}</div>
            <div className="stat-value">{macro.current}{macro.unit}</div>
            <div className="macro-progress-bar">
              <div 
                className="macro-fill" 
                style={{ 
                  width: `${(macro.current / macro.target) * 100}%`,
                  backgroundColor: macro.color 
                }}
              ></div>
            </div>
            <div className="stat-change" style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
              {macro.target - macro.current}{macro.unit} remaining
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-columns">
        {/* Log Meal Form Placeholder */}
        <div className="card">
          <h2 className="section-title">Log a Meal</h2>
          <form className="workout-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label>Meal Description</label>
              <input type="text" placeholder="e.g., 2 eggs and toast" className="form-control" />
            </div>
            <div className="form-actions" style={{ borderTop: 'none', paddingTop: 0 }}>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Analyze with AI
              </button>
            </div>
          </form>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '12px', textAlign: 'center' }}>
            Our AI will automatically estimate calories and macros based on your description.
          </p>
        </div>

        {/* Today's Meals List */}
        <div className="card">
          <h2 className="section-title">Today's Log</h2>
          <div className="workout-list">
            {MOCK_MEALS.map((meal) => (
              <div key={meal.id} className="workout-item">
                <div className="workout-info">
                  <div className="workout-name">{meal.name}</div>
                  <div className="workout-date">{meal.time} • {meal.macros}</div>
                </div>
                <div className="workout-duration">{meal.calories} kcal</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
