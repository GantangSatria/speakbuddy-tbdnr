import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IConsultationRepository } from '../../../domain/repositories/consultation.repository.interface';
import { Consultation } from '../../../domain/entities/consultation.entity';
import { ConsultationDocument } from '../schemas/consultation.schema';
import { ConsultationMapper } from '../mappers/consultation.mapper';

@Injectable()
export class MongoConsultationRepository implements IConsultationRepository {
  constructor(
    @InjectModel('Consultation')
    private readonly model: Model<ConsultationDocument>,
  ) {}

  async create(data: Omit<Consultation, 'id' | 'created_at' | 'updated_at'>): Promise<Consultation> {
    const doc = await this.model.create({
      ...data,
      user_id: new Types.ObjectId(data.user_id),
      therapist_user_id: new Types.ObjectId(data.therapist_user_id),
    });
    return ConsultationMapper.toDomain(doc.toObject());
  }

  async findById(id: string): Promise<Consultation | null> {
    try {
      const doc = await this.model.findById(id).lean().exec();
      return doc ? ConsultationMapper.toDomain(doc) : null;
    } catch {
      return null;
    }
  }

  async findByUserId(userId: string): Promise<Consultation[]> {
    const docs = await this.model
      .find({ user_id: new Types.ObjectId(userId) })
      .sort({ created_at: -1 })
      .lean()
      .exec();
    return docs.map(ConsultationMapper.toDomain);
  }

  async findByTherapistId(therapistId: string): Promise<Consultation[]> {
    const docs = await this.model
      .find({ therapist_user_id: new Types.ObjectId(therapistId) })
      .sort({ created_at: -1 })
      .lean()
      .exec();
    return docs.map(ConsultationMapper.toDomain);
  }

  async update(id: string, data: Partial<Consultation>): Promise<Consultation> {
    const doc = await this.model
      .findByIdAndUpdate(id, { $set: data }, { new: true })
      .lean()
      .exec();
      
      if (!doc) {
            throw new NotFoundException('Konsultasi tidak ditemukan');
        }

        return ConsultationMapper.toDomain(doc);
  }
}