import { IsBoolean, IsDateString, IsEnum, IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';
import { ConsultationStatus } from '../../domain/entities/consultation.entity';

export class CreateConsultationDto {
  @IsMongoId() therapist_user_id!: string;
  @IsOptional() @IsString() child_name?: string;
  @IsOptional() @IsNumber() child_age?: number;
  @IsOptional() @IsString() child_sex?: string;
  @IsDateString() date!: string;
  @IsString() time_slot!: string;
  @IsOptional() @IsNumber() fee?: number;
  @IsOptional() @IsString() payment_method?: string;
}

export class UpdateConsultationDto {
  @IsOptional() @IsBoolean() is_paid?: boolean;
  @IsOptional() @IsString() payment_method?: string;
  @IsOptional() @IsEnum(ConsultationStatus) status?: ConsultationStatus;
}