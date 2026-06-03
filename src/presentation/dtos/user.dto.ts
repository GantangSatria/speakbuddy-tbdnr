import { IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum Sex {
    MALE = 'male',
    FEMALE = 'female'
}

export enum ChildSex {
    MALE = 'male',
    FEMALE = 'female'
}

export enum SpeechLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export class UpdateProfileDto {
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsNumber() age?: number;
  @IsOptional() @IsEnum(Sex) sex?: Sex;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() specialization?: string;
  @IsOptional() @IsNumber() fee?: number;
}

export class UpdateChildDto {
  @IsOptional() @IsString() child_name?: string;
  @IsOptional() @IsNumber() child_age?: number;
  @IsOptional() @IsEnum(ChildSex) child_sex?: ChildSex;
  @IsOptional() @IsEnum(SpeechLevel) speech_level?: SpeechLevel;
}

export class UpdateUserDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @ValidateNested() @Type(() => UpdateProfileDto) profile?: UpdateProfileDto;
  @IsOptional() @ValidateNested() @Type(() => UpdateChildDto) child?: UpdateChildDto;
}