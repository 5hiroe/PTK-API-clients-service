import request from 'supertest';
import express from 'express';
import router from '../../src/routes/client.js';
import sinon from 'sinon';
import assert from 'assert';
import ClientService from '../../src/services/clients.js';

const app = express();
app.use(express.json());
app.use('/clients', router);

describe('Client Routes', function() {
  this.timeout(5000); // Augmente le délai d'exécution à 5000 ms (5 secondes)

  let clientServiceStub;

  beforeEach(() => {
    clientServiceStub = sinon.createStubInstance(ClientService);

    sinon.replace(ClientService.prototype, 'getAll', clientServiceStub.getAll);
    sinon.replace(ClientService.prototype, 'get', clientServiceStub.get);
    sinon.replace(ClientService.prototype, 'create', clientServiceStub.create);
    sinon.replace(ClientService.prototype, 'update', clientServiceStub.update);
    sinon.replace(ClientService.prototype, 'remove', clientServiceStub.remove);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should get all clients', async function() {
    clientServiceStub.getAll.resolves([{
      firstname: 'John',
      lastname: 'Doe',
      phone: '1234567890',
      email: 'john.doe@example.com',
      address: {
        street: '456 Oak Street',
        city: 'Anywhere',
        postalCode: '67890',
        country: 'CountryName'
      },
      orders: []
    }]);

    const response = await request(app).get('/clients');
    assert.strictEqual(response.status, 200);
    assert(Array.isArray(response.body.clients));
    assert.strictEqual(response.body.clients.length, 1);
    assert.strictEqual(response.body.clients[0].firstname, 'John');
    assert.strictEqual(response.body.clients[0].lastname, 'Doe');
    assert.strictEqual(response.body.clients[0].phone, '1234567890');
    assert.strictEqual(response.body.clients[0].email, 'john.doe@example.com');
    assert.strictEqual(response.body.clients[0].address.street, '456 Oak Street');
    assert.strictEqual(response.body.clients[0].address.city, 'Anywhere');
    assert.strictEqual(response.body.clients[0].address.postalCode, '67890');
    assert.strictEqual(response.body.clients[0].address.country, 'CountryName');
  });

  it('should get a client by ID', async function() {
    const clientId = '1';
    const clientData = {
      id: clientId,
      firstname: 'John',
      lastname: 'Doe',
      phone: '1234567890',
      email: 'john.doe@example.com',
      address: {
        street: '456 Oak Street',
        city: 'Anywhere',
        postalCode: '67890',
        country: 'CountryName'
      },
      orders: []
    };
    clientServiceStub.get.resolves(clientData);

    const response = await request(app).get(`/clients/${clientId}`);
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.client.firstname, 'John');
    assert.strictEqual(response.body.client.lastname, 'Doe');
    assert.strictEqual(response.body.client.phone, '1234567890');
    assert.strictEqual(response.body.client.email, 'john.doe@example.com');
    assert.strictEqual(response.body.client.address.street, '456 Oak Street');
    assert.strictEqual(response.body.client.address.city, 'Anywhere');
    assert.strictEqual(response.body.client.address.postalCode, '67890');
    assert.strictEqual(response.body.client.address.country, 'CountryName');
  });

  it('should create a client', async function() {
    const newClient = {
      fields: {
        firstname: 'Jane',
        lastname: 'Doe',
        phone: '1234567890',
        email: 'jane.doe@example.com',
        address: {
          street: '123 Elm Street',
          city: 'Somewhere',
          postalCode: '12345',
          country: 'CountryName'
        },
        orders: []
      }
    };
  
    clientServiceStub.create.resolves({ id: '2', ...newClient.fields });
  
    const response = await request(app).post('/clients').send(newClient);
  
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.client.firstname, 'Jane');
    assert.strictEqual(response.body.client.lastname, 'Doe');
    assert.strictEqual(response.body.client.phone, '1234567890');
    assert.strictEqual(response.body.client.email, 'jane.doe@example.com');
    assert.strictEqual(response.body.client.address.street, '123 Elm Street');
    assert.strictEqual(response.body.client.address.city, 'Somewhere');
    assert.strictEqual(response.body.client.address.postalCode, '12345');
    assert.strictEqual(response.body.client.address.country, 'CountryName');
  });

  it('should delete a client', async function() {
    const clientId = '1';

    clientServiceStub.remove.resolves({ message: 'Client supprimé.' });

    const response = await request(app).delete(`/clients/${clientId}`);

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.message, 'Client supprimé.');
  });

  it('should update a client', async function() {
    const clientId = '1';
    const updatedFields = {
      firstname: 'Jane',
      lastname: 'Doe',
      phone: '0987654321',
      email: 'jane.doe@newemail.com',
      address: {
        street: '789 Pine Street',
        city: 'New City',
        postalCode: '54321',
        country: 'NewCountry'
      },
      orders: []
    };

    clientServiceStub.update.resolves({ id: clientId, ...updatedFields });

    const response = await request(app).put(`/clients/${clientId}`).send({ fields: updatedFields });

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.client.firstname, 'Jane');
    assert.strictEqual(response.body.client.lastname, 'Doe');
    assert.strictEqual(response.body.client.phone, '0987654321');
    assert.strictEqual(response.body.client.email, 'jane.doe@newemail.com');
    assert.strictEqual(response.body.client.address.street, '789 Pine Street');
    assert.strictEqual(response.body.client.address.city, 'New City');
    assert.strictEqual(response.body.client.address.postalCode, '54321');
    assert.strictEqual(response.body.client.address.country, 'NewCountry');
  });
});
