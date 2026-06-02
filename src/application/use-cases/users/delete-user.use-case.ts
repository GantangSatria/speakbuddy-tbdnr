import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TOKENS } from '../../../shared/injection-tokens';
import type { IUserRepository } from '../../../domain/repositories/user.repository.interface';

export interface DeleteUserInput {
  requesterId: string;
  targetId: string;
}

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(TOKENS.USER_REPO) private readonly userRepo: IUserRepository,
  ) {}

  async execute(input: DeleteUserInput): Promise<{ message: string }> {
    if (input.requesterId !== input.targetId) {
      throw new ForbiddenException('Tidak dapat menghapus akun pengguna lain');
    }

    const existing = await this.userRepo.findById(input.targetId);
    if (!existing) throw new NotFoundException('User tidak ditemukan');

    await this.userRepo.delete(input.targetId);
    return { message: 'Akun berhasil dihapus' };
  }
}