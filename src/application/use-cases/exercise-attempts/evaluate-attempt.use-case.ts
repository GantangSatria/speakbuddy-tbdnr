import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { TOKENS } from '../../../shared/injection-tokens';
import type { IExerciseAttemptRepository } from '../../../domain/repositories/exercise-attempt.repository.interface';
import type { ISTTProvider } from '../../ports/stt.port';
import type { IAIProvider } from '../../ports/ai.port';
import { ExerciseAttempt } from '../../../domain/entities/exercise-attempt.entity';
import { calculateAccuracy } from '../../../shared/utils/string-similarity.util';

export interface EvaluateAttemptInput {
  userId: string;
  exerciseId: string;
  itemNumber: number;
  targetText: string;
  audioBuffer: Buffer;
}

@Injectable()
export class EvaluateAttemptUseCase {
  constructor(
    @Inject(TOKENS.ATTEMPT_REPO) private readonly repo: IExerciseAttemptRepository,
    @Inject('ISTTProvider') private readonly sttProvider: ISTTProvider,
    @Inject('IAIProvider') private readonly aiProvider: IAIProvider,
  ) { }

  async execute(input: EvaluateAttemptInput): Promise<ExerciseAttempt> {
    if (!input.audioBuffer || input.audioBuffer.length === 0) {
      throw new BadRequestException('Audio file is required and cannot be empty.');
    }

    // 1. Transcribe Audio
    let transcribedText = '';
    try {
      transcribedText = await this.sttProvider.transcribeAudio(input.audioBuffer);
    } catch (err: any) {
      throw new BadRequestException(err.message || 'Gagal melakukan transkripsi audio.');
    }

    // If STT yields empty text, still proceed to score 0 and get feedback
    const textToAnalyze = transcribedText || '(tidak ada suara terdengar)';

    // 2. Generate Gemini Feedback
    const aiFeedback = await this.aiProvider.getFeedback(input.targetText, textToAnalyze);

    // 3. Calculate Accuracy
    const accuracy = calculateAccuracy(input.targetText, transcribedText);

    // 4. Save Attempt
    const attempt = await this.repo.create({
      user_id: input.userId,
      exercise_id: input.exerciseId,
      item_number: input.itemNumber,
      transcribed_text: transcribedText,
      target_text: input.targetText,
      accuracy,
      ai_feedback: aiFeedback,
      ai_model: 'gemini-2.5-flash',
      duration_seconds: 0, // Duration could be extracted if needed, setting 0 for now
    });

    return attempt;
  }
}
