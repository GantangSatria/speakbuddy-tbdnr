export enum ConsultationStatus {
  PENDING = 'pending',
  PAID = 'paid',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export class Consultation {
  id!: string;
  user_id!: string;
  therapist_user_id!: string;
  child_name?: string;
  child_age?: number;
  child_sex?: string;
  date!: Date;
  time_slot!: string;
  is_paid!: boolean;
  fee?: number;
  payment_method?: string;
  status!: ConsultationStatus;
  created_at?: Date;
  updated_at?: Date;
}