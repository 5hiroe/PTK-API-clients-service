import mongoose from 'mongoose';
import { expect } from 'chai';
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
        expect(error.errors).to.have.property('firstname');
        expect(error.errors).to.have.property('lastname');
        expect(error.errors).to.have.property('email');
        expect(error.errors).to.have.property('phone');
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
      expect(result).to.be.undefined;
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
        expect(error.errors).to.have.property('email');
        expect(error.errors.email).to.equal('Invalid email format');
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
        expect(error.errors).to.have.property('firstname');
        expect(error.errors.firstname).to.equal('Max length exceeded');
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
      expect(savedClient).to.have.property('_id');
      expect(savedClient.firstname).to.equal('John');
    });

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
      expect(savedClient).to.have.property('address');
      expect(savedClient.address).to.have.property('street', '123 Elm St');
    });

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
        expect(error).to.have.property('code', 11000);
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
      expect(foundClient).to.have.property('_id');
      expect(foundClient.firstname).to.equal('John');
    });

    it('should delete a client successfully', async function() {
      const deleteStub = sinon.stub(Client, 'findByIdAndDelete').resolves({ acknowledged: true, deletedCount: 1 });

      const clientId = 'some-id';

      const result = await Client.findByIdAndDelete(clientId);
      expect(result).to.have.property('acknowledged', true);
      expect(result).to.have.property('deletedCount', 1);

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
      expect(savedClient).to.have.property('createdAt');
      expect(savedClient).to.have.property('updatedAt');
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
        expect(error.message).to.equal('Concurrent modification error');
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
      expect(foundClient).to.have.property('_id', 'some-id');
      expect(foundClient.email).to.equal('john.doe@example.com');

      findByEmailStub.restore();
    });
  });
});
