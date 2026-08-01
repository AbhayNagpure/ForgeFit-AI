import './index.css';

function App() {
  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="brand">ForgeFit</div>
        
        <nav>
          <a href="#" className="nav-link active">Dashboard</a>
          <a href="#" className="nav-link">Workouts</a>
          <a href="#" className="nav-link">Nutrition</a>
          <a href="#" className="nav-link">Analytics</a>
          <a href="#" className="nav-link">Settings</a>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="page-header">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back. Here is your overview for today.</p>
        </header>

        {/* Example Content */}
        <div className="card">
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            We're building a highly professional, utilitarian interface. No gradients, no glowing AI blobs, just flat colors, sharp borders, and high contrast data density.
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
