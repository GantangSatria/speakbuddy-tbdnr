import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IChatMessageRepository } from '../../../domain/repositories/chat-message.repository.interface';
import { ChatMessage } from '../../../domain/entities/chat-message.entity';
import { ChatMessageDocument } from '../schemas/chat-message.schema';
import { ChatMessageMapper } from '../mappers/chat-message.mapper';

@Injectable()
export class MongoChatMessageRepository implements IChatMessageRepository {
  constructor(
    @InjectModel('ChatMessage')
    private readonly model: Model<ChatMessageDocument>,
  ) {}

  async create(data: Omit<ChatMessage, 'id' | 'created_at'>): Promise<ChatMessage> {
    const doc = await this.model.create({
      ...data,
      consultation_id: new Types.ObjectId(data.consultation_id),
      sender_id: new Types.ObjectId(data.sender_id),
    });
    return ChatMessageMapper.toDomain(doc.toObject());
  }

  async findByConsultationId(consultationId: string): Promise<ChatMessage[]> {
    const docs = await this.model
      .find({ consultation_id: new Types.ObjectId(consultationId) })
      .sort({ created_at: 1 })
      .lean()
      .exec();
    return docs.map(ChatMessageMapper.toDomain);
  }

  async deleteById(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id).exec();
  }
}