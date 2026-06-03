import { Body, Controller, Get, Param, Post, Query, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import 'multer';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser, type CurrentUserPayload } from '../guards/current-user.decorator';
import {
  CreateAttemptUseCase,
  GetMyAttemptsUseCase,
  GetAccuracyStatsUseCase,
  GetGlobalStatsUseCase,
} from '../../application/use-cases/exercise-attempts/attempt.use-cases';
import { EvaluateAttemptUseCase } from '../../application/use-cases/exercise-attempts/evaluate-attempt.use-case';
import { CreateAttemptDto } from '../dtos/attempt.dto';
import { EvaluateAttemptDto } from '../dtos/evaluate-attempt.dto';

@UseGuards(JwtAuthGuard)
@Controller('exercise-attempts')
export class ExerciseAttemptsController {
  constructor(
    private readonly createUseCase: CreateAttemptUseCase,
    private readonly getMyAttemptsUseCase: GetMyAttemptsUseCase,
    private readonly getStatsUseCase: GetAccuracyStatsUseCase,
    private readonly getGlobalStatsUseCase: GetGlobalStatsUseCase,
    private readonly evaluateUseCase: EvaluateAttemptUseCase,
  ) {}

  /** POST /api/exercise-attempts */
  @Post()
  create(@Body() dto: CreateAttemptDto, @CurrentUser() user: CurrentUserPayload) {
    return this.createUseCase.execute({ userId: user.id, ...dto });
  }

  /** POST /api/exercise-attempts/evaluate */
  @Post('evaluate')
  @UseInterceptors(FileInterceptor('audio'))
  evaluate(
    @Body() dto: EvaluateAttemptDto,
    @CurrentUser() user: CurrentUserPayload,
    @UploadedFile() audio: Express.Multer.File,
  ) {
    return this.evaluateUseCase.execute({
      userId: user.id,
      exerciseId: dto.exercise_id,
      itemNumber: Number(dto.item_number),
      targetText: dto.target_text,
      audioBuffer: audio?.buffer,
    });
  }

  /** GET /api/exercise-attempts/me?exerciseId=xxx */
  @Get('me')
  getMyAttempts(
    @CurrentUser() user: CurrentUserPayload,
    @Query('exerciseId') exerciseId?: string,
  ) {
    return this.getMyAttemptsUseCase.execute(user.id, exerciseId);
  }

  /** GET /api/exercise-attempts/me/stats */
  @Get('me/stats')
  getMyStats(@CurrentUser() user: CurrentUserPayload) {
    return this.getStatsUseCase.execute(user.id);
  }

  /** GET /api/exercise-attempts/leaderboard */
  @Get('leaderboard')
  getLeaderboard() {
    return this.getGlobalStatsUseCase.execute();
  }

  /** GET /api/exercise-attempts/user/:userId */
  @Get('user/:userId')
  getByUser(@Param('userId') userId: string, @Query('exerciseId') exerciseId?: string) {
    return this.getMyAttemptsUseCase.execute(userId, exerciseId);
  }
}