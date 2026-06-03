import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  IExerciseAttemptRepository,
  AccuracyStats,
  GlobalAccuracyStat,
} from '../../../domain/repositories/exercise-attempt.repository.interface';
import { ExerciseAttempt } from '../../../domain/entities/exercise-attempt.entity';
import { ExerciseAttemptDocument } from '../schemas/exercise-attempt.schema';
import { ExerciseAttemptMapper } from '../mappers/exercise-attempt.mapper';

@Injectable()
export class MongoExerciseAttemptRepository implements IExerciseAttemptRepository {
  constructor(
    @InjectModel('ExerciseAttempt')
    private readonly model: Model<ExerciseAttemptDocument>,
  ) {}

  async create(data: Omit<ExerciseAttempt, 'id' | 'created_at'>): Promise<ExerciseAttempt> {
    const doc = await this.model.create({
      ...data,
      user_id: new Types.ObjectId(data.user_id),
      exercise_id: new Types.ObjectId(data.exercise_id),
    });
    return ExerciseAttemptMapper.toDomain(doc.toObject());
  }

  async findByUserId(userId: string): Promise<ExerciseAttempt[]> {
    const docs = await this.model
      .find({ user_id: new Types.ObjectId(userId) })
      .sort({ created_at: -1 })
      .lean()
      .exec();
    return docs.map(ExerciseAttemptMapper.toDomain);
  }

  async findByUserAndExercise(userId: string, exerciseId: string): Promise<ExerciseAttempt[]> {
    const docs = await this.model
      .find({
        user_id: new Types.ObjectId(userId),
        exercise_id: new Types.ObjectId(exerciseId),
      })
      .sort({ created_at: -1 })
      .lean()
      .exec();
    return docs.map(ExerciseAttemptMapper.toDomain);
  }

  async findHighAccuracy(minAccuracy: number): Promise<ExerciseAttempt[]> {
    const docs = await this.model
      .find({ accuracy: { $gte: minAccuracy } })
      .sort({ accuracy: -1 })
      .lean()
      .exec();
    return docs.map(ExerciseAttemptMapper.toDomain);
  }

  async getAccuracyStatsByUser(userId: string): Promise<AccuracyStats> {
    const result = await this.model.aggregate([
      { $match: { user_id: new Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$user_id',
          avgAccuracy: { $avg: '$accuracy' },
          totalAttempts: { $sum: 1 },
        },
      },
    ]);

    if (!result.length) return { avgAccuracy: 0, totalAttempts: 0 };

    return {
      avgAccuracy: parseFloat(result[0].avgAccuracy.toFixed(2)),
      totalAttempts: result[0].totalAttempts,
    };
  }

  async getGlobalAccuracyStats(): Promise<GlobalAccuracyStat[]> {
    const result = await this.model.aggregate([
      {
        $group: {
          _id: '$user_id',
          avgAccuracy: { $avg: '$accuracy' },
          totalAttempts: { $sum: 1 },
        },
      },
      { $sort: { avgAccuracy: -1 } },
    ]);

    return result.map((r) => ({
      userId: r._id.toString(),
      avgAccuracy: parseFloat(r.avgAccuracy.toFixed(2)),
      totalAttempts: r.totalAttempts,
    }));
  }
}