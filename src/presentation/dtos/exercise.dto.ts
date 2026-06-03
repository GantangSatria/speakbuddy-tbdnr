import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ExerciseLevel } from '../../domain/entities/exercise.entity';

export class ExerciseItemDto {
  @IsNumber() item_number!: number;
  @IsNotEmpty() @IsString() target_text!: string;
  @IsOptional() @IsString() hint?: string;
}

export class CreateExerciseDto {
  @IsNotEmpty() @IsString() title!: string;
  @IsEnum(ExerciseLevel) level!: ExerciseLevel;
  @IsNotEmpty() @IsString() category!: string;
  @IsOptional() @IsString() description?: string;
  @IsArray() @ValidateNested({ each: true }) @Type(() => ExerciseItemDto) items!: ExerciseItemDto[];
}

export class UpdateExerciseDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsEnum(ExerciseLevel) level?: ExerciseLevel;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => ExerciseItemDto) items?: ExerciseItemDto[];
}

export class FilterExerciseDto {
  @IsOptional() @IsEnum(ExerciseLevel) level?: ExerciseLevel;
  @IsOptional() @IsString() category?: string;
}