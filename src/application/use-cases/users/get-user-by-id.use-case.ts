import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TOKENS } from '../../../shared/injection-tokens';
import type { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { User } from '../../../domain/entities/user.entity';

@Injectable()
export class GetUserByIdUseCase {
  constructor(
    @Inject(TOKENS.USER_REPO) private readonly userRepo: IUserRepository,
  ) {}

  async execute(id: string): Promise<Omit<User, 'password_hash'>> {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundException('User tidak ditemukan');

    const { password_hash: _removed, ...result } = user;
    return result;
  }
}