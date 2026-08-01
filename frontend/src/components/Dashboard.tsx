import React from 'react';

const MOCK_STATS = [
  { label: 'Workouts this week', value: '4', change: '+1 from last week' },
  { label: 'Active Calories', value: '2,450', change: '+12% from average' },
  { label: 'Current Streak', value: '12 Days', change: 'Personal best: 14' },
];

const MOCK_RECENT_WORKOUTS = [
  { id: 1, name: 'Upper Body Power', duration: '45 min', date: 'Today' },
  { id: 2, name: 'Leg Day Volume', duration: '60 min', date: 'Yesterday' },
  { id: 3, name: 'Active Recovery (Yoga)', duration: '30 min', date: '2 days ago' },
];

export function Dashboard() {
  return (
    <div className="dashboard-layout">
      {/* Quick Stats Grid */}
      <div className="stats-grid">
        {MOCK_STATS.map((stat, i) => (
          <div key={i} className="card stat-card">
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-change">{stat.change}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-columns">
        {/* Main Chart Area Placeholder */}
        <div className="card chart-section">
          <h2 className="section-title">Activity Overview</h2>
          <div className="chart-placeholder">
            <div className="bar" style={{ height: '40%' }}></div>
            <div className="bar" style={{ height: '70%' }}></div>
            <div className="bar" style={{ height: '30%' }}></div>
            <div className="bar" style={{ height: '90%', backgroundColor: 'var(--accent)' }}></div>
            <div className="bar" style={{ height: '50%' }}></div>
            <div className="bar" style={{ height: '20%' }}></div>
            <div className="bar" style={{ height: '60%' }}></div>
          </div>
        </div>

        {/* Recent Workouts List */}
        <div className="card recent-section">
          <h2 className="section-title">Recent Activity</h2>
          <div className="workout-list">
            {MOCK_RECENT_WORKOUTS.map((workout) => (
              <div key={workout.id} className="workout-item">
                <div className="workout-info">
                  <div className="workout-name">{workout.name}</div>
                  <div className="workout-date">{workout.date}</div>
                </div>
                <div className="workout-duration">{workout.duration}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
