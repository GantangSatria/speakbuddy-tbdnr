export class ChatMessage {
  id!: string;
  consultation_id!: string;
  sender_id!: string;
  sender_role!: 'parent' | 'therapist';
  message!: string;
  created_at?: Date;
}