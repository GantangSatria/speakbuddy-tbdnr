import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TOKENS } from '../shared/injection-tokens';
import { BcryptService } from '../infrastructure/services/bcrypt.service';
import { JwtTokenService } from '../infrastructure/services/jwt-token.service';
import { JwtStrategy } from '../presentation/guards/jwt.strategy';
import type { StringValue } from 'ms';

/**
 * SharedModule adalah Global Module yang menyediakan:
 *  - IHashService   → BcryptService
 *  - ITokenService  → JwtTokenService
 *  - IRedisService  → RedisStubService  (rancangan; ganti saat Redis aktif)
 *  - JwtStrategy    (untuk Passport)
 *
 * Di-import sekali di AppModule dan tersedia di seluruh modul.
 */
@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'speakbuddy_jwt_secret'),
            signOptions: {
                expiresIn: config.get<string>('JWT_EXPIRES_IN', '24h') as StringValue,
            },
        }),
    }),
  ],
  providers: [
    JwtStrategy,
    BcryptService,
    JwtTokenService,

    // Port bindings
    { provide: TOKENS.HASH_SERVICE, useExisting: BcryptService },
    { provide: TOKENS.TOKEN_SERVICE, useExisting: JwtTokenService },
  ],
  exports: [
    TOKENS.HASH_SERVICE,
    TOKENS.TOKEN_SERVICE,
    JwtModule,
    PassportModule,
  ],
})
export class SharedModule {}