import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import {
  CreateExerciseUseCase,
  GetExercisesUseCase,
  GetExerciseByIdUseCase,
  UpdateExerciseUseCase,
  DeleteExerciseUseCase,
} from '../../application/use-cases/exercises/exercise.use-cases';
import { CreateExerciseDto, FilterExerciseDto, UpdateExerciseDto } from '../dtos/exercise.dto';

@UseGuards(JwtAuthGuard)
@Controller('exercises')
export class ExercisesController {
  constructor(
    private readonly createUseCase: CreateExerciseUseCase,
    private readonly getListUseCase: GetExercisesUseCase,
    private readonly getByIdUseCase: GetExerciseByIdUseCase,
    private readonly updateUseCase: UpdateExerciseUseCase,
    private readonly deleteUseCase: DeleteExerciseUseCase,
  ) {}

  /** POST /api/exercises */
  @Post()
  create(@Body() dto: CreateExerciseDto) {
    return this.createUseCase.execute(dto);
  }

  /** GET /api/exercises?level=beginner&category=vokal */
  @Get()
  findAll(@Query() filter: FilterExerciseDto) {
    return this.getListUseCase.execute(filter);
  }

  /** GET /api/exercises/:id */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.getByIdUseCase.execute(id);
  }

  /** PATCH /api/exercises/:id */
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateExerciseDto) {
    return this.updateUseCase.execute({ id, ...dto });
  }

  /** DELETE /api/exercises/:id */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteUseCase.execute(id);
  }
}