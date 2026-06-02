import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TOKENS } from '../../../shared/injection-tokens';
import type { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { User, UserChild, UserProfile } from '../../../domain/entities/user.entity';

export interface UpdateUserInput {
  requesterId: string;
  targetId: string;
  name?: string;
  profile?: Partial<UserProfile>;
  child?: Partial<UserChild>;
}

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(TOKENS.USER_REPO) private readonly userRepo: IUserRepository,
  ) {}

  async execute(input: UpdateUserInput): Promise<Omit<User, 'password_hash'>> {
    if (input.requesterId !== input.targetId) {
      throw new ForbiddenException('Tidak dapat mengubah profil pengguna lain');
    }

    const existing = await this.userRepo.findById(input.targetId);
    if (!existing) throw new NotFoundException('User tidak ditemukan');

    const updated = await this.userRepo.update(input.targetId, {
      ...(input.name && { name: input.name }),
      ...(input.profile && {
        profile: { ...existing.profile, ...input.profile },
      }),
      ...(input.child && {
        child: { ...existing.child, ...input.child },
      }),
    });

    const { password_hash: _removed, ...result } = updated;
    return result;
  }
}