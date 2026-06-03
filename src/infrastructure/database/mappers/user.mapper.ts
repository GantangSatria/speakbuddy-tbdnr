import { User } from '../../../domain/entities/user.entity';

export class UserMapper {
  static toDomain(doc: any): User {
    const user = new User();
    user.id = doc._id.toString();
    user.name = doc.name;
    user.email = doc.email;
    user.password_hash = doc.password_hash;
    user.role = doc.role;
    user.profile = doc.profile ?? undefined;
    user.child = doc.child ?? undefined;
    user.created_at = doc.created_at;
    user.updated_at = doc.updated_at;
    return user;
  }
}