export type HabitType = 'good' | 'bad';

export interface Habit {
  id: string;
  name: string;
  type: HabitType;
  streak: number;
  completions: (string | Date)[];
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  habits?: Habit[];  // <-- Add habits property here as optional
  // Add any other user properties you have
}
