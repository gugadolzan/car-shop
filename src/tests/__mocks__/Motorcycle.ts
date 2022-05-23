import { Types } from 'mongoose';

export const validMotorcycle = {
  _id: new Types.ObjectId().toString(),
  model: 'Honda CG Titan 125',
  year: 1963,
  color: 'red',
  buyValue: 3500,
  category: 'Street',
  engineCapacity: 125,
};

export const updatedMotorcycle = {
  _id: validMotorcycle._id.toString(),
  model: 'Honda CG Titan 125',
  year: 1963,
  color: 'black',
  buyValue: 3500,
  category: 'Street',
  engineCapacity: 125,
};

export const coverageMotorcycle = {
  model: 'Honda CG Titan 125',
  year: 1963,
  color: 'red',
  buyValue: 3500,
  category: 'Street',
  engineCapacity: 125,
};

export const noModelMotorcycle = {
  year: 1963,
  color: 'red',
  buyValue: 3500,
  category: 'Street',
  engineCapacity: 125,
};
