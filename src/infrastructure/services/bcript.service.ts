import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IHashService } from '../../application/ports/hash.port';

@Injectable()
export class BcryptService implements IHashService {
  private readonly SALT_ROUNDS = 12;

  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.SALT_ROUNDS);
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}