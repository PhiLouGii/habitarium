export interface Habit {
  id: string;
  title: string;
  description: string;
  type: 'good' | 'bad';
  frequency: 'daily' | 'weekly' | 'monthly';
  userId: string;
  createdAt: Date;
  // Add other properties as needed
}