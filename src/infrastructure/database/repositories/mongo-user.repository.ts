import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { User } from '../../../domain/entities/user.entity';
import { UserDocument } from '../schemas/user.schema';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class MongoUserRepository implements IUserRepository {
  constructor(
    @InjectModel('User') private readonly model: Model<UserDocument>,
  ) {}

  async findById(id: string): Promise<User | null> {
    try {
      const doc = await this.model.findById(id).lean().exec();
      return doc ? UserMapper.toDomain(doc) : null;
    } catch {
      return null;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await this.model.findOne({ email: email.toLowerCase() }).lean().exec();
    return doc ? UserMapper.toDomain(doc) : null;
  }

  async findAllTherapists(): Promise<User[]> {
    const docs = await this.model.find({ role: 'therapist' }).lean().exec();
    return docs.map(UserMapper.toDomain);
  }

  async create(data: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const doc = await this.model.create(data);
    return UserMapper.toDomain(doc.toObject());
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const doc = await this.model
      .findByIdAndUpdate(id, { $set: data }, { new: true })
      .lean()
      .exec();
    if (!doc) {
        throw new Error('User not found');
    }

    return UserMapper.toDomain(doc);
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id).exec();
  }
}