import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class EvaluateAttemptDto {
  @IsNotEmpty()
  @IsString()
  exercise_id!: string;

  @IsNotEmpty()
  @IsNumberString()
  item_number!: string;

  @IsNotEmpty()
  @IsString()
  target_text!: string;
}
