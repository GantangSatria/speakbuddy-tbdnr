import { Consultation } from '../entities/consultation.entity';

export interface IConsultationRepository {
  create(data: Omit<Consultation, 'id' | 'created_at' | 'updated_at'>): Promise<Consultation>;
  findById(id: string): Promise<Consultation | null>;
  findByUserId(userId: string): Promise<Consultation[]>;
  findByTherapistId(therapistId: string): Promise<Consultation[]>;
  update(id: string, data: Partial<Consultation>): Promise<Consultation | null>;
}