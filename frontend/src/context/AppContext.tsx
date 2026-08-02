import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of our data
export type Workout = {
  id: number;
  name: string;
  type: string;
  duration: number;
  date: string;
};

type AppContextType = {
  workouts: Workout[];
  addWorkout: (workout: Omit<Workout, 'id' | 'date'>) => void;
};

// Create the Context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provide the Context
export function AppProvider({ children }: { children: ReactNode }) {
  // Start with some default mock data
  const [workouts, setWorkouts] = useState<Workout[]>([
    { id: 1, name: 'Upper Body Power', type: 'strength', duration: 45, date: 'Today' },
    { id: 2, name: 'Active Recovery (Yoga)', type: 'flexibility', duration: 30, date: 'Yesterday' }
  ]);

  const addWorkout = (newWorkout: Omit<Workout, 'id' | 'date'>) => {
    const workout: Workout = {
      ...newWorkout,
      id: Date.now(), // Generate a fake ID
      date: 'Just now'
    };
    // Add the new workout to the top of the list
    setWorkouts([workout, ...workouts]);
  };

  return (
    <AppContext.Provider value={{ workouts, addWorkout }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to easily use the Context
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
