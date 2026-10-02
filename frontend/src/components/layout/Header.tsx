

type HeaderProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export function Header({ activeTab }: HeaderProps) {
  if (activeTab === 'coach') return null;

  return (
    <header className="page-header">
      <div>
        <h1 className="page-title">
          {activeTab === 'today' && "Today's Activity"}
          {activeTab === 'profile' && 'Profile & Settings'}
          {activeTab === 'workouts' && 'Training Library'}
          {activeTab === 'progress' && 'Progress Tracking'}
          {activeTab === 'nutrition' && 'Nutrition Tracker'}
          {activeTab === 'coach' && 'AI Personal Coach'}
        </h1>
        <p className="page-subtitle">
          {activeTab === 'today' && 'Your training, recovery, and nutrition—without invented numbers.'}
          {activeTab === 'profile' && 'Manage your account, settings, and baseline metrics.'}
          {activeTab === 'workouts' && 'Study movements and review the sessions you have logged.'}
          {activeTab === 'progress' && 'Trends calculated from your actual history.'}
          {activeTab === 'nutrition' && 'Track your daily macros and calories.'}
          {activeTab === 'coach' && 'Ask your AI coach to analyze your data and build routines.'}
        </p>
      </div>

    </header>
  );
}
