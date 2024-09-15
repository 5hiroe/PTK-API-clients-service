import { expect } from 'chai';
import sinon from 'sinon';
import { HttpError } from '../../src/globals/errors.js';
import ErrorService from '../../src/services/error.js';
import handleError from '../../src/helpers/error_handler.js'; // Assure-toi que le chemin est correct

describe('handleError Middleware', () => {
  let res, next;

  beforeEach(() => {
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis()
    };
    next = sinon.spy();
  });

  describe('when the error is an instance of HttpError', () => {
    it('should return the error status and json', async () => {
      const err = new HttpError({ message: 'Custom error', status: 400 });
      res.json = sinon.stub().returnsThis();
      await handleError(err, {}, res, next);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ message: 'Custom error' })).to.be.true;
      expect(next.notCalled).to.be.true;
    });
  });

  describe('when the error is not an instance of HttpError', () => {
    let createStub;

    beforeEach(() => {
      createStub = sinon.stub(ErrorService.prototype, 'create').resolves();
    });

    afterEach(() => {
      createStub.restore();
    });

    it('should call ErrorService.create and return a generic error response', async () => {
      const err = new Error('Test error');
      await handleError(err, {}, res, next);
      expect(createStub.calledWith({ error: 'Test error', stack: err.stack })).to.be.true;
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({
        message: "Oups, quelque chose s'est cassé... Nous nous en occupons !",
        error: 'Test error',
        stack: err.stack
      })).to.be.true;
      expect(next.notCalled).to.be.true;
    });
  });
});
