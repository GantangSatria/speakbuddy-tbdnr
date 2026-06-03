import { ChatMessage } from '../../../domain/entities/chat-message.entity';

export class ChatMessageMapper {
  static toDomain(doc: any): ChatMessage {
    const m = new ChatMessage();
    m.id = doc._id.toString();
    m.consultation_id = doc.consultation_id.toString();
    m.sender_id = doc.sender_id.toString();
    m.sender_role = doc.sender_role;
    m.message = doc.message;
    m.created_at = doc.created_at;
    return m;
  }
}