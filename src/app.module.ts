import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

// Core
import { SharedModule } from './modules/shared.module';

// Feature Modules
import { AuthModule } from './modules/auth.module';
import { UsersModule } from './modules/users.module';
import { ExercisesModule } from './modules/exercises.module';
import { ExerciseAttemptsModule } from './modules/exercise-attempts.module';
import { ConsultationsModule } from './modules/consultations.module';
import { ChatMessagesModule } from './modules/chat-messages.module';

@Module({
  imports: [
    // Environment
    ConfigModule.forRoot({ isGlobal: true }),

    // Database
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI', 'mongodb://localhost:27017/speakbuddy_db'),
      }),
    }),

    // Shared (global: JWT, Bcrypt)
    SharedModule,

    // Features
    AuthModule,
    UsersModule,
    ExercisesModule,
    ExerciseAttemptsModule,
    ConsultationsModule,
    ChatMessagesModule,
  ],
})
export class AppModule {}