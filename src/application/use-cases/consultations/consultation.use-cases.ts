import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TOKENS } from '../../../shared/injection-tokens';
import type { IConsultationRepository } from '../../../domain/repositories/consultation.repository.interface';
import type { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { Consultation, ConsultationStatus } from '../../../domain/entities/consultation.entity';

// Create Consultation 
export interface CreateConsultationInput {
  userId: string;
  therapist_user_id: string;
  child_name?: string;
  child_age?: number;
  child_sex?: string;
  date: string;
  time_slot: string;
  fee?: number;
  payment_method?: string;
}

@Injectable()
export class CreateConsultationUseCase {
  constructor(
    @Inject(TOKENS.CONSULTATION_REPO) private readonly repo: IConsultationRepository,
    @Inject(TOKENS.USER_REPO) private readonly userRepo: IUserRepository,
  ) {}

  async execute(input: CreateConsultationInput): Promise<Consultation> {
    const therapist = await this.userRepo.findById(input.therapist_user_id);
    if (!therapist || therapist.role !== 'therapist') {
      throw new NotFoundException('Terapis tidak ditemukan');
    }

    return this.repo.create({
      user_id: input.userId,
      therapist_user_id: input.therapist_user_id,
      child_name: input.child_name,
      child_age: input.child_age,
      child_sex: input.child_sex,
      date: new Date(input.date),
      time_slot: input.time_slot,
      is_paid: false,
      fee: input.fee ?? therapist.profile?.fee,
      payment_method: input.payment_method,
      status: 'pending',
    });
  }
}

// Get My Consultations
@Injectable()
export class GetMyConsultationsUseCase {
  constructor(
    @Inject(TOKENS.CONSULTATION_REPO) private readonly repo: IConsultationRepository,
  ) {}

  async execute(userId: string, role: string): Promise<Consultation[]> {
    if (role === 'therapist') {
      return this.repo.findByTherapistId(userId);
    }
    return this.repo.findByUserId(userId);
  }
}

// Update Consultation
export interface UpdateConsultationInput {
  consultationId: string;
  requesterId: string;
  requesterRole: string;
  is_paid?: boolean;
  payment_method?: string;
  status?: ConsultationStatus;
}

@Injectable()
export class UpdateConsultationUseCase {
  constructor(
    @Inject(TOKENS.CONSULTATION_REPO) private readonly repo: IConsultationRepository,
  ) {}

  async execute(input: UpdateConsultationInput): Promise<Consultation> {
    const consultation = await this.repo.findById(input.consultationId);
    if (!consultation) throw new NotFoundException('Konsultasi tidak ditemukan');

    const isOwner = consultation.user_id === input.requesterId;
    const isTherapist = consultation.therapist_user_id === input.requesterId;

    if (!isOwner && !isTherapist) {
      throw new ForbiddenException('Tidak berhak mengubah konsultasi ini');
    }

    const updated = await this.repo.update(input.consultationId, {
      ...(input.is_paid !== undefined && { is_paid: input.is_paid }),
      ...(input.payment_method && { payment_method: input.payment_method }),
      ...(input.status && { status: input.status }),
    });
    
    return updated;
  }
}