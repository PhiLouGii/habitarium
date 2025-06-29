import mongoose, { Document } from 'mongoose';

export interface IHabitLog {
  date: Date;
  status: 'done' | 'resisted' | 'slipped';
}

export interface IHabit extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  name: string;
  type: 'good' | 'bad';
  streak: number;
  frequency: 'daily' | 'weekly';
  logs: IHabitLog[];
}

const HabitSchema = new mongoose.Schema<IHabit>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['good', 'bad'], required: true },
  streak: { type: Number, default: 0 },
  frequency: { type: String, enum: ['daily', 'weekly'], default: 'daily' },
  logs: [{
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['done', 'resisted', 'slipped'] }
  }]
});

export default mongoose.model<IHabit>('Habit', HabitSchema);