import { createContext, useContext, useState, useEffect } from 'react';
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
  id?: string;
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
  addWorkout: (workout: Omit<Workout, 'id' | 'date'>) => void;
  userProfile: UserProfile | null;
  saveProfile: (profile: UserProfile) => void;
  isAuthenticated: boolean;
  login: (token: string, user: any) => void;
  logout: () => void;
  isLoadingAuth: boolean;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const data = await apiRequest('/auth/me');
          if (data.user) {
            setIsAuthenticated(true);
            setUserProfile((prev) => ({
              ...(prev || { age: '', gender: '', weight: '', height: '', goal: '' }),
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              goal: data.user.goal || 'Build Muscle'
            }));
            
            // Fetch workouts
            const workoutsData = await apiRequest('/workouts');
            setWorkouts(workoutsData);
          }
        } catch (err) {
          console.error("Auth check failed:", err);
          removeAuthToken();
        }
      }
      setIsLoadingAuth(false);
    };
    checkAuth();
  }, []);

  const login = async (token: string, user: any) => {
    setAuthToken(token);
    setIsAuthenticated(true);
    setUserProfile((prev) => ({
      ...(prev || { age: '', gender: '', weight: '', height: '', goal: '' }),
      id: user.id,
      name: user.name,
      email: user.email,
    }));
    
    try {
      const workoutsData = await apiRequest('/workouts');
      setWorkouts(workoutsData);
    } catch (err) {
      console.error("Failed to load workouts:", err);
    }
  };

  const logout = () => {
    removeAuthToken();
    setIsAuthenticated(false);
    setUserProfile(null);
    setWorkouts([]);
  };

  const addWorkout = async (newWorkout: Omit<Workout, 'id' | 'date'>) => {
    try {
      const savedWorkout = await apiRequest('/workouts', {
        method: 'POST',
        body: JSON.stringify(newWorkout)
      });
      setWorkouts([savedWorkout, ...workouts]);
    } catch (err) {
      console.error("Failed to save workout:", err);
    }
  };

  const saveProfile = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  return (
    <AppContext.Provider value={{ workouts, addWorkout, userProfile, saveProfile, isAuthenticated, login, logout, isLoadingAuth }}>
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
