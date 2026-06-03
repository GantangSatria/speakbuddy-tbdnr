import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChatMessageDocument = ChatMessage & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: false } })
export class ChatMessage {
  @Prop({ type: Types.ObjectId, ref: 'Consultation', required: true }) consultation_id!: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) sender_id!: Types.ObjectId;
  @Prop({ required: true, enum: ['parent', 'therapist'] }) sender_role!: string;
  @Prop({ required: true }) message!: string;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
ChatMessageSchema.index({ consultation_id: 1, created_at: 1 });