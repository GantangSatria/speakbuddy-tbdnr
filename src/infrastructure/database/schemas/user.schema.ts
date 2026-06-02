import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ _id: false })
class Profile {
  @Prop()
  phone!: string;

  @Prop()
  age!: number;

  @Prop()
  sex!: string;

  @Prop()
  address!: string;

  @Prop()
  specialization!: string;

  @Prop()
  fee!: number;
}

@Schema({ _id: false })
class Child {
  @Prop()
  child_name!: string;

  @Prop()
  child_age!: number;

  @Prop()
  child_sex!: string;

  @Prop({ enum: ['beginner', 'intermediate', 'advanced'] })
  speech_level!: string;
}

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class User {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email!: string;

  @Prop({ required: true })
  password_hash!: string;

  @Prop({ required: true, enum: ['parent', 'therapist'] })
  role!: string;

  @Prop({ type: Profile })
  profile?: Profile;

  @Prop({ type: Child })
  child?: Child;
}
export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ role: 1 });