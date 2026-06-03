export interface ISTTProvider {
  transcribeAudio(audioBuffer: Buffer): Promise<string>;
}
