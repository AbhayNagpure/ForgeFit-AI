import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { apiRequest, setAuthToken, removeAuthToken, getAuthToken } from '../api';

export type Workout = {
  id: string;
  name: string;
  type: string;
  duration: number;
  date: string;
  exercises?: Array<{
    id: string;
    name: string;
    sets: number;
    reps: number;
    weight?: number;
  }>;
};

export type PersonalRecord = {
  id: string;
  exerciseName: string;
  weight: number;
  reps?: number;
  date: string;
};

export type BodyMetric = {
  id: string;
  bodyFat?: number;
  chest?: number;
  arms?: number;
  waist?: number;
  thighs?: number;
  sleep?: number;
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
  dailyCalories?: number;
  dailyProtein?: number;
  experienceLevel?: string;
  equipment?: string;
  workoutDays?: number;
  nutritionLogs?: { id: string; foodName: string; calories: number; protein: number; carbs?: number; fat?: number; source: string; confidence?: number; date: string }[];
};

export type ProgressSummary = {
  currentStreak: number;
  totalWorkouts: number;
  totalMinutes: number;
  weightTrend: { current: number | null; change: number | null };
  weightHistory: Array<{ date: string; weight: number }>;
  weeklyMinutes: Array<{ label: string; minutes: number }>;
  personalRecords: PersonalRecord[];
  bodyMetrics: BodyMetric[];
};

type AppContextType = {
  workouts: Workout[];
  personalRecords: PersonalRecord[];
  bodyMetrics: BodyMetric[];
  addWorkout: (workout: Omit<Workout, 'id' | 'date'>) => Promise<void>;
  userProfile: UserProfile | null;
  saveProfile: (profile: UserProfile) => void;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  login: (token: string) => void;
  logout: () => void;
  fetchWorkouts: () => Promise<void>;
  fetchPersonalRecords: () => Promise<void>;
  fetchBodyMetrics: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  progressSummary: ProgressSummary | null;
  fetchProgressSummary: () => Promise<void>;
  isLoadingData: boolean;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>([]);
  const [bodyMetrics, setBodyMetrics] = useState<BodyMetric[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [progressSummary, setProgressSummary] = useState<ProgressSummary | null>(null);

  const fetchWorkouts = async () => {
    try {
      const data = await apiRequest<{ workouts: Workout[] }>('/workouts');
      setWorkouts(data.workouts || []);
    } catch (err) {
      console.error('Failed to fetch workouts:', err);
    }
  };

  const fetchPersonalRecords = async () => {
    try {
      const data = await apiRequest<PersonalRecord[]>('/personal-records');
      setPersonalRecords(data || []);
    } catch (err) {
      console.error('Failed to fetch PRs:', err);
    }
  };

  const fetchBodyMetrics = async () => {
    try {
      const data = await apiRequest<BodyMetric[]>('/body-metrics');
      setBodyMetrics(data || []);
    } catch (err) {
      console.error('Failed to fetch metrics:', err);
    }
  };

  const fetchProgressSummary = async () => {
    try {
      const data = await apiRequest<ProgressSummary>('/progress/summary');
      setProgressSummary(data);
    } catch (err) {
      console.error('Failed to fetch progress summary:', err);
    }
  };

  const fetchAppData = async () => {
    setIsLoadingData(true);
    await Promise.all([fetchWorkouts(), fetchPersonalRecords(), fetchBodyMetrics(), fetchProgressSummary()]);
    setIsLoadingData(false);
  };

  const verifyAuth = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setIsLoadingAuth(false);
      setIsAuthenticated(false);
      return;
    }

    try {
      const data = await apiRequest<{ user: UserProfile }>('/auth/me');
      setUserProfile(data.user);
      setIsAuthenticated(true);
      await fetchAppData();
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

  useEffect(() => {
    const handleUnauthorized = () => {
      setIsAuthenticated(false);
      setUserProfile(null);
    };
    window.addEventListener('forgefit:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('forgefit:unauthorized', handleUnauthorized);
  }, []);

  const login = (token: string) => {
    setAuthToken(token);
    verifyAuth();
  };

  const logout = () => {
    removeAuthToken();
    setIsAuthenticated(false);
    setUserProfile(null);
    setWorkouts([]);
    setPersonalRecords([]);
    setBodyMetrics([]);
    setProgressSummary(null);
  };

  const addWorkout = async (newWorkout: Omit<Workout, 'id' | 'date'>) => {
    try {
      const data = await apiRequest<{ workout: Workout }>('/workouts', {
        method: 'POST',
        body: JSON.stringify(newWorkout)
      });
      setWorkouts((current) => [data.workout, ...current]);
      await fetchProgressSummary();
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
      personalRecords,
      bodyMetrics,
      addWorkout,
      userProfile,
      saveProfile,
      isAuthenticated,
      isLoadingAuth,
      login,
      logout,
      fetchWorkouts,
      fetchPersonalRecords,
      fetchBodyMetrics,
      refreshProfile: verifyAuth,
      progressSummary,
      fetchProgressSummary,
      isLoadingData
    }}>
      {children}
    </AppContext.Provider>
  );
}

// oxlint-disable-next-line react/only-export-components -- colocated provider hook is the public context API
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
