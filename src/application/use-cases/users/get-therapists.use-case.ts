import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from '../../../shared/injection-tokens';
import type { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { User } from '../../../domain/entities/user.entity';

@Injectable()
export class GetTherapistsUseCase {
  constructor(
    @Inject(TOKENS.USER_REPO) private readonly userRepo: IUserRepository,
  ) {}

  async execute(): Promise<Omit<User, 'password_hash'>[]> {
    const therapists = await this.userRepo.findAllTherapists();
    return therapists.map(({ password_hash: _removed, ...t }) => t);
  }
}