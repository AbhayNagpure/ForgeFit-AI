import { CircularTracer, ProgressBar } from '../../components/ui/Progress';

export function Nutrition() {
  return (
    <div className="dashboard-layout">
      {/* Metrics Grid */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        
        {/* Daily Energy Tracer */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 className="section-title" style={{ width: '100%', textAlign: 'left' }}>Energy Balance</h2>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0' }}>
            <CircularTracer value={1850} max={2400} label="kcal" color="var(--accent)" />
          </div>
          <div style={{ display: 'flex', gap: '24px', width: '100%', justifyContent: 'center', fontSize: '0.8125rem' }}>
            <div><strong style={{ color: 'var(--text-secondary)' }}>Burned:</strong> 2,850</div>
            <div><strong style={{ color: 'var(--text-secondary)' }}>Eaten:</strong> 1,850</div>
          </div>
        </div>

        {/* Macros */}
        <div className="card">
          <h2 className="section-title">Macronutrients</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', alignItems: 'center', height: '100%' }}>
            <div style={{ transform: 'scale(0.85)', transformOrigin: 'center' }}>
              <CircularTracer value={120} max={160} label="Pro" color="#3b82f6" />
            </div>
            <div style={{ transform: 'scale(0.85)', transformOrigin: 'center' }}>
              <CircularTracer value={200} max={250} label="Carb" color="#eab308" />
            </div>
            <div style={{ transform: 'scale(0.85)', transformOrigin: 'center' }}>
              <CircularTracer value={55} max={70} label="Fat" color="#ef4444" />
            </div>
          </div>
        </div>

        {/* Daily Targets */}
        <div className="card">
          <h2 className="section-title">Daily Targets</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
            <ProgressBar label="Steps" current={8500} target={10000} unit="" color="var(--accent)" />
            <ProgressBar label="Water" current={2.1} target={3.0} unit="L" color="#06b6d4" />
            <ProgressBar label="Sleep" current={6.5} target={8.0} unit="hrs" color="#8b5cf6" />
            <ProgressBar label="Active Time" current={45} target={60} unit="min" color="#f97316" />
          </div>
        </div>
      </div>

      <div className="dashboard-columns">
        <div className="card">
          <h2 className="section-title">Log a Meal</h2>
          <form className="workout-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label>Food Item</label>
              <input type="text" className="form-control" placeholder="e.g. Grilled Chicken Salad" />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Calories (kcal)</label>
                <input type="number" className="form-control" placeholder="350" />
              </div>
              <div className="form-group">
                <label>Protein (g)</label>
                <input type="number" className="form-control" placeholder="30" />
              </div>
            </div>

            <button type="button" className="btn btn-primary" style={{ marginTop: '16px', width: '100%' }}>
              Add to Daily Log
            </button>
          </form>
        </div>

        <div className="card">
          <h2 className="section-title">Today's Meals</h2>
          <div className="workout-list">
            <div className="workout-item">
              <div className="workout-info">
                <div className="workout-name">Oatmeal & Protein Shake</div>
                <div className="workout-date">Breakfast</div>
              </div>
              <div className="workout-duration">450 kcal</div>
            </div>
            <div className="workout-item">
              <div className="workout-info">
                <div className="workout-name">Chicken Breast & Rice</div>
                <div className="workout-date">Lunch</div>
              </div>
              <div className="workout-duration">650 kcal</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
