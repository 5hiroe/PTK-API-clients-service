import mongoose from 'mongoose';
import { expect } from 'chai';
import sinon from 'sinon';
import { configure } from '../../src/configurations/mongo.js';

describe('Mongo Configuration', () => {
  let connectStub;

  beforeEach(() => {
    connectStub = sinon.stub(mongoose, 'connect').resolves();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should connect to MongoDB', async () => {
    await configure();

    expect(connectStub.calledOnceWithExactly(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })).to.be.true;
  });

  it('should handle connection errors', async () => {
    connectStub.rejects(new Error('Connection failed'));

    try {
      await configure();
    } catch (error) {
      expect(error.message).to.equal('Connection failed');
    }
  });
});
