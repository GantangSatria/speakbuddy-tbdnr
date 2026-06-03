import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TOKENS } from '../shared/injection-tokens';
import {
  ExerciseAttempt,
  ExerciseAttemptSchema,
} from '../infrastructure/database/schemas/exercise-attempt.schema';
import { MongoExerciseAttemptRepository } from '../infrastructure/database/repositories/mongo-exercise-attempt.repository';
import {
  CreateAttemptUseCase,
  GetMyAttemptsUseCase,
  GetAccuracyStatsUseCase,
  GetGlobalStatsUseCase,
} from '../application/use-cases/exercise-attempts/attempt.use-cases';
import { EvaluateAttemptUseCase } from '../application/use-cases/exercise-attempts/evaluate-attempt.use-case';
import { GoogleSttService } from '../infrastructure/services/stt/google-stt.service';
import { GeminiAiService } from '../infrastructure/services/ai/gemini-ai.service';
import { ExerciseAttemptsController } from '../presentation/controllers/exercise-attempts.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'ExerciseAttempt', schema: ExerciseAttemptSchema },
    ]),
  ],
  providers: [
    // Repository binding
    MongoExerciseAttemptRepository,
    { provide: TOKENS.ATTEMPT_REPO, useExisting: MongoExerciseAttemptRepository },

    // Use Cases
    CreateAttemptUseCase,
    GetMyAttemptsUseCase,
    GetAccuracyStatsUseCase,
    GetGlobalStatsUseCase,
    EvaluateAttemptUseCase,
    { provide: 'ISTTProvider', useClass: GoogleSttService },
    { provide: 'IAIProvider', useClass: GeminiAiService },
  ],
  controllers: [ExerciseAttemptsController],
})
export class ExerciseAttemptsModule {}