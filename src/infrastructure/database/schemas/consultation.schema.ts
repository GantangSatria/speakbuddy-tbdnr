import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ConsultationDocument = Consultation & Document;

export enum ConsultationStatus {
  PENDING = 'pending',
  PAID = 'paid',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Consultation {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) user_id!: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) therapist_user_id!: Types.ObjectId;
  @Prop() child_name?: string;
  @Prop() child_age?: number;
  @Prop() child_sex?: string;
  @Prop({ required: true }) date!: Date;
  @Prop({ required: true }) time_slot!: string;
  @Prop({ default: false }) is_paid!: boolean;
  @Prop() fee?: number;
  @Prop() payment_method?: string;
  @Prop({ enum: Object.values(ConsultationStatus), default: ConsultationStatus.PENDING }) status!: ConsultationStatus;
}

export const ConsultationSchema = SchemaFactory.createForClass(Consultation);
ConsultationSchema.index({ user_id: 1, status: 1 });
ConsultationSchema.index({ therapist_user_id: 1, status: 1 });