import { ChatMessage } from '../entities/chat-message.entity';

export interface IChatMessageRepository {
  create(data: Omit<ChatMessage, 'id' | 'created_at'>): Promise<ChatMessage>;
  findByConsultationId(consultationId: string): Promise<ChatMessage[]>;
  deleteById(id: string): Promise<void>;
}