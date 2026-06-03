import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TOKENS } from '../../../shared/injection-tokens';
import type { IChatMessageRepository } from '../../../domain/repositories/chat-message.repository.interface';
import type { IConsultationRepository } from '../../../domain/repositories/consultation.repository.interface';
import { ChatMessage } from '../../../domain/entities/chat-message.entity';

// Send Message
export interface SendMessageInput {
  senderId: string;
  senderRole: 'parent' | 'therapist';
  consultation_id: string;
  message: string;
}

@Injectable()
export class SendMessageUseCase {
  constructor(
    @Inject(TOKENS.CHAT_REPO) private readonly chatRepo: IChatMessageRepository,
    @Inject(TOKENS.CONSULTATION_REPO) private readonly consultationRepo: IConsultationRepository,
  ) {}

  async execute(input: SendMessageInput): Promise<ChatMessage> {
    const consultation = await this.consultationRepo.findById(input.consultation_id);
    if (!consultation) throw new NotFoundException('Konsultasi tidak ditemukan');

    const isParticipant =
      consultation.user_id === input.senderId ||
      consultation.therapist_user_id === input.senderId;

    if (!isParticipant) {
      throw new ForbiddenException('Tidak berhak mengirim pesan di sesi ini');
    }

    if (!consultation.is_paid) {
      throw new ForbiddenException('Pembayaran belum dikonfirmasi');
    }

    return this.chatRepo.create({
      consultation_id: input.consultation_id,
      sender_id: input.senderId,
      sender_role: input.senderRole,
      message: input.message,
    });
  }
}

// Get Messages
export interface GetMessagesInput {
  consultationId: string;
  requesterId: string;
}

@Injectable()
export class GetMessagesUseCase {
  constructor(
    @Inject(TOKENS.CHAT_REPO) private readonly chatRepo: IChatMessageRepository,
    @Inject(TOKENS.CONSULTATION_REPO) private readonly consultationRepo: IConsultationRepository,
  ) {}

  async execute(input: GetMessagesInput): Promise<ChatMessage[]> {
    const consultation = await this.consultationRepo.findById(input.consultationId);
    if (!consultation) throw new NotFoundException('Konsultasi tidak ditemukan');

    const isParticipant =
      consultation.user_id === input.requesterId ||
      consultation.therapist_user_id === input.requesterId;

    if (!isParticipant) {
      throw new ForbiddenException('Tidak berhak melihat pesan ini');
    }

    return this.chatRepo.findByConsultationId(input.consultationId);
  }
}