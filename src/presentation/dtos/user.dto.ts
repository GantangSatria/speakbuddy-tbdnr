import { IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProfileDto {
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsNumber() age?: number;
  @IsOptional() @IsEnum(['male', 'female']) sex?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() specialization?: string;
  @IsOptional() @IsNumber() fee?: number;
}

export class UpdateChildDto {
  @IsOptional() @IsString() child_name?: string;
  @IsOptional() @IsNumber() child_age?: number;
  @IsOptional() @IsEnum(['male', 'female']) child_sex?: string;
  @IsOptional() @IsEnum(['beginner', 'intermediate', 'advanced']) speech_level?: string;
}

export class UpdateUserDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @ValidateNested() @Type(() => UpdateProfileDto) profile?: UpdateProfileDto;
  @IsOptional() @ValidateNested() @Type(() => UpdateChildDto) child?: UpdateChildDto;
}