import './index.css';
import { Dashboard } from './components/Dashboard';

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

        {/* Dynamic Content */}
        <Dashboard />
      </main>
    </div>
  );
}

export default App;
