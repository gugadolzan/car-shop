import Service, { ServiceError } from '.';
import { Car, CarSchema } from '../interfaces/CarInterface';
import CarModel from '../models/Car';

class CarService extends Service<Car> {
  constructor(model = new CarModel()) {
    super(model);
  }

  create = async (obj: Car): Promise<Car | null | ServiceError> => {
    const parsed = CarSchema.safeParse(obj);
    if (!parsed.success) return { error: parsed.error };
    return this.model.create(obj);
  };

  update = async (id: string, obj: Car): Promise<Car | null | ServiceError> => {
    const parsed = CarSchema.safeParse(obj);
    if (!parsed.success) return { error: parsed.error };
    return this.model.update(id, obj);
  };
}

export default CarService;
