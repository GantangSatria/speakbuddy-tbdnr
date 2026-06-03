import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser, type CurrentUserPayload } from '../guards/current-user.decorator';
import {
  CreateConsultationUseCase,
  GetMyConsultationsUseCase,
  UpdateConsultationUseCase,
} from '../../application/use-cases/consultations/consultation.use-cases';
import { CreateConsultationDto, UpdateConsultationDto } from '../dtos/consultation.dto';

@UseGuards(JwtAuthGuard)
@Controller('consultations')
export class ConsultationsController {
  constructor(
    private readonly createUseCase: CreateConsultationUseCase,
    private readonly getMyUseCase: GetMyConsultationsUseCase,
    private readonly updateUseCase: UpdateConsultationUseCase,
  ) {}

  /** POST /api/consultations */
  @Post()
  create(@Body() dto: CreateConsultationDto, @CurrentUser() user: CurrentUserPayload) {
    return this.createUseCase.execute({ userId: user.id, ...dto });
  }

  /** GET /api/consultations/me */
  @Get('me')
  getMy(@CurrentUser() user: CurrentUserPayload) {
    return this.getMyUseCase.execute(user.id, user.role);
  }

  /** PATCH /api/consultations/:id */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateConsultationDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.updateUseCase.execute({
      consultationId: id,
      requesterId: user.id,
      requesterRole: user.role,
      ...dto,
    });
  }
}