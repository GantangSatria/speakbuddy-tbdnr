import { Exercise } from '../../../domain/entities/exercise.entity';

export class ExerciseMapper {
  static toDomain(doc: any): Exercise {
    const ex = new Exercise();
    ex.id = doc._id.toString();
    ex.title = doc.title;
    ex.level = doc.level;
    ex.category = doc.category;
    ex.description = doc.description;
    ex.items = doc.items ?? [];
    ex.created_at = doc.created_at;
    ex.updated_at = doc.updated_at;
    return ex;
  }
}