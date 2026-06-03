import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TOKENS } from '../shared/injection-tokens';
import {
  ChatMessage,
  ChatMessageSchema,
} from '../infrastructure/database/schemas/chat-message.schema';
import { MongoChatMessageRepository } from '../infrastructure/database/repositories/mongo-chat-message.repository';
import { ConsultationsModule } from './consultations.module';
import {
  SendMessageUseCase,
  GetMessagesUseCase,
} from '../application/use-cases/chat-messages/chat.use-cases';
import { ChatMessagesController } from '../presentation/controllers/chat-messages.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ChatMessage', schema: ChatMessageSchema }]),
    // Import ConsultationsModule untuk mendapat CONSULTATION_REPO
    // (dibutuhkan SendMessageUseCase & GetMessagesUseCase untuk validasi peserta)
    ConsultationsModule,
  ],
  providers: [
    // Repository binding
    MongoChatMessageRepository,
    { provide: TOKENS.CHAT_REPO, useExisting: MongoChatMessageRepository },

    // Use Cases
    SendMessageUseCase,
    GetMessagesUseCase,
  ],
  controllers: [ChatMessagesController],
})
export class ChatMessagesModule {}