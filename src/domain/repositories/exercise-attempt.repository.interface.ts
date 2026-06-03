import { ExerciseAttempt } from '../entities/exercise-attempt.entity';

export interface AccuracyStats {
  avgAccuracy: number;
  totalAttempts: number;
}

export interface GlobalAccuracyStat {
  userId: string;
  avgAccuracy: number;
  totalAttempts: number;
}

export interface IExerciseAttemptRepository {
  create(data: Omit<ExerciseAttempt, 'id' | 'created_at'>): Promise<ExerciseAttempt>;
  findByUserId(userId: string): Promise<ExerciseAttempt[]>;
  findByUserAndExercise(userId: string, exerciseId: string): Promise<ExerciseAttempt[]>;
  findHighAccuracy(minAccuracy: number): Promise<ExerciseAttempt[]>;
  getAccuracyStatsByUser(userId: string): Promise<AccuracyStats>;
  getGlobalAccuracyStats(): Promise<GlobalAccuracyStat[]>;
}