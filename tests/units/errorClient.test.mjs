import sinon from 'sinon';
import assert from 'assert';
import ErrorService from '../../src/services/error.js';
import ErrorModel from '../../src/models/error.js';

describe('ErrorService', function() {
  let errorService;
  let saveStub;
  let findStub;

  beforeEach(function() {
    errorService = new ErrorService();
    saveStub = sinon.stub(ErrorModel.prototype, 'save');
    findStub = sinon.stub(ErrorModel, 'find');
  });

  afterEach(function() {
    sinon.restore();
  });

  describe('create', function() {
    it('should create a new error entry', async function() {
      const mockError = { error: 'Sample error', stack: 'Sample stack' };
      const errorModel = new ErrorModel(mockError);
      saveStub.resolves(errorModel);

      const createdError = await errorService.create(mockError);
      assert.strictEqual(createdError.error, 'Sample error');
      assert.strictEqual(createdError.stack, 'Sample stack');
    });
  });

  describe('getAll', function() {
    it('should return all error entries', async function() {
      const mockErrors = [{ error: 'Sample error', stack: 'Sample stack' }];
      findStub.resolves(mockErrors);

      const errors = await errorService.getAll();
      assert.strictEqual(errors.length, 1);
      assert.strictEqual(errors[0].error, 'Sample error');
    });
  });
});
