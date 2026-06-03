export class ExerciseAttempt {
  id!: string;
  user_id!: string;
  exercise_id!: string;
  item_number!: number;
  transcribed_text?: string;
  target_text!: string;
  accuracy!: number;
  ai_feedback?: string;
  ai_model?: string;
  duration_seconds?: number;
  created_at?: Date;
}