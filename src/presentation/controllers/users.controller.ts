import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser, type CurrentUserPayload } from '../guards/current-user.decorator';
import { GetUserByIdUseCase } from '../../application/use-cases/users/get-user-by-id.use-case';
import { GetTherapistsUseCase } from '../../application/use-cases/users/get-therapists.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/users/update-user.use-case';
import { DeleteUserUseCase } from '../../application/use-cases/users/delete-user.use-case';
import { UpdateUserDto } from '../dtos/user.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly getTherapistsUseCase: GetTherapistsUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  /** GET /api/users/me */
  @Get('me')
  getMe(@CurrentUser() user: CurrentUserPayload) {
    return this.getUserByIdUseCase.execute(user.id);
  }

  /** GET /api/users/therapists */
  @Get('therapists')
  getTherapists() {
    return this.getTherapistsUseCase.execute();
  }

  /** GET /api/users/:id */
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.getUserByIdUseCase.execute(id);
  }

  /** PATCH /api/users/:id */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.updateUserUseCase.execute({
      requesterId: user.id,
      targetId: id,
      ...dto,
    });
  }

  /** DELETE /api/users/:id */
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: CurrentUserPayload) {
    return this.deleteUserUseCase.execute({ requesterId: user.id, targetId: id });
  }
}