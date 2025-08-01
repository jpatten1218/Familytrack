export interface Child {
  id: string;
  name: string;
  age: number;
  avatar?: string;
  interests: string[];
  skillProgresses: SkillProgress[];
}

export interface Activity {
  id: string;
  childId: string;
  siblingIds?: string[];
  category: ActivityCategory;
  timeSpent: TimeInterval;
  qualityRating: number; // 1-5 stars
  date: Date;
  notes?: string;
  microMoments?: MicroMoment[];
}

export type ActivityCategory = 
  | 'Video Games/Hang'
  | 'Outdoors'
  | 'Meal'
  | 'Date'
  | 'Adventure'
  | 'Important Talk';

export type TimeInterval = 
  | '15min'
  | '30min'
  | '1hour'
  | '3hours'
  | 'all-day';

export interface MicroMoment {
  id: string;
  type: MicroMomentType;
  duration: number; // in minutes
  quality: number; // 1-5 stars
  timestamp: Date;
  notes?: string;
}

export type MicroMomentType =
  | 'breakfast'
  | 'car-ride'
  | 'bedtime'
  | 'homework-help'
  | 'quick-chat'
  | 'hug'
  | 'goodnight'
  | 'goodmorning';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  icon: string;
  requirement: string;
  unlockedAt?: Date;
  progress: number; // 0-100
}

export type AchievementCategory =
  | 'consistency'
  | 'creativity'
  | 'quality'
  | 'milestone';

export interface Streak {
  type: StreakType;
  current: number;
  longest: number;
  lastUpdate: Date;
}

export type StreakType = 
  | 'daily-connection'
  | 'quality-time'
  | 'all-children';

export interface Challenge {
  id: string;
  name: string;
  description: string;
  target: number;
  progress: number;
  startDate: Date;
  endDate: Date;
  reward: string;
  completed: boolean;
}

export interface SkillProgress {
  skill: string;
  level: number; // 1-10
  lastPracticed: Date;
  totalHours: number;
}

export interface Routine {
  id: string;
  name: string;
  type: RoutineType;
  timeSlot: string;
  participants: string[]; // child IDs
  qualityRating: number;
  lastCompleted: Date;
  streak: number;
}

export type RoutineType = 
  | 'morning'
  | 'evening'
  | 'mealtime'
  | 'bedtime';

export interface WeeklyInsight {
  week: string; // ISO week string
  totalTime: number;
  qualityAverage: number;
  topActivity: ActivityCategory;
  improvements: string[];
  recommendations: string[];
  childSpecificInsights: { [childId: string]: string };
}

export interface DashboardData {
  children: Child[];
  activities: Activity[];
  achievements: Achievement[];
  streaks: Streak[];
  challenges: Challenge[];
  routines: Routine[];
  weeklyInsights: WeeklyInsight[];
}

export type ViewMode = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface FilterOptions {
  childIds: string[];
  categories: ActivityCategory[];
  dateRange: {
    start: Date;
    end: Date;
  };
  minQuality?: number;
}