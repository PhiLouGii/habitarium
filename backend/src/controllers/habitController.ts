import { Request, Response } from 'express';
import Habit, { IHabit } from '../models/Habit';

export const createHabit = async (req: Request, res: Response) => {
  try {
    const { name, type, frequency } = req.body;
    const habit = new Habit({ 
      userId: req.user._id, 
      name, 
      type,
      frequency
    });
    
    await habit.save();
    res.status(201).json(habit);
  } catch (error) {
    res.status(400).json({ error: 'Habit creation failed' });
  }
};

export const logHabit = async (req: Request, res: Response) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit || !habit.userId.equals(req.user._id)) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const existingLog = habit.logs.some(log => 
      new Date(log.date).setHours(0,0,0,0) === today.getTime()
    );

    if (existingLog) return res.status(400).json({ error: 'Already logged today' });

    habit.logs.push({ 
      date: new Date(),
      status: req.body.status
    });

    // Streak calculation logic
    if ((req.body.status === 'done' && habit.type === 'good') || 
        (req.body.status === 'resisted' && habit.type === 'bad')) {
      habit.streak += 1;
    } else {
      habit.streak = 0;
    }

    await habit.save();
    res.json(habit);
  } catch (error) {
    res.status(500).json({ error: 'Failed to log habit' });
  }
};

export const getDashboardData = async (req: Request, res: Response) => {
  try {
    const habits = await Habit.find({ userId: req.user._id });
    const goodHabits = habits.filter(h => h.type === 'good');
    const badHabits = habits.filter(h => h.type === 'bad');
    
    res.json({
      goodHabits,
      badHabits,
      totalGoodStreak: goodHabits.reduce((sum, h) => sum + h.streak, 0),
      totalResistance: badHabits.reduce((sum, h) => sum + h.streak, 0)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get dashboard data' });
  }
};