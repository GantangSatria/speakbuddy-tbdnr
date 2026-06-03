import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TOKENS } from '../shared/injection-tokens';
import { User, UserSchema } from '../infrastructure/database/schemas/user.schema';
import { MongoUserRepository } from '../infrastructure/database/repositories/mongo-user.repository';
import { RegisterUseCase } from '../application/use-cases/auth/register.use-case';
import { LoginUseCase } from '../application/use-cases/auth/login.use-case';
import { AuthController } from '../presentation/controllers/auth.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  providers: [
    // Repository binding
    MongoUserRepository,
    { provide: TOKENS.USER_REPO, useExisting: MongoUserRepository },

    // Use Cases 
    RegisterUseCase,
    LoginUseCase,
  ],
  controllers: [AuthController],
  exports: [
    // Di-export agar UsersModule & modul lain bisa reuse USER_REPO
    MongoUserRepository,
    { provide: TOKENS.USER_REPO, useExisting: MongoUserRepository },
  ],
})
export class AuthModule {}