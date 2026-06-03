import { Consultation } from '../../../domain/entities/consultation.entity';

export class ConsultationMapper {
  static toDomain(doc: any): Consultation {
    const c = new Consultation();
    c.id = doc._id.toString();
    c.user_id = doc.user_id.toString();
    c.therapist_user_id = doc.therapist_user_id.toString();
    c.child_name = doc.child_name;
    c.child_age = doc.child_age;
    c.child_sex = doc.child_sex;
    c.date = doc.date;
    c.time_slot = doc.time_slot;
    c.is_paid = doc.is_paid;
    c.fee = doc.fee;
    c.payment_method = doc.payment_method;
    c.status = doc.status;
    c.created_at = doc.created_at;
    c.updated_at = doc.updated_at;
    return c;
  }
}