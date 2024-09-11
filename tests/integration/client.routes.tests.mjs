import request from 'supertest';
import express from 'express';
import router from '../../src/routes/client.js';
import sinon from 'sinon';
import { expect } from 'chai';
import ClientService from '../../src/services/clients.js';

// Création de l'application Express
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
    clientServiceStub.getAll.resolves([{ id: '1', firstname: 'John', lastname: 'Doe', phone: '1234567890', email: 'john.doe@example.com', address: { street: '456 Oak Street', city: 'Anywhere', postalCode: '67890', country: 'CountryName' }, orders: [] }]);

    const response = await request(app).get('/clients');
    expect(response.status).to.equal(200);
    expect(response.body.clients).to.be.an('array');
    expect(response.body.clients).to.have.lengthOf(1);
    expect(response.body.clients[0]).to.have.property('firstname', 'John');
    expect(response.body.clients[0]).to.have.property('lastname', 'Doe');
    expect(response.body.clients[0]).to.have.property('phone', '1234567890');
    expect(response.body.clients[0]).to.have.property('email', 'john.doe@example.com');
    expect(response.body.clients[0].address).to.have.property('street', '456 Oak Street');
    expect(response.body.clients[0].address).to.have.property('city', 'Anywhere');
    expect(response.body.clients[0].address).to.have.property('postalCode', '67890');
    expect(response.body.clients[0].address).to.have.property('country', 'CountryName');
  });

  it('should get a client by ID', async function() {
    const clientId = '1';
    const clientData = { id: clientId, firstname: 'John', lastname: 'Doe', phone: '1234567890', email: 'john.doe@example.com', address: { street: '456 Oak Street', city: 'Anywhere', postalCode: '67890', country: 'CountryName' }, orders: [] };
    clientServiceStub.get.resolves(clientData);

    const response = await request(app).get(`/clients/${clientId}`);
    console.log('Response:', response.body); // Ajoute des logs pour déboguer
    expect(response.status).to.equal(200);
    expect(response.body.client).to.have.property('firstname', 'John');
    expect(response.body.client).to.have.property('lastname', 'Doe');
    expect(response.body.client).to.have.property('phone', '1234567890');
    expect(response.body.client).to.have.property('email', 'john.doe@example.com');
    expect(response.body.client.address).to.have.property('street', '456 Oak Street');
    expect(response.body.client.address).to.have.property('city', 'Anywhere');
    expect(response.body.client.address).to.have.property('postalCode', '67890');
    expect(response.body.client.address).to.have.property('country', 'CountryName');
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
  
    // Configure le stub pour renvoyer une réponse simulée
    clientServiceStub.create.resolves({ id: '2', ...newClient.fields });
  
    // Effectue la requête POST
    const response = await request(app).post('/clients')
      .send(newClient);
  
    // Ajoute des logs pour déboguer
    console.log('Status:', response.status);
    console.log('Response Body:', response.body);
  
    // Assertions
    expect(response.status).to.equal(200);
    expect(response.body.client).to.have.property('firstname', 'Jane');
    expect(response.body.client).to.have.property('lastname', 'Doe');
    expect(response.body.client).to.have.property('phone', '1234567890');
    expect(response.body.client).to.have.property('email', 'jane.doe@example.com');
    expect(response.body.client.address).to.have.property('street', '123 Elm Street');
    expect(response.body.client.address).to.have.property('city', 'Somewhere');
    expect(response.body.client.address).to.have.property('postalCode', '12345');
    expect(response.body.client.address).to.have.property('country', 'CountryName');
  });
  
  it('should delete a client', async function() {
    const clientId = '1';

    // Simule la résolution de la méthode remove
    clientServiceStub.remove.resolves({ message: 'Client supprimé.' });

    // Effectue une requête DELETE pour supprimer le client
    const response = await request(app).delete(`/clients/${clientId}`);

    // Ajoute des logs pour déboguer
    console.log('Status:', response.status);
    console.log('Response Body:', response.body);

    // Vérifie que le statut est 200
    expect(response.status).to.equal(200);
    // Vérifie que la réponse contient bien le message
    expect(response.body).to.have.property('message', 'Client supprimé.');
});


});
