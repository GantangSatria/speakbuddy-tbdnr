import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TOKENS } from '../shared/injection-tokens';
import {
  Consultation,
  ConsultationSchema,
} from '../infrastructure/database/schemas/consultation.schema';
import { User, UserSchema } from '../infrastructure/database/schemas/user.schema';
import { MongoConsultationRepository } from '../infrastructure/database/repositories/mongo-consultation.repository';
import { MongoUserRepository } from '../infrastructure/database/repositories/mongo-user.repository';
import {
  CreateConsultationUseCase,
  GetMyConsultationsUseCase,
  UpdateConsultationUseCase,
} from '../application/use-cases/consultations/consultation.use-cases';
import { ConsultationsController } from '../presentation/controllers/consultations.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Consultation', schema: ConsultationSchema },
      // Dibutuhkan oleh CreateConsultationUseCase (validasi therapist)
      { name: 'User', schema: UserSchema },
    ]),
  ],
  providers: [
    // Repository bindings 
    MongoConsultationRepository,
    { provide: TOKENS.CONSULTATION_REPO, useExisting: MongoConsultationRepository },

    MongoUserRepository,
    { provide: TOKENS.USER_REPO, useExisting: MongoUserRepository },

    // Use Cases 
    CreateConsultationUseCase,
    GetMyConsultationsUseCase,
    UpdateConsultationUseCase,
  ],
  controllers: [ConsultationsController],
  // Export CONSULTATION_REPO agar ChatMessagesModule bisa validasi kepesertaan
  exports: [TOKENS.CONSULTATION_REPO, MongoConsultationRepository],
})
export class ConsultationsModule {}