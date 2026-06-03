export enum Role {
  PARENT = 'parent',
  THERAPIST = 'therapist',
}

export enum SpeechLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export interface UserProfile {
  phone?: string;
  age?: number;
  sex?: string;
  address?: string;
  specialization?: string; // khusus terapis
  fee?: number;            // khusus terapis
}

export interface UserChild {
  child_name?: string;
  child_age?: number;
  child_sex?: string;
  speech_level?: SpeechLevel;
}

export class User {
  id!: string;
  name!: string;
  email!: string;
  password_hash!: string;
  role!: Role;
  profile?: UserProfile;
  child?: UserChild; // hanya untuk role = 'parent'
  created_at?: Date;
  updated_at?: Date;
}