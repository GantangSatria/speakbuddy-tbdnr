import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Role } from '../../domain/entities/user.entity';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsEmail({}, { message: 'Format email tidak valid' })
  email!: string;

  @IsString()
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password!: string;

  @IsEnum(Role)
  role!: Role;
}

export class LoginDto {
  @IsEmail({}, { message: 'Format email tidak valid' })
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}