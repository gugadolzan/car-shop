import * as sinon from 'sinon';
import chai from 'chai';
import chaiHttp = require('chai-http');

import server from '../../../server';

import CarModel from '../../../models/Car';
import MotorcycleModel from '../../../models/Motorcycle';

import * as carMock from '../../__mocks__/Car';
import * as motorcycleMock from '../../__mocks__/Motorcycle';

chai.use(chaiHttp);

const { expect } = chai;

const app = server.getApp();
const carModel = new CarModel();
const motorcycleModel = new MotorcycleModel();

describe('Car Controller', () => {
  describe('POST /cars', () => {
    describe('when there is an unexpected error', () => {
      before(async () => {
        sinon.stub(carModel.model, 'create').throws();
      });

      after(() => {
        (carModel.model.create as sinon.SinonStub).restore();
      });

      it('should return a 500 error', async () => {
        const res = await chai
          .request(app)
          .post('/cars')
          .send(carMock.validCar);
        expect(res.status).to.be.equal(500);
      });

      it('should return a message with the error', async () => {
        const res = await chai
          .request(app)
          .post('/cars')
          .send(carMock.validCar);
        expect(res.body.error).to.be.equal('Internal Server Error');
      });
    });

    describe('when the request is invalid', () => {
      describe('when the field `model` is missing', () => {
        it('should return a 400 error', async () => {
          const res = await chai
            .request(app)
            .post('/cars')
            .send(carMock.noModelCar);
          expect(res.status).to.be.equal(400);
        });
      });

      describe('when the field `year` is missing', () => {
        it('should return a 400 error', async () => {
          const res = await chai
            .request(app)
            .post('/cars')
            .send(carMock.noYearCar);
          expect(res.status).to.be.equal(400);
        });
      });

      describe('when the field `color` is missing', () => {
        it('should return a 400 error', async () => {
          const res = await chai
            .request(app)
            .post('/cars')
            .send(carMock.noColorCar);
          expect(res.status).to.be.equal(400);
        });
      });

      describe('when the field `buyValue` is missing', () => {
        it('should return a 400 error', async () => {
          const res = await chai
            .request(app)
            .post('/cars')
            .send(carMock.noBuyValueCar);
          expect(res.status).to.be.equal(400);
        });
      });

      describe('when the field `seatsQty` is missing', () => {
        it('should return a 400 error', async () => {
          const res = await chai
            .request(app)
            .post('/cars')
            .send(carMock.noSeatsCar);
          expect(res.status).to.be.equal(400);
        });
      });

      describe('when the field `doorsQty` is missing', () => {
        it('should return a 400 error', async () => {
          const res = await chai
            .request(app)
            .post('/cars')
            .send(carMock.noDoorsCar);
          expect(res.status).to.be.equal(400);
        });
      });
    });

    describe('when the request is valid', () => {
      before(async () => {
        sinon.stub(carModel.model, 'create').resolves(carMock.validCar);
      });

      after(() => {
        (carModel.model.create as sinon.SinonStub).restore();
      });

      it('should return a valid car', async () => {
        const res = await chai
          .request(app)
          .post('/cars')
          .send(carMock.validCar);
        expect(res.status).to.be.equal(201);
        expect(res.body).to.be.deep.equal(carMock.validCar);
      });
    });
  });

  describe('GET /cars', () => {
    describe('when there is an unexpected error', () => {
      before(async () => {
        sinon.stub(carModel.model, 'find').throws();
      });

      after(() => {
        (carModel.model.find as sinon.SinonStub).restore();
      });

      it('should return a 500 error', async () => {
        const res = await chai.request(app).get('/cars');
        expect(res.status).to.be.equal(500);
      });

      it('should return a message with the error', async () => {
        const res = await chai.request(app).get('/cars');
        expect(res.body.error).to.be.equal('Internal Server Error');
      });
    });

    describe('when there is no car', () => {
      before(async () => {
        sinon.stub(carModel.model, 'find').resolves([]);
      });

      after(() => {
        (carModel.model.find as sinon.SinonStub).restore();
      });

      it('should return a list of cars', async () => {
        const res = await chai.request(app).get('/cars');
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.deep.equal([]);
      });
    });
  });

  describe('GET /cars/:id', () => {
    describe('when there is an unexpected error', () => {
      before(async () => {
        sinon.stub(carModel.model, 'findById').throws();
      });

      after(() => {
        (carModel.model.findById as sinon.SinonStub).restore();
      });

      it('should return a 500 error', async () => {
        const res = await chai
          .request(app)
          .get(`/cars/${carMock.validCar._id}`);
        expect(res.status).to.be.equal(500);
      });

      it('should return a message with the error', async () => {
        const res = await chai
          .request(app)
          .get(`/cars/${carMock.validCar._id}`);
        expect(res.body.error).to.be.equal('Internal Server Error');
      });
    });

    describe('when id is invalid', () => {
      it('should return a 400 error', async () => {
        const res = await chai.request(app).get('/cars/invalid-id');
        expect(res.status).to.be.equal(400);
      });

      it('should return a message with the error', async () => {
        const res = await chai.request(app).get('/cars/invalid-id');
        expect(res.body.error).to.be.equal(
          'Id must have 24 hexadecimal characters',
        );
      });
    });

    describe('when the car does not exist', () => {
      before(async () => {
        sinon.stub(carModel.model, 'findById').resolves(null);
      });

      after(() => {
        (carModel.model.findById as sinon.SinonStub).restore();
      });

      it('should return a 404 error', async () => {
        const res = await chai
          .request(app)
          .get(`/cars/${carMock.validCar._id}`);
        expect(res.status).to.be.equal(404);
      });
    });

    describe('when the car exists', () => {
      before(async () => {
        sinon
          .stub(carModel.model, 'findById')
          .resolves(carMock.coverageCar as any);
      });

      after(() => {
        (carModel.model.findById as sinon.SinonStub).restore();
      });

      it('should return a valid car', async () => {
        const { _id, ...car } = carMock.validCar;
        const res = await chai.request(app).get(`/cars/${_id}`);
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.deep.equal(car);
      });
    });
  });

  describe('PUT /cars/:id', () => {
    describe('when there is an unexpected error', () => {
      before(async () => {
        sinon.stub(carModel.model, 'findByIdAndUpdate').throws();
      });

      after(() => {
        (carModel.model.findByIdAndUpdate as sinon.SinonStub).restore();
      });

      it('should return a 500 error', async () => {
        const res = await chai
          .request(app)
          .put(`/cars/${carMock.validCar._id}`)
          .send(carMock.validCar);
        expect(res.status).to.be.equal(500);
      });

      it('should return a message with the error', async () => {
        const res = await chai
          .request(app)
          .put(`/cars/${carMock.validCar._id}`)
          .send(carMock.validCar);
        expect(res.body.error).to.be.equal('Internal Server Error');
      });
    });

    describe('when id is invalid', () => {
      it('should return a 400 error', async () => {
        const res = await chai.request(app).put('/cars/invalid-id');
        expect(res.status).to.be.equal(400);
      });

      it('should return a message with the error', async () => {
        const res = await chai.request(app).put('/cars/invalid-id');
        expect(res.body.error).to.be.equal(
          'Id must have 24 hexadecimal characters',
        );
      });
    });

    describe('when the car does not exist', () => {
      before(async () => {
        sinon.stub(carModel.model, 'findByIdAndUpdate').resolves(null);
      });

      after(() => {
        (carModel.model.findByIdAndUpdate as sinon.SinonStub).restore();
      });

      it('should return a 404 error', async () => {
        const res = await chai
          .request(app)
          .put(`/cars/${carMock.validCar._id}`)
          .send(carMock.updatedCar);
        expect(res.status).to.be.equal(404);
      });
    });

    describe('when the car exists', () => {
      before(async () => {
        sinon
          .stub(carModel.model, 'findByIdAndUpdate')
          .resolves(carMock.updatedCar as any);
      });

      after(() => {
        (carModel.model.findByIdAndUpdate as sinon.SinonStub).restore();
      });

      describe('when the request is valid', () => {
        it('should return a valid car', async () => {
          const res = await chai
            .request(app)
            .put(`/cars/${carMock.validCar._id}`)
            .send(carMock.updatedCar);
          expect(res.status).to.be.equal(200);
          expect(res.body).to.be.deep.equal(carMock.updatedCar);
        });
      });
    });
  });

  describe('DELETE /cars/:id', () => {
    describe('when there is an unexpected error', () => {
      before(async () => {
        sinon.stub(carModel.model, 'findByIdAndDelete').throws();
      });

      after(() => {
        (carModel.model.findByIdAndDelete as sinon.SinonStub).restore();
      });

      it('should return a 500 error', async () => {
        const res = await chai
          .request(app)
          .delete(`/cars/${carMock.validCar._id}`);
        expect(res.status).to.be.equal(500);
      });

      it('should return a message with the error', async () => {
        const res = await chai
          .request(app)
          .delete(`/cars/${carMock.validCar._id}`);
        expect(res.body.error).to.be.equal('Internal Server Error');
      });
    });

    describe('when the car does not exist', () => {
      before(async () => {
        sinon.stub(carModel.model, 'findByIdAndDelete').resolves(null);
      });

      after(() => {
        (carModel.model.findByIdAndDelete as sinon.SinonStub).restore();
      });

      it('should return a 404 error', async () => {
        const res = await chai
          .request(app)
          .delete(`/cars/${carMock.validCar._id}`);
        expect(res.status).to.be.equal(404);
      });
    });

    describe('when the car exists', () => {
      before(async () => {
        sinon
          .stub(carModel.model, 'findByIdAndDelete')
          .resolves(carMock.validCar as any);
      });

      after(() => {
        (carModel.model.findByIdAndDelete as sinon.SinonStub).restore();
      });

      it('should return status 204', async () => {
        const res = await chai
          .request(app)
          .delete(`/cars/${carMock.validCar._id}`);
        expect(res.status).to.be.equal(204);
      });
    });
  });
});

describe('Motorcycle Controller', () => {
  describe('POST /motorcycles', () => {
    describe('when the request is invalid', () => {
      it('should return a 400 error', async () => {
        const res = await chai
          .request(app)
          .post('/motorcycles')
          .send(motorcycleMock.noModelMotorcycle);
        expect(res.status).to.be.equal(400);
      });
    });

    describe('when the request is valid', () => {
      before(async () => {
        sinon
          .stub(motorcycleModel.model, 'create')
          .resolves(motorcycleMock.validMotorcycle);
      });

      after(() => {
        (motorcycleModel.model.create as sinon.SinonStub).restore();
      });

      it('should return a valid motorcycle', async () => {
        const res = await chai
          .request(app)
          .post('/motorcycles')
          .send(motorcycleMock.coverageMotorcycle);
        expect(res.status).to.be.equal(201);
        expect(res.body).to.be.deep.equal(motorcycleMock.validMotorcycle);
      });
    });
  });

  describe('GET /motorcycles', () => {
    before(async () => {
      sinon.stub(motorcycleModel.model, 'find').resolves([]);
    });

    after(() => {
      (motorcycleModel.model.find as sinon.SinonStub).restore();
    });

    it('should return a list of motorcycles', async () => {
      const res = await chai.request(app).get('/motorcycles');
      expect(res.status).to.be.equal(200);
      expect(res.body).to.be.deep.equal([]);
    });
  });

  describe('GET /motorcycles/:id', () => {
    describe('when the motorcycle does not exist', () => {
      before(async () => {
        sinon.stub(motorcycleModel.model, 'findById').resolves(null);
      });

      after(() => {
        (motorcycleModel.model.findById as sinon.SinonStub).restore();
      });

      it('should return a 404 error', async () => {
        const res = await chai
          .request(app)
          .get(`/motorcycles/${motorcycleMock.validMotorcycle._id}`);
        expect(res.status).to.be.equal(404);
      });
    });

    describe('when the motorcycle exists', () => {
      before(async () => {
        sinon
          .stub(motorcycleModel.model, 'findById')
          .resolves(motorcycleMock.coverageMotorcycle as any);
      });

      after(() => {
        (motorcycleModel.model.findById as sinon.SinonStub).restore();
      });

      it('should return a valid motorcycle', async () => {
        const { _id, ...motorcycle } = motorcycleMock.validMotorcycle;
        const res = await chai.request(app).get(`/motorcycles/${_id}`);
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.deep.equal(motorcycle);
      });
    });
  });

  describe('PUT /motorcycles/:id', () => {
    describe('when the motorcycle does not exist', () => {
      before(async () => {
        sinon.stub(motorcycleModel.model, 'findByIdAndUpdate').resolves(null);
      });

      after(() => {
        (motorcycleModel.model.findByIdAndUpdate as sinon.SinonStub).restore();
      });

      it('should return a 404 error', async () => {
        const res = await chai
          .request(app)
          .put(`/motorcycles/${motorcycleMock.validMotorcycle._id}`)
          .send(motorcycleMock.updatedMotorcycle);
        expect(res.status).to.be.equal(404);
      });
    });

    describe('when the motorcycle exists', () => {
      before(async () => {
        sinon
          .stub(motorcycleModel.model, 'findByIdAndUpdate')
          .resolves(motorcycleMock.updatedMotorcycle as any);
      });

      after(() => {
        (motorcycleModel.model.findByIdAndUpdate as sinon.SinonStub).restore();
      });

      describe('when the request is valid', () => {
        it('should return a valid motorcycle', async () => {
          const res = await chai
            .request(app)
            .put(`/motorcycles/${motorcycleMock.validMotorcycle._id}`)
            .send(motorcycleMock.updatedMotorcycle);
          expect(res.status).to.be.equal(200);
          expect(res.body).to.be.deep.equal(motorcycleMock.updatedMotorcycle);
        });
      });
    });
  });

  describe('DELETE /motorcycles/:id', () => {
    describe('when the motorcycle does not exist', () => {
      before(async () => {
        sinon.stub(motorcycleModel.model, 'findByIdAndDelete').resolves(null);
      });

      after(() => {
        (motorcycleModel.model.findByIdAndDelete as sinon.SinonStub).restore();
      });

      it('should return a 404 error', async () => {
        const res = await chai
          .request(app)
          .delete(`/motorcycles/${motorcycleMock.validMotorcycle._id}`);
        expect(res.status).to.be.equal(404);
      });
    });

    describe('when the motorcycle exists', () => {
      before(async () => {
        sinon
          .stub(motorcycleModel.model, 'findByIdAndDelete')
          .resolves(motorcycleMock.validMotorcycle as any);
      });

      after(() => {
        (motorcycleModel.model.findByIdAndDelete as sinon.SinonStub).restore();
      });

      it('should return status 204', async () => {
        const res = await chai
          .request(app)
          .delete(`/motorcycles/${motorcycleMock.validMotorcycle._id}`);
        expect(res.status).to.be.equal(204);
      });
    });
  });
});
