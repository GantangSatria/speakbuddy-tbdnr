import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { TOKENS } from '../../../shared/injection-tokens';
import type { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import type { IHashService } from '../../ports/hash.port';
import type { ITokenService } from '../../ports/token.port';

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginOutput {
  access_token: string;
  user: { id: string; name: string; email: string; role: string };
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(TOKENS.USER_REPO) private readonly userRepo: IUserRepository,
    @Inject(TOKENS.HASH_SERVICE) private readonly hashService: IHashService,
    @Inject(TOKENS.TOKEN_SERVICE) private readonly tokenService: ITokenService,
  ) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const user = await this.userRepo.findByEmail(input.email);
    if (!user) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const isMatch = await this.hashService.compare(input.password, user.password_hash);
    if (!isMatch) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const access_token = this.tokenService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      access_token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  }
}