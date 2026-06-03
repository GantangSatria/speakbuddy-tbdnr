import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TOKENS } from '../../../shared/injection-tokens';
import type { IExerciseRepository, ExerciseFilter } from '../../../domain/repositories/exercise.repository.interface';
import { Exercise, ExerciseItem, ExerciseLevel } from '../../../domain/entities/exercise.entity';

// Create
export interface CreateExerciseInput {
  title: string;
  level: ExerciseLevel;
  category: string;
  description?: string;
  items: ExerciseItem[];
}

@Injectable()
export class CreateExerciseUseCase {
  constructor(
    @Inject(TOKENS.EXERCISE_REPO) private readonly repo: IExerciseRepository,
  ) {}

  async execute(input: CreateExerciseInput): Promise<Exercise> {
    return this.repo.create(input);
  }
}

// Get All
@Injectable()
export class GetExercisesUseCase {
  constructor(
    @Inject(TOKENS.EXERCISE_REPO) private readonly repo: IExerciseRepository,
  ) {}

  async execute(filter?: ExerciseFilter): Promise<Exercise[]> {
    return this.repo.findAll(filter);
  }
}

// Get By ID
@Injectable()
export class GetExerciseByIdUseCase {
  constructor(
    @Inject(TOKENS.EXERCISE_REPO) private readonly repo: IExerciseRepository,
  ) {}

  async execute(id: string): Promise<Exercise> {
    const exercise = await this.repo.findById(id);
    if (!exercise) throw new NotFoundException('Latihan tidak ditemukan');
    return exercise;
  }
}

// Update
export interface UpdateExerciseInput {
  id: string;
  title?: string;
  level?: ExerciseLevel;
  category?: string;
  description?: string;
  items?: ExerciseItem[];
}

@Injectable()
export class UpdateExerciseUseCase {
  constructor(
    @Inject(TOKENS.EXERCISE_REPO) private readonly repo: IExerciseRepository,
  ) {}

  async execute(input: UpdateExerciseInput): Promise<Exercise> {
    const { id, ...data } = input;
    const updated = await this.repo.update(id, data);
    if (!updated) throw new NotFoundException('Latihan tidak ditemukan');
    return updated;
  }
}

// Delete
@Injectable()
export class DeleteExerciseUseCase {
  constructor(
    @Inject(TOKENS.EXERCISE_REPO) private readonly repo: IExerciseRepository,
  ) {}

  async execute(id: string): Promise<{ message: string }> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundException('Latihan tidak ditemukan');
    await this.repo.delete(id);
    return { message: 'Latihan berhasil dihapus' };
  }
}