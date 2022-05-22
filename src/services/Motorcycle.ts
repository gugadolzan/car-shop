import Service, { ServiceError } from '.';
import {
  Motorcycle,
  MotorcycleSchema,
} from '../interfaces/MotorcycleInterface';
import MotorcycleModel from '../models/Motorcycle';

class MotorcycleService extends Service<Motorcycle> {
  constructor(model = new MotorcycleModel()) {
    super(model);
  }

  create = async (
    obj: Motorcycle,
  ): Promise<Motorcycle | null | ServiceError> => {
    const parsed = MotorcycleSchema.safeParse(obj);
    if (!parsed.success) return { error: parsed.error };
    return this.model.create(obj);
  };

  update = async (
    id: string,
    obj: Motorcycle,
  ): Promise<Motorcycle | null | ServiceError> => {
    const parsed = MotorcycleSchema.safeParse(obj);
    if (!parsed.success) return { error: parsed.error };
    return this.model.update(id, obj);
  };
}

export default MotorcycleService;
