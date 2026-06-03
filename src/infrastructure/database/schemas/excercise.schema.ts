import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ExerciseDocument = Exercise & Document;

export enum ExerciseLevel {
    BEGINNER = 'beginner',
    INTERMEDIATE = 'intermediate',
    ADVANCED = 'advanced',
}

@Schema({ _id: false })
class ExerciseItem {
  @Prop({ required: true }) item_number!: number;
  @Prop({ required: true }) target_text!: string;
  @Prop() hint?: string;
}

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Exercise {
  @Prop({ required: true }) title!: string;
  @Prop({ required: true, enum: Object.values(ExerciseLevel) }) level!: ExerciseLevel;
  @Prop({ required: true }) category!: string;
  @Prop() description?: string;
  @Prop({ type: [ExerciseItem], default: [] }) items!: ExerciseItem[];
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);
ExerciseSchema.index({ level: 1, category: 1 });