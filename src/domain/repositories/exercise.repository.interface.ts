import { Exercise } from '../entities/exercise.entity';

export interface ExerciseFilter {
  level?: string;
  category?: string;
}

export interface IExerciseRepository {
  findAll(filter?: ExerciseFilter): Promise<Exercise[]>;
  findById(id: string): Promise<Exercise | null>;
  create(data: Omit<Exercise, 'id' | 'created_at' | 'updated_at'>): Promise<Exercise>;
  update(id: string, data: Partial<Exercise>): Promise<Exercise | null>;
  delete(id: string): Promise<void>;
}