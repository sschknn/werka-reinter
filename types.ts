
export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  projectId: string;
  timeSpentMinutes: number;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  description: string;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  isPro: boolean;
  stripeCustomerId?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface DailyLog {
  date: string;
  minutesSpent: number;
}
