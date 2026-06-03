import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TOKENS } from '../shared/injection-tokens';
import { Exercise, ExerciseSchema } from '../infrastructure/database/schemas/exercise.schema';
import { MongoExerciseRepository } from '../infrastructure/database/repositories/mongo-exercise.repository';
import {
  CreateExerciseUseCase,
  GetExercisesUseCase,
  GetExerciseByIdUseCase,
  UpdateExerciseUseCase,
  DeleteExerciseUseCase,
} from '../application/use-cases/exercises/exercise.use-cases';
import { ExercisesController } from '../presentation/controllers/exercises.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Exercise', schema: ExerciseSchema }]),
  ],
  providers: [
    // Repository binding
    MongoExerciseRepository,
    { provide: TOKENS.EXERCISE_REPO, useExisting: MongoExerciseRepository },

    // Use Cases
    CreateExerciseUseCase,
    GetExercisesUseCase,
    GetExerciseByIdUseCase,
    UpdateExerciseUseCase,
    DeleteExerciseUseCase,
  ],
  controllers: [ExercisesController],
})
export class ExercisesModule {}