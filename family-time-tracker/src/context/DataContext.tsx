import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  Child, Activity, Achievement, Streak, Challenge, Routine, 
  DashboardData, ActivityCategory, TimeInterval, MicroMoment 
} from '../types';

interface DataContextType {
  data: DashboardData;
  addActivity: (activity: Omit<Activity, 'id'>) => void;
  addMicroMoment: (activityId: string, microMoment: Omit<MicroMoment, 'id'>) => void;
  updateStreak: (type: string, increment: boolean) => void;
  unlockAchievement: (achievementId: string) => void;
  updateChallengeProgress: (challengeId: string, progress: number) => void;
  addRoutine: (routine: Omit<Routine, 'id'>) => void;
  updateRoutine: (routineId: string, updates: Partial<Routine>) => void;
}

type ActionType = 
  | { type: 'ADD_ACTIVITY'; payload: Activity }
  | { type: 'ADD_MICRO_MOMENT'; payload: { activityId: string; microMoment: MicroMoment } }
  | { type: 'UPDATE_STREAK'; payload: { type: string; increment: boolean } }
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: string }
  | { type: 'UPDATE_CHALLENGE'; payload: { id: string; progress: number } }
  | { type: 'ADD_ROUTINE'; payload: Routine }
  | { type: 'UPDATE_ROUTINE'; payload: { id: string; updates: Partial<Routine> } };

const initialChildren: Child[] = [
  {
    id: '1',
    name: 'Logan',
    age: 11,
    interests: ['video games', 'sports', 'music'],
    skillProgresses: []
  },
  {
    id: '2',
    name: 'Carter',
    age: 9,
    interests: ['outdoor activities', 'building', 'adventure'],
    skillProgresses: []
  },
  {
    id: '3',
    name: 'Blake',
    age: 7,
    interests: ['art', 'stories', 'imaginative play'],
    skillProgresses: []
  },
  {
    id: '4',
    name: 'Emma',
    age: 5,
    interests: ['dolls', 'princess play', 'singing'],
    skillProgresses: []
  }
];

const initialAchievements: Achievement[] = [
  {
    id: 'consistency-1',
    name: 'Daily Connector',
    description: 'Spend time with each child for 7 consecutive days',
    category: 'consistency',
    icon: '🔗',
    requirement: '7 day streak with all children',
    progress: 0
  },
  {
    id: 'quality-1',
    name: 'Quality Champion',
    description: 'Achieve 5-star rating on 10 activities',
    category: 'quality',
    icon: '⭐',
    requirement: '10 five-star activities',
    progress: 0
  },
  {
    id: 'creativity-1',
    name: 'Adventure Seeker',
    description: 'Complete activities in all 6 categories',
    category: 'creativity',
    icon: '🌟',
    requirement: 'All activity categories',
    progress: 0
  },
  {
    id: 'milestone-1',
    name: 'Century Club',
    description: 'Log 100 hours of family time',
    category: 'milestone',
    icon: '💯',
    requirement: '100 hours total',
    progress: 0
  }
];

const initialStreaks: Streak[] = [
  {
    type: 'daily-connection',
    current: 0,
    longest: 0,
    lastUpdate: new Date()
  },
  {
    type: 'quality-time',
    current: 0,
    longest: 0,
    lastUpdate: new Date()
  },
  {
    type: 'all-children',
    current: 0,
    longest: 0,
    lastUpdate: new Date()
  }
];

const initialChallenges: Challenge[] = [
  {
    id: 'monthly-1',
    name: 'December Connection Challenge',
    description: 'Spend 40 hours with children this month',
    target: 40,
    progress: 0,
    startDate: new Date(2024, 11, 1),
    endDate: new Date(2024, 11, 31),
    reward: 'Special family movie night',
    completed: false
  }
];

const initialData: DashboardData = {
  children: initialChildren,
  activities: [],
  achievements: initialAchievements,
  streaks: initialStreaks,
  challenges: initialChallenges,
  routines: [],
  weeklyInsights: []
};

function dataReducer(state: DashboardData, action: ActionType): DashboardData {
  switch (action.type) {
    case 'ADD_ACTIVITY':
      return {
        ...state,
        activities: [...state.activities, action.payload]
      };
    
    case 'ADD_MICRO_MOMENT':
      return {
        ...state,
        activities: state.activities.map(activity => 
          activity.id === action.payload.activityId
            ? {
                ...activity,
                microMoments: [...(activity.microMoments || []), action.payload.microMoment]
              }
            : activity
        )
      };
    
    case 'UPDATE_STREAK':
      return {
        ...state,
        streaks: state.streaks.map(streak =>
          streak.type === action.payload.type
            ? {
                ...streak,
                current: action.payload.increment ? streak.current + 1 : 0,
                longest: action.payload.increment && streak.current + 1 > streak.longest 
                  ? streak.current + 1 
                  : streak.longest,
                lastUpdate: new Date()
              }
            : streak
        )
      };
    
    case 'UNLOCK_ACHIEVEMENT':
      return {
        ...state,
        achievements: state.achievements.map(achievement =>
          achievement.id === action.payload
            ? { ...achievement, unlockedAt: new Date(), progress: 100 }
            : achievement
        )
      };
    
    case 'UPDATE_CHALLENGE':
      return {
        ...state,
        challenges: state.challenges.map(challenge =>
          challenge.id === action.payload.id
            ? { 
                ...challenge, 
                progress: action.payload.progress,
                completed: action.payload.progress >= challenge.target
              }
            : challenge
        )
      };
    
    case 'ADD_ROUTINE':
      return {
        ...state,
        routines: [...state.routines, action.payload]
      };
    
    case 'UPDATE_ROUTINE':
      return {
        ...state,
        routines: state.routines.map(routine =>
          routine.id === action.payload.id
            ? { ...routine, ...action.payload.updates }
            : routine
        )
      };
    
    default:
      return state;
  }
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, dispatch] = useReducer(dataReducer, initialData);

  const addActivity = (activityData: Omit<Activity, 'id'>) => {
    const activity: Activity = {
      ...activityData,
      id: uuidv4()
    };
    dispatch({ type: 'ADD_ACTIVITY', payload: activity });
  };

  const addMicroMoment = (activityId: string, microMomentData: Omit<MicroMoment, 'id'>) => {
    const microMoment: MicroMoment = {
      ...microMomentData,
      id: uuidv4()
    };
    dispatch({ type: 'ADD_MICRO_MOMENT', payload: { activityId, microMoment } });
  };

  const updateStreak = (type: string, increment: boolean) => {
    dispatch({ type: 'UPDATE_STREAK', payload: { type, increment } });
  };

  const unlockAchievement = (achievementId: string) => {
    dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: achievementId });
  };

  const updateChallengeProgress = (challengeId: string, progress: number) => {
    dispatch({ type: 'UPDATE_CHALLENGE', payload: { id: challengeId, progress } });
  };

  const addRoutine = (routineData: Omit<Routine, 'id'>) => {
    const routine: Routine = {
      ...routineData,
      id: uuidv4()
    };
    dispatch({ type: 'ADD_ROUTINE', payload: routine });
  };

  const updateRoutine = (routineId: string, updates: Partial<Routine>) => {
    dispatch({ type: 'UPDATE_ROUTINE', payload: { id: routineId, updates } });
  };

  return (
    <DataContext.Provider value={{
      data,
      addActivity,
      addMicroMoment,
      updateStreak,
      unlockAchievement,
      updateChallengeProgress,
      addRoutine,
      updateRoutine
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};