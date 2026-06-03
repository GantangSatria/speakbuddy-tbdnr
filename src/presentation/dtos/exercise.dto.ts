import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum Level {
    BEGINNER = 'beginner',
    INTERMEDIATE = 'intermediate',
    ADVANCED = 'advanced'
}

export class ExerciseItemDto {
  @IsNumber() item_number!: number;
  @IsNotEmpty() @IsString() target_text!: string;
  @IsOptional() @IsString() hint?: string;
}

export class CreateExerciseDto {
  @IsNotEmpty() @IsString() title!: string;
  @IsEnum(Level) level!: Level;
  @IsNotEmpty() @IsString() category!: string;
  @IsOptional() @IsString() description?: string;
  @IsArray() @ValidateNested({ each: true }) @Type(() => ExerciseItemDto) items!: ExerciseItemDto[];
}

export class UpdateExerciseDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsEnum(Level) level?: Level;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => ExerciseItemDto) items?: ExerciseItemDto[];
}

export class FilterExerciseDto {
  @IsOptional() @IsEnum(Level) level?: Level;
  @IsOptional() @IsString() category?: string;
}