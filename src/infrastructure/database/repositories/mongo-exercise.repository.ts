import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IExerciseRepository, ExerciseFilter } from '../../../domain/repositories/exercise.repository.interface';
import { Exercise } from '../../../domain/entities/exercise.entity';
import { ExerciseDocument } from '../schemas/exercise.schema';
import { ExerciseMapper } from '../mappers/exercise.mapper';

@Injectable()
export class MongoExerciseRepository implements IExerciseRepository {
  constructor(
    @InjectModel('Exercise') private readonly model: Model<ExerciseDocument>,
  ) {}

  async findAll(filter?: ExerciseFilter): Promise<Exercise[]> {
    const query: any = {};
    if (filter?.level) query.level = filter.level;
    if (filter?.category) query.category = filter.category;
    const docs = await this.model.find(query).lean().exec();
    return docs.map(ExerciseMapper.toDomain);
  }

  async findById(id: string): Promise<Exercise | null> {
    try {
      const doc = await this.model.findById(id).lean().exec();
      return doc ? ExerciseMapper.toDomain(doc) : null;
    } catch {
      return null;
    }
  }

  async create(data: Omit<Exercise, 'id' | 'created_at' | 'updated_at'>): Promise<Exercise> {
    const doc = await this.model.create(data);
    return ExerciseMapper.toDomain(doc.toObject());
  }

  async update(id: string, data: Partial<Exercise>): Promise<Exercise | null> {
    const doc = await this.model
      .findByIdAndUpdate(id, { $set: data }, { new: true })
      .lean()
      .exec();
    return doc ? ExerciseMapper.toDomain(doc) : null;
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id).exec();
  }
}