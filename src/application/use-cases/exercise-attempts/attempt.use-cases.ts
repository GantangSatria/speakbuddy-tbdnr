import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from '../../../shared/injection-tokens';
import type {
  IExerciseAttemptRepository,
  AccuracyStats,
  GlobalAccuracyStat,
} from '../../../domain/repositories/exercise-attempt.repository.interface';
import { ExerciseAttempt } from '../../../domain/entities/exercise-attempt.entity';

// Create Attempt
export interface CreateAttemptInput {
  userId: string;
  exercise_id: string;
  item_number: number;
  transcribed_text?: string;
  target_text: string;
  accuracy: number;
  ai_feedback?: string;
  ai_model?: string;
  duration_seconds?: number;
}

@Injectable()
export class CreateAttemptUseCase {
  constructor(
    @Inject(TOKENS.ATTEMPT_REPO) private readonly repo: IExerciseAttemptRepository,
  ) {}

  async execute(input: CreateAttemptInput): Promise<ExerciseAttempt> {
    return this.repo.create({
      user_id: input.userId,
      exercise_id: input.exercise_id,
      item_number: input.item_number,
      transcribed_text: input.transcribed_text,
      target_text: input.target_text,
      accuracy: input.accuracy,
      ai_feedback: input.ai_feedback,
      ai_model: input.ai_model,
      duration_seconds: input.duration_seconds,
    });
  }
}

// Get My Attempts
@Injectable()
export class GetMyAttemptsUseCase {
  constructor(
    @Inject(TOKENS.ATTEMPT_REPO) private readonly repo: IExerciseAttemptRepository,
  ) {}

  async execute(userId: string, exerciseId?: string): Promise<ExerciseAttempt[]> {
    if (exerciseId) {
      return this.repo.findByUserAndExercise(userId, exerciseId);
    }
    return this.repo.findByUserId(userId);
  }
}

// Get Accuracy Stats
@Injectable()
export class GetAccuracyStatsUseCase {
  constructor(
    @Inject(TOKENS.ATTEMPT_REPO) private readonly repo: IExerciseAttemptRepository,
  ) {}

  async execute(userId: string): Promise<AccuracyStats> {
    return this.repo.getAccuracyStatsByUser(userId);
  }
}

// Get Global Stats (untuk leaderboard)
@Injectable()
export class GetGlobalStatsUseCase {
  constructor(
    @Inject(TOKENS.ATTEMPT_REPO) private readonly repo: IExerciseAttemptRepository,
  ) {}

  async execute(): Promise<GlobalAccuracyStat[]> {
    return this.repo.getGlobalAccuracyStats();
  }
}