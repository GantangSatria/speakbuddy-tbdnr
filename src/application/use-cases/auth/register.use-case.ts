import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { TOKENS } from '../../../shared/injection-tokens';
import type { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import type { IHashService } from '../../ports/hash.port';
import { Role, User } from '../../../domain/entities/user.entity';

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export type RegisterOutput = Omit<User, 'password_hash'>;

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(TOKENS.USER_REPO) private readonly userRepo: IUserRepository,
    @Inject(TOKENS.HASH_SERVICE) private readonly hashService: IHashService,
  ) {}

  async execute(input: RegisterInput): Promise<RegisterOutput> {
    const existing = await this.userRepo.findByEmail(input.email);
    if (existing) {
      throw new ConflictException('Email sudah terdaftar');
    }

    const password_hash = await this.hashService.hash(input.password);

    const user = await this.userRepo.create({
      name: input.name,
      email: input.email,
      password_hash,
      role: input.role,
    });

    const { password_hash: _removed, ...result } = user;
    return result;
  }
}