import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ExerciseAttemptDocument = ExerciseAttempt & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: false } })
export class ExerciseAttempt {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) user_id!: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Exercise', required: true }) exercise_id!: Types.ObjectId;
  @Prop({ required: true }) item_number!: number;
  @Prop() transcribed_text?: string;
  @Prop({ required: true }) target_text!: string;
  @Prop({ min: 0, max: 100 }) accuracy!: number;
  @Prop() ai_feedback?: string;
  @Prop() ai_model?: string;
  @Prop() duration_seconds?: number;
}

export const ExerciseAttemptSchema = SchemaFactory.createForClass(ExerciseAttempt);
ExerciseAttemptSchema.index({ user_id: 1, created_at: -1 });
ExerciseAttemptSchema.index({ accuracy: -1 });