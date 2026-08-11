

type HeaderProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export function Header({ activeTab }: HeaderProps) {
  return (
    <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <h1 className="page-title">
          {activeTab === 'profile' && 'Profile & Settings'}
          {activeTab === 'workouts' && 'Workouts'}
          {activeTab === 'progress' && 'Progress Tracking'}
          {activeTab === 'nutrition' && 'Nutrition Tracker'}
          {activeTab === 'coach' && 'AI Personal Coach'}
        </h1>
        <p className="page-subtitle">
          {activeTab === 'profile' && 'Manage your account, settings, and baseline metrics.'}
          {activeTab === 'workouts' && 'Log and track your training sessions.'}
          {activeTab === 'progress' && 'View your historical data and charts.'}
          {activeTab === 'nutrition' && 'Track your daily macros and calories.'}
          {activeTab === 'coach' && 'Ask your AI coach to analyze your data and build routines.'}
        </p>
      </div>

    </header>
  );
}
