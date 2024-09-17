import sinon from 'sinon';
import assert from 'assert';
import ClientService from '../../src/services/clients.js';
import ClientModel from '../../src/models/client.js';
import { NotFound } from '../../src/globals/errors.js';

describe('ClientService', function() {
  let clientService;
  let findStub;
  let findByIdStub;
  let findByIdAndUpdateStub;
  let saveStub;
  let findByIdAndDeleteStub;

  beforeEach(function() {
    clientService = new ClientService();
    findStub = sinon.stub(ClientModel, 'find');
    findByIdStub = sinon.stub(ClientModel, 'findById');
    findByIdAndUpdateStub = sinon.stub(ClientModel, 'findByIdAndUpdate');
    saveStub = sinon.stub(ClientModel.prototype, 'save');
    findByIdAndDeleteStub = sinon.stub(ClientModel, 'findByIdAndDelete');
  });

  afterEach(function() {
    sinon.restore();
  });

  describe('getAll', function() {
    it('should return all clients', async function() {
      const mockClients = [{ firstname: 'John', lastname: 'Doe' }];
      findStub.resolves(mockClients);

      const clients = await clientService.getAll();
      assert.strictEqual(clients.length, 1);
      assert.strictEqual(clients[0].firstname, 'John');
    });
  });

  describe('get', function() {
    it('should return a client by ID', async function() {
      const mockClient = { firstname: 'John', lastname: 'Doe' };
      findByIdStub.resolves(mockClient);

      const client = await clientService.get({ clientId: 'some-id' });
      assert.strictEqual(client.firstname, 'John');
    });

    it('should throw NotFound error if client not found', async function() {
      findByIdStub.resolves(null);

      try {
        await clientService.get({ clientId: 'some-id' });
        assert.fail('Expected error not thrown');
      } catch (err) {
        assert(err instanceof NotFound);
        assert.strictEqual(err.message, 'Client introuvable.');
      }
    });
  });

  describe('create', function() {
    it('should create a new client', async function() {
      const clientData = { firstname: 'John', lastname: 'Doe' };
      const mockClient = new ClientModel(clientData);
      saveStub.resolves(mockClient);

      const createdClient = await clientService.create({ fields: clientData });
      assert.strictEqual(createdClient.firstname, 'John');
    });
  });

  describe('update', function() {
    it('should update a client by ID', async function() {
      const clientId = 'some-id';
      const updateFields = { firstname: 'Jane' };
      const mockClient = { _id: clientId, firstname: 'Jane' };
      findByIdAndUpdateStub.resolves(mockClient);

      const updatedClient = await clientService.update({ clientId, fields: updateFields });
      assert.strictEqual(updatedClient.firstname, 'Jane');
    });

    it('should throw NotFound error if client to update is not found', async function() {
      const clientId = 'some-id';
      const updateFields = { firstname: 'Jane' };
      findByIdAndUpdateStub.resolves(null);

      try {
        await clientService.update({ clientId, fields: updateFields });
        assert.fail('Expected error not thrown');
      } catch (err) {
        assert(err instanceof NotFound);
        assert.strictEqual(err.message, 'Client introuvable.');
      }
    });
  });

  describe('remove', function() {
    it('should remove a client by ID', async function() {
      const clientId = 'some-id';
      findByIdAndDeleteStub.resolves({ _id: clientId });

      await clientService.remove({ clientId });
      assert(findByIdAndDeleteStub.calledOnceWithExactly(clientId));
    });

    it('should throw NotFound error if client to remove is not found', async function() {
      const clientId = 'some-id';
      findByIdAndDeleteStub.resolves(null);

      try {
        await clientService.remove({ clientId });
        assert.fail('Expected error not thrown');
      } catch (err) {
        assert(err instanceof NotFound);
        assert.strictEqual(err.message, 'Client introuvable.');
      }
    });
  });
});
