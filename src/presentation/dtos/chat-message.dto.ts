import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class SendMessageDto {
  @IsMongoId() consultation_id!: string;
  @IsNotEmpty() @IsString() message!: string;
}