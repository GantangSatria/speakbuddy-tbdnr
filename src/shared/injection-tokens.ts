// Token string untuk dependency injection antara interface (domain/application) dan implementasi konkret (infrastructure).

export const TOKENS = {
  // Repositories
  USER_REPO: 'IUserRepository',
  EXERCISE_REPO: 'IExerciseRepository',
  ATTEMPT_REPO: 'IExerciseAttemptRepository',
  CONSULTATION_REPO: 'IConsultationRepository',
  CHAT_REPO: 'IChatMessageRepository',

  // Service Ports
  HASH_SERVICE: 'IHashService',
  TOKEN_SERVICE: 'ITokenService',
} as const;