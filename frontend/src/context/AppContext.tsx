import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { apiRequest, setAuthToken, removeAuthToken, getAuthToken } from '../api';

export type Workout = {
  id: number;
  name: string;
  type: string;
  duration: number;
  date: string;
};

export type UserProfile = {
  id?: string | number;
  name?: string;
  email?: string;
  age: number | '';
  gender: string;
  weight: number | '';
  height: number | '';
  goal: string;
};

type AppContextType = {
  workouts: Workout[];
  addWorkout: (workout: Omit<Workout, 'id' | 'date'>) => Promise<void>;
  userProfile: UserProfile | null;
  saveProfile: (profile: UserProfile) => void;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  login: (token: string) => void;
  logout: () => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const fetchWorkouts = async () => {
    try {
      const data = await apiRequest('/workouts');
      setWorkouts(data.workouts || []);
    } catch (err) {
      console.error('Failed to fetch workouts:', err);
    }
  };

  const verifyAuth = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setIsLoadingAuth(false);
      setIsAuthenticated(false);
      return;
    }

    try {
      const data = await apiRequest('/auth/me');
      setUserProfile(data.user);
      setIsAuthenticated(true);
      fetchWorkouts();
    } catch (err) {
      console.error('Auth check failed:', err);
      removeAuthToken();
      setIsAuthenticated(false);
    } finally {
      setIsLoadingAuth(false);
    }
  }, []);

  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);

  const login = (token: string) => {
    setAuthToken(token);
    verifyAuth();
  };

  const logout = () => {
    removeAuthToken();
    setIsAuthenticated(false);
    setUserProfile(null);
    setWorkouts([]);
  };

  const addWorkout = async (newWorkout: Omit<Workout, 'id' | 'date'>) => {
    try {
      const data = await apiRequest('/workouts', {
        method: 'POST',
        body: JSON.stringify(newWorkout)
      });
      setWorkouts([data.workout, ...workouts]);
    } catch (err) {
      console.error('Failed to add workout:', err);
    }
  };

  const saveProfile = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  return (
    <AppContext.Provider value={{
      workouts,
      addWorkout,
      userProfile,
      saveProfile,
      isAuthenticated,
      isLoadingAuth,
      login,
      logout
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
