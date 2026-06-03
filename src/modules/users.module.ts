import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TOKENS } from '../shared/injection-tokens';
import { User, UserSchema } from '../infrastructure/database/schemas/user.schema';
import { MongoUserRepository } from '../infrastructure/database/repositories/mongo-user.repository';
import { GetUserByIdUseCase } from '../application/use-cases/users/get-user-by-id.use-case';
import { GetTherapistsUseCase } from '../application/use-cases/users/get-therapists.use-case';
import { UpdateUserUseCase } from '../application/use-cases/users/update-user.use-case';
import { DeleteUserUseCase } from '../application/use-cases/users/delete-user.use-case';
import { UsersController } from '../presentation/controllers/users.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  providers: [
    // Repository binding
    MongoUserRepository,
    { provide: TOKENS.USER_REPO, useExisting: MongoUserRepository },

    // Use Cases
    GetUserByIdUseCase,
    GetTherapistsUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
  ],
  controllers: [UsersController],
  exports: [TOKENS.USER_REPO, MongoUserRepository],
})
export class UsersModule {}