import { useAppContext } from '../../context/AppContext';

export function ProgressTracking() {
  const { userProfile } = useAppContext();

  return (
    <div className="dashboard-layout">
      {/* Historical Data Charts */}
      <div className="card chart-section">
        <h2 className="section-title">Volume Progression (Last 30 Days)</h2>
        <div className="chart-placeholder" style={{ height: '240px' }}>
          <div className="bar" style={{ height: '30%' }}></div>
          <div className="bar" style={{ height: '40%' }}></div>
          <div className="bar" style={{ height: '35%' }}></div>
          <div className="bar" style={{ height: '50%' }}></div>
          <div className="bar" style={{ height: '45%' }}></div>
          <div className="bar" style={{ height: '60%' }}></div>
          <div className="bar" style={{ height: '75%', backgroundColor: 'var(--accent)' }}></div>
        </div>
      </div>

      <div className="dashboard-columns">
        <div className="card">
          <h2 className="section-title">Weight Log</h2>
          {userProfile ? (
            <div className="workout-item">
              <div className="workout-info">
                <div className="workout-name">Initial Weigh-in</div>
                <div className="workout-date">Today</div>
              </div>
              <div className="workout-duration" style={{ color: 'var(--accent)' }}>{userProfile.weight} kg</div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>No data available.</p>
          )}
        </div>
        
        <div className="card">
          <h2 className="section-title">Personal Records (PRs)</h2>
          <div className="workout-list">
            <div className="workout-item">
              <div className="workout-info">
                <div className="workout-name">Bench Press</div>
                <div className="workout-date">Estimated 1RM</div>
              </div>
              <div className="workout-duration">-- kg</div>
            </div>
            <div className="workout-item">
              <div className="workout-info">
                <div className="workout-name">Squat</div>
                <div className="workout-date">Estimated 1RM</div>
              </div>
              <div className="workout-duration">-- kg</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
