import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { IAIProvider } from '../../../application/ports/ai.port';

@Injectable()
export class GeminiAiService implements IAIProvider {
  private readonly logger = new Logger(GeminiAiService.name);
  private client: GoogleGenAI | null = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.client = new GoogleGenAI({ apiKey });
    } else {
      this.logger.warn('GEMINI_API_KEY is not set. AI Feedback will not work properly.');
    }
  }

  async getFeedback(targetText: string, transcribedText: string): Promise<string> {
    if (!this.client) {
      return 'AI Feedback is unavailable because the API key is not configured.';
    }

    const prompt = `
Seorang anak sedang belajar berbicara dan melafalkan kata dengan bantuan aplikasi terapi bicara.

Kalimat yang seharusnya diucapkan: "${targetText}"
Kalimat yang diucapkan anak: "${transcribedText}"

Tugasmu adalah membantu anak dengan cara:
1. Berikan pujian atau semangat di awal agar anak merasa percaya diri.
2. Jelaskan dengan lembut bagian mana yang terdengar kurang tepat (jangan gunakan kata "salah" secara langsung).
3. Berikan contoh pelafalan yang benar, bisa dibagi per suku kata bila perlu.
4. Gunakan kalimat yang lurus dan natural, tanpa simbol seperti *, **, -, ..., atau (pause) dan sebagainya.
5. Tutup dengan kalimat penyemangat singkat yang positif.

SANGAT PENTING:
- Jangan gunakan tanda bintang (*), tanda garis (-), tanda jeda (...), atau penanda jeda seperti (pause) atau (beri jeda).
- Hasil akhir harus berupa paragraf normal yang bisa langsung dibacakan oleh text-to-speech tanpa gangguan.

Gunakan gaya berbicara yang hangat, sederhana, dan cocok untuk anak-anak dengan speech delay.
Pastikan hasilmu mudah dimengerti ketika diubah menjadi suara oleh sistem text-to-speech.
`;

    try {
      const response = await this.client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return response.text || 'Tidak ada respons dari model Gemini';
    } catch (error: any) {
      this.logger.error('Failed to generate feedback from Gemini', error);
      return 'Terjadi kesalahan saat memproses umpan balik dari AI.';
    }
  }
}
