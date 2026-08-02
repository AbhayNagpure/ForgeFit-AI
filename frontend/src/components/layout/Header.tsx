import React from 'react';

type HeaderProps = {
  activeTab: string;
};

export function Header({ activeTab }: HeaderProps) {
  return (
    <header className="page-header">
      <h1 className="page-title">
        {activeTab === 'dashboard' && 'Dashboard'}
        {activeTab === 'workouts' && 'Workouts'}
        {activeTab === 'nutrition' && 'Nutrition Tracker'}
        {activeTab === 'coach' && 'AI Personal Coach'}
        {activeTab === 'settings' && 'Settings'}
      </h1>
      <p className="page-subtitle">
        {activeTab === 'dashboard' && 'Welcome back. Here is your overview for today.'}
        {activeTab === 'workouts' && 'Log and track your training sessions.'}
        {activeTab === 'nutrition' && 'Track your daily macros and calories.'}
        {activeTab === 'coach' && 'Ask your AI coach to analyze your data and build routines.'}
        {activeTab === 'settings' && 'Manage your account and preferences.'}
      </p>
    </header>
  );
}
