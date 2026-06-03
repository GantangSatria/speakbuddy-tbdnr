export enum ExerciseLevel {
    BEGINNER = 'beginner',
    INTERMEDIATE = 'intermediate',
    ADVANCED = 'advanced',
}

export interface ExerciseItem {
  item_number: number;
  target_text: string;
  hint?: string;
}

export class Exercise {
  id!: string;
  title!: string;
  level!: ExerciseLevel;
  category!: string;
  description?: string;
  items!: ExerciseItem[];
  created_at?: Date;
  updated_at?: Date;
}