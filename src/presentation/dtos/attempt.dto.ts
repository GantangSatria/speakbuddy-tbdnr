import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateAttemptDto {
  @IsMongoId() exercise_id!: string;
  @IsNumber() item_number!: number;
  @IsOptional() @IsString() transcribed_text?: string;
  @IsNotEmpty() @IsString() target_text!: string;
  @IsNumber() @Min(0) @Max(100) accuracy!: number;
  @IsOptional() @IsString() ai_feedback?: string;
  @IsOptional() @IsString() ai_model?: string;
  @IsOptional() @IsNumber() @Min(0) duration_seconds?: number;
}