import { Injectable, Logger } from '@nestjs/common';
import * as speech from '@google-cloud/speech';
import { ISTTProvider } from '../../../application/ports/stt.port';

@Injectable()
export class GoogleSttService implements ISTTProvider {
  private readonly logger = new Logger(GoogleSttService.name);
  private client: speech.v1.SpeechClient | null = null;

  constructor() {
    const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (credentialsPath) {
      this.client = new speech.v1.SpeechClient({ keyFilename: credentialsPath });
    } else {
      this.logger.warn('GOOGLE_APPLICATION_CREDENTIALS is not set. Attempting Default Credentials, STT might fail.');
      this.client = new speech.v1.SpeechClient(); // fallback to default
    }
  }

  async transcribeAudio(audioBuffer: Buffer): Promise<string> {
    if (!this.client) {
      throw new Error('Google Speech Client is not initialized');
    }

    try {
      const audioBytes = audioBuffer.toString('base64');
      const request = {
        audio: {
          content: audioBytes,
        },
        config: {
          encoding: 'MP3' as const,
          sampleRateHertz: 44100, // adjust or remove if not guaranteed
          languageCode: 'id-ID',
        },
      };

      const [response] = await this.client.recognize(request);
      if (!response.results || response.results.length === 0) {
        return '';
      }

      const transcription = response.results
        .map((result) => result.alternatives?.[0]?.transcript || '')
        .join(' ');

      return transcription;
    } catch (error: any) {
      this.logger.error('Failed to transcribe audio using Google STT', error);
      throw new Error('Gagal memproses audio. Pastikan file berupa MP3 yang valid.');
    }
  }
}
