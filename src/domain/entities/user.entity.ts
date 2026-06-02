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
  speech_level?: 'beginner' | 'intermediate' | 'advanced';
}

export class User {
  id!: string;
  name!: string;
  email!: string;
  password_hash!: string;
  role!: 'parent' | 'therapist';
  profile?: UserProfile;
  child?: UserChild; // hanya untuk role = 'parent'
  created_at?: Date;
  updated_at?: Date;
}