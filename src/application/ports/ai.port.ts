export interface IAIProvider {
  getFeedback(targetText: string, transcribedText: string): Promise<string>;
}
