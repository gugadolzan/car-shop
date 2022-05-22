import { Schema, model as createModel, Document } from 'mongoose';
import MongoModel from './MongoModel';
import { Car } from '../interfaces/CarInterface';

interface CarDocument extends Car, Document {}

const carSchema = new Schema<CarDocument>(
  {
    model: String,
    year: Number,
    color: String,
    status: Boolean,
    buyValue: Number,
    doorsQty: Number,
    seatsQty: Number,
  },
  {
    versionKey: false,
  },
);

class CarModel extends MongoModel<Car> {
  constructor(model = createModel('Cars', carSchema)) {
    super(model);
  }
}

export default CarModel;
