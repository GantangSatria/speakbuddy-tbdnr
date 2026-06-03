/**
 * Seed Script — SpeakBuddy
 * Jalankan: npm run seed
 *
 * Yang di-seed:
 *  • 1 parent
 *  • 2 therapist
 *  • 3 exercise (beginner / intermediate / advanced)
 *  • 2 consultation (parent → masing-masing therapist)
 *  • 4 exercise_attempt (oleh parent)
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

const MONGO_URI =
  process.env.MONGODB_URI ??
  'mongodb://localhost:27017/speakbuddy_db';

enum Role {
  PARENT = 'parent',
  THERAPIST = 'therapist',
}

enum SpeechLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

enum ExerciseLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

enum ConsultationStatus {
  PENDING = 'pending',
  PAID = 'paid',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// ── Schemas (raw — tanpa NestJS DI) ───────────────────────────────────────
const ProfileSchema = new mongoose.Schema(
  { phone: String, age: Number, sex: String, address: String, specialization: String, fee: Number },
  { _id: false },
);

const ChildSchema = new mongoose.Schema(
  {
    child_name: String,
    child_age: Number,
    child_sex: String,
    speech_level: {
      type: String,
      enum: Object.values(SpeechLevel),
    },
  },
  { _id: false },
);

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, lowercase: true },
    password_hash: String,
    role: {
        type: String,
        enum: Object.values(Role),
        },
    profile: ProfileSchema,
    child: ChildSchema,
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

const ExerciseItemSchema = new mongoose.Schema(
  { item_number: Number, target_text: String, hint: String },
  { _id: false },
);

const ExerciseSchema = new mongoose.Schema(
  {
    title: String,
    level: {
        type: String,
        enum: Object.values(ExerciseLevel),
        },
    category: String,
    description: String,
    items: [ExerciseItemSchema],
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

const ConsultationSchema = new mongoose.Schema(
  {
    user_id: mongoose.Schema.Types.ObjectId,
    therapist_user_id: mongoose.Schema.Types.ObjectId,
    child_name: String,
    child_age: Number,
    child_sex: String,
    date: Date,
    time_slot: String,
    is_paid: { type: Boolean, default: false },
    fee: Number,
    payment_method: String,
    status: {
        type: String,
        enum: Object.values(ConsultationStatus),
        default: ConsultationStatus.PENDING,
        },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

const ExerciseAttemptSchema = new mongoose.Schema(
  {
    user_id: mongoose.Schema.Types.ObjectId,
    exercise_id: mongoose.Schema.Types.ObjectId,
    item_number: Number,
    transcribed_text: String,
    target_text: String,
    accuracy: Number,
    ai_feedback: String,
    ai_model: String,
    duration_seconds: Number,
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } },
);

UserSchema.index({ role: 1 });

ExerciseSchema.index({
  level: 1,
  category: 1,
});

ConsultationSchema.index({
  user_id: 1,
  status: 1,
});

ConsultationSchema.index({
  therapist_user_id: 1,
  status: 1,
});

ExerciseAttemptSchema.index({
  user_id: 1,
  created_at: -1,
});

ExerciseAttemptSchema.index({
  accuracy: -1,
});

// ── Models ─────────────────────────────────────────────────────────────────
const UserModel        = mongoose.model('User', UserSchema);
const ExerciseModel    = mongoose.model('Exercise', ExerciseSchema);
const ConsultationModel = mongoose.model('Consultation', ConsultationSchema);
const AttemptModel     = mongoose.model('ExerciseAttempt', ExerciseAttemptSchema);

// ── Helper ─────────────────────────────────────────────────────────────────
const hash = (plain: string) => bcrypt.hash(plain, 12);

// ── Main ───────────────────────────────────────────────────────────────────
async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log(`\n🌱  Terhubung ke MongoDB: ${MONGO_URI}`);

  // Bersihkan koleksi
  await Promise.all([
    UserModel.deleteMany({}),
    ExerciseModel.deleteMany({}),
    ConsultationModel.deleteMany({}),
    AttemptModel.deleteMany({}),
  ]);
  console.log('🧹  Koleksi dibersihkan');

  // ── Users ──────────────────────────────────────────────────────────────
  const [parent, therapist1, therapist2] = await UserModel.insertMany([
    {
      name: 'Budi Santoso',
      email: 'budi@example.com',
      password_hash: await hash('password123'),
      role: Role.PARENT,
      profile: { phone: '081234567890', age: 35, sex: 'male', address: 'Surabaya' },
      child: { child_name: 'Andi', child_age: 6, child_sex: 'male', speech_level: SpeechLevel.BEGINNER },
    },
    {
      name: 'Dr. Siti Rahayu',
      email: 'siti@example.com',
      password_hash: await hash('password123'),
      role: Role.THERAPIST,
      profile: {
        phone: '082345678901',
        age: 40,
        sex: 'female',
        address: 'Jakarta',
        specialization: 'Terapi Wicara Anak',
        fee: 250000,
      },
    },
    {
      name: 'Dr. Ahmad Fauzi',
      email: 'ahmad@example.com',
      password_hash: await hash('password123'),
      role: Role.THERAPIST,
      profile: {
        phone: '083456789012',
        age: 38,
        sex: 'male',
        address: 'Bandung',
        specialization: 'Patologi Wicara',
        fee: 300000,
      },
    },
  ]);
  console.log(`👤  Users dibuat : parent(${parent._id}), terapis1(${therapist1._id}), terapis2(${therapist2._id})`);

  // ── Exercises ──────────────────────────────────────────────────────────
  const [exBeginner, exIntermediate, exAdvanced] = await ExerciseModel.insertMany([
    {
      title: 'Latihan Vokal Dasar',
      level: ExerciseLevel.BEGINNER,
      category: 'vokal',
      description: 'Melatih pengucapan huruf vokal dasar (a, i, u, e, o)',
      items: [
        { item_number: 1, target_text: 'a', hint: 'Buka mulut lebar' },
        { item_number: 2, target_text: 'i', hint: 'Tarik sudut bibir' },
        { item_number: 3, target_text: 'u', hint: 'Monyongkan bibir' },
        { item_number: 4, target_text: 'e', hint: 'Buka mulut setengah' },
        { item_number: 5, target_text: 'o', hint: 'Bulatkan bibir' },
      ],
    },
    {
      title: 'Kata Benda Sederhana',
      level: ExerciseLevel.INTERMEDIATE,
      category: 'kata_benda',
      description: 'Melatih pengucapan kata benda sehari-hari',
      items: [
        { item_number: 1, target_text: 'bola', hint: 'Benda yang dipakai bermain' },
        { item_number: 2, target_text: 'mama', hint: 'Panggilan untuk ibu' },
        { item_number: 3, target_text: 'makan', hint: '' },
        { item_number: 4, target_text: 'minum', hint: '' },
        { item_number: 5, target_text: 'tidur', hint: '' },
      ],
    },
    {
      title: 'Kalimat Pendek',
      level: ExerciseLevel.ADVANCED,
      category: 'kalimat',
      description: 'Melatih pengucapan kalimat pendek sehari-hari',
      items: [
        { item_number: 1, target_text: 'saya mau makan', hint: '' },
        { item_number: 2, target_text: 'aku minta tolong', hint: '' },
        { item_number: 3, target_text: 'selamat pagi mama', hint: '' },
        { item_number: 4, target_text: 'aku sudah siap', hint: '' },
      ],
    },
  ]);
  console.log(`📚  Exercises    : beginner(${exBeginner._id}), intermediate(${exIntermediate._id}), advanced(${exAdvanced._id})`);

  // ── Consultations ──────────────────────────────────────────────────────
  const [consult1, consult2] = await ConsultationModel.insertMany([
    {
      user_id: parent._id,
      therapist_user_id: therapist1._id,
      child_name: 'Andi',
      child_age: 6,
      child_sex: 'male',
      date: new Date('2025-07-10'),
      time_slot: '09:00',
      is_paid: true,
      fee: 250000,
      payment_method: 'transfer',
      status: ConsultationStatus.PAID,
    },
    {
      user_id: parent._id,
      therapist_user_id: therapist2._id,
      child_name: 'Andi',
      child_age: 6,
      child_sex: 'male',
      date: new Date('2025-07-17'),
      time_slot: '10:00',
      is_paid: false,
      fee: 300000,
      status: ConsultationStatus.PENDING,
    },
  ]);
  console.log(`📅  Consultations : ${consult1._id}, ${consult2._id}`);

  // ── Exercise Attempts ──────────────────────────────────────────────────
  await AttemptModel.insertMany([
    {
      user_id: parent._id,
      exercise_id: exBeginner._id,
      item_number: 1,
      transcribed_text: 'a',
      target_text: 'a',
      accuracy: 98,
      ai_feedback: 'Pengucapan vokal "a" sangat bagus!',
      ai_model: 'gemini-2.5-flash',
      duration_seconds: 3,
    },
    {
      user_id: parent._id,
      exercise_id: exBeginner._id,
      item_number: 2,
      transcribed_text: 'ii',
      target_text: 'i',
      accuracy: 70,
      ai_feedback: 'Hampir benar, coba persingkat pengucapannya.',
      ai_model: 'gemini-2.5-flash',
      duration_seconds: 4,
    },
    {
      user_id: parent._id,
      exercise_id: exIntermediate._id,
      item_number: 1,
      transcribed_text: 'bola',
      target_text: 'bola',
      accuracy: 95,
      ai_feedback: 'Excellent! Pengucapan sangat jelas.',
      ai_model: 'gemini-2.5-flash',
      duration_seconds: 5,
    },
    {
      user_id: parent._id,
      exercise_id: exIntermediate._id,
      item_number: 2,
      transcribed_text: 'mama',
      target_text: 'mama',
      accuracy: 100,
      ai_feedback: 'Sempurna!',
      ai_model: 'gemini-2.5-flash',
      duration_seconds: 3,
    },
  ]);
  console.log(`📝  Attempts     : 4 attempt dibuat untuk parent`);

  // ── Summary ────────────────────────────────────────────────────────────
  console.log('\n✅  Seeding selesai!\n');
  console.log('   Login credentials (semua password: password123):');
  console.log(`   🧑  Parent    : budi@example.com`);
  console.log(`   👩‍⚕️  Terapis 1 : siti@example.com`);
  console.log(`   👨‍⚕️  Terapis 2 : ahmad@example.com\n`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌  Seed gagal:', err);
  mongoose.disconnect();
  process.exit(1);
});

//