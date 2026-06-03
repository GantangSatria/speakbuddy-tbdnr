import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser, type CurrentUserPayload } from '../guards/current-user.decorator';
import {
  SendMessageUseCase,
  GetMessagesUseCase,
} from '../../application/use-cases/chat-messages/chat.use-cases';
import { SendMessageDto } from '../dtos/chat-message.dto';

@UseGuards(JwtAuthGuard)
@Controller('chat-messages')
export class ChatMessagesController {
  constructor(
    private readonly sendUseCase: SendMessageUseCase,
    private readonly getUseCase: GetMessagesUseCase,
  ) {}

  /** POST /api/chat-messages */
  @Post()
  send(@Body() dto: SendMessageDto, @CurrentUser() user: CurrentUserPayload) {
    return this.sendUseCase.execute({
      senderId: user.id,
      senderRole: user.role as 'parent' | 'therapist',
      consultation_id: dto.consultation_id,
      message: dto.message,
    });
  }

  /** GET /api/chat-messages/consultation/:consultationId */
  @Get('consultation/:consultationId')
  getByConsultation(
    @Param('consultationId') consultationId: string,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.getUseCase.execute({ consultationId, requesterId: user.id });
  }
}