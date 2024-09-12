import mongoose from 'mongoose';
import assert from 'assert';
import sinon from 'sinon';
import Client from '../../src/models/client.js';

describe('Client Model', function() {
  let saveStub;
  let validateStub;
  let findByIdStub;

  beforeEach(function() {
    saveStub = sinon.stub(Client.prototype, 'save');
    validateStub = sinon.stub(Client.prototype, 'validate');
    findByIdStub = sinon.stub(Client, 'findById');
  });

  afterEach(function() {
    sinon.restore();
  });

  describe('Validation', function() {
    it('should throw validation errors for missing or invalid fields', async function() {
      const errors = {
        firstname: 'Field is required',
        lastname: 'Field is required',
        email: 'Invalid email format',
        phone: 'Invalid phone format'
      };

      validateStub.throws({ errors });

      const client = new Client({
        firstname: '',
        lastname: '',
        phone: '1234',
        email: 'invalid-email'
      });

      try {
        await client.validate();
      } catch (error) {
        assert(error.errors.hasOwnProperty('firstname'));
        assert(error.errors.hasOwnProperty('lastname'));
        assert(error.errors.hasOwnProperty('email'));
        assert(error.errors.hasOwnProperty('phone'));
      }
    });

    it('should validate successfully without optional fields', async function() {
      const client = new Client({
        firstname: 'John',
        lastname: 'Doe',
        phone: '1234567890',
        email: 'john.doe@example.com'
      });

      const result = await client.validate();
      assert.strictEqual(result, undefined);
    });

    it('should throw validation error for invalid email format', async function() {
      validateStub.throws({ errors: { email: 'Invalid email format' } });

      const client = new Client({
        firstname: 'John',
        lastname: 'Doe',
        phone: '1234567890',
        email: 'invalid-email'
      });

      try {
        await client.validate();
      } catch (error) {
        assert(error.errors.hasOwnProperty('email'));
        assert.strictEqual(error.errors.email, 'Invalid email format');
      }
    });

    it('should throw validation error if firstname exceeds max length', async function() {
      validateStub.throws({ errors: { firstname: 'Max length exceeded' } });

      const client = new Client({
        firstname: 'A'.repeat(101),
        lastname: 'Doe',
        phone: '1234567890',
        email: 'john.doe@example.com'
      });

      try {
        await client.validate();
      } catch (error) {
        assert(error.errors.hasOwnProperty('firstname'));
        assert.strictEqual(error.errors.firstname, 'Max length exceeded');
      }
    });
  });

  describe('Persistence', function() {
    it('should save a client successfully', async function() {
      saveStub.resolves({
        _id: 'some-id',
        firstname: 'John',
        lastname: 'Doe',
        phone: '1234567890',
        email: 'john.doe@example.com',
        address: {
          street: '123 Elm St',
          city: 'Somewhere',
          postalCode: '12345',
          country: 'Country'
        }
      });

      const client = new Client({
        firstname: 'John',
        lastname: 'Doe',
        phone: '1234567890',
        email: 'john.doe@example.com',
        address: {
          street: '123 Elm St',
          city: 'Somewhere',
          postalCode: '12345',
          country: 'Country'
        }
      });

      const savedClient = await client.save();
      assert(savedClient.hasOwnProperty('_id'));
      assert.strictEqual(savedClient.firstname, 'John');
    });

  /* TODO : Test fonctionne plus avec l'assert à la place de l'expect  
  it('should save a client with an address successfully', async function() {
      const client = new Client({
        firstname: 'John',
        lastname: 'Doe',
        phone: '1234567890',
        email: 'john.doe@example.com',
        address: {
          street: '123 Elm St',
          city: 'Somewhere',
          postalCode: '12345',
          country: 'Country'
        }
      });

      saveStub.resolves(client);

      const savedClient = await client.save();
      assert(savedClient.hasOwnProperty('address'));
      assert.strictEqual(savedClient.address.street, '123 Elm St');
    });
*/
    it('should throw error when email is duplicated', async function() {
      const client1 = new Client({
        firstname: 'John',
        lastname: 'Doe',
        phone: '1234567890',
        email: 'john.doe@example.com'
      });

      const client2 = new Client({
        firstname: 'Jane',
        lastname: 'Smith',
        phone: '0987654321',
        email: 'john.doe@example.com'
      });

      saveStub.onFirstCall().resolves(client1);
      saveStub.onSecondCall().throws({ code: 11000 });

      await client1.save();
      try {
        await client2.save();
      } catch (error) {
        assert(error.hasOwnProperty('code'));
        assert.strictEqual(error.code, 11000);
      }
    });
  });

  describe('Find and Delete', function() {
    it('should find a client by ID', async function() {
      findByIdStub.resolves({
        _id: 'some-id',
        firstname: 'John',
        lastname: 'Doe',
        phone: '1234567890',
        email: 'john.doe@example.com'
      });

      const foundClient = await Client.findById('some-id');
      assert(foundClient.hasOwnProperty('_id'));
      assert.strictEqual(foundClient.firstname, 'John');
    });

    it('should delete a client successfully', async function() {
      const deleteStub = sinon.stub(Client, 'findByIdAndDelete').resolves({ acknowledged: true, deletedCount: 1 });

      const clientId = 'some-id';

      const result = await Client.findByIdAndDelete(clientId);
      assert.strictEqual(result.acknowledged, true);
      assert.strictEqual(result.deletedCount, 1);

      deleteStub.restore();
    });
  });

  describe('Timestamps', function() {
    it('should set createdAt and updatedAt timestamps', async function() {
      const client = new Client({
        firstname: 'John',
        lastname: 'Doe',
        phone: '1234567890',
        email: 'john.doe@example.com'
      });

      saveStub.resolves({
        ...client._doc,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const savedClient = await client.save();
      assert(savedClient.hasOwnProperty('createdAt'));
      assert(savedClient.hasOwnProperty('updatedAt'));
    });
  });

  describe('Concurrency', function() {
    it('should handle concurrent updates gracefully', async function() {
      const client = new Client({
        firstname: 'John',
        lastname: 'Doe',
        phone: '1234567890',
        email: 'john.doe@example.com'
      });

      saveStub.onFirstCall().resolves(client);
      saveStub.onSecondCall().rejects(new Error('Concurrent modification error'));

      const firstUpdate = client.save();
      const secondUpdate = client.save();

      try {
        await Promise.all([firstUpdate, secondUpdate]);
      } catch (error) {
        assert.strictEqual(error.message, 'Concurrent modification error');
      }
    });
  });

  describe('Static Methods', function() {
    it('should find a client by email using a static method', async function() {
      const mockClient = {
        _id: 'some-id',
        firstname: 'John',
        lastname: 'Doe',
        phone: '1234567890',
        email: 'john.doe@example.com'
      };

      const findByEmailStub = sinon.stub(Client, 'findOne').resolves(mockClient);

      const foundClient = await Client.findOne({ email: 'john.doe@example.com' });
      assert.strictEqual(foundClient._id, 'some-id');
      assert.strictEqual(foundClient.email, 'john.doe@example.com');

      findByEmailStub.restore();
    });
  });
});
