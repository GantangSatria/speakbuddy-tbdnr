import { ExerciseAttempt } from '../../../domain/entities/exercise-attempt.entity';

export class ExerciseAttemptMapper {
  static toDomain(doc: any): ExerciseAttempt {
    const a = new ExerciseAttempt();
    a.id = doc._id.toString();
    a.user_id = doc.user_id.toString();
    a.exercise_id = doc.exercise_id.toString();
    a.item_number = doc.item_number;
    a.transcribed_text = doc.transcribed_text;
    a.target_text = doc.target_text;
    a.accuracy = doc.accuracy;
    a.ai_feedback = doc.ai_feedback;
    a.ai_model = doc.ai_model;
    a.duration_seconds = doc.duration_seconds;
    a.created_at = doc.created_at;
    return a;
  }
}