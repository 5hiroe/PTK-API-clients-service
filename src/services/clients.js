import ClientModel from '../models/client.js';
import { NotFound } from '../globals/errors.js';
import amqp from 'amqplib';

export default class ClientService {
    constructor () {
        if (ClientService.instance instanceof ClientService) {
            return ClientService.instance;
        }
        this.rabbitmqChannel = null; // Stocker le canal RabbitMQ ici
        this.initRabbitMQ(); // Initialiser RabbitMQ

        // Object.freeze(this);
        ClientService.instance = this;
    }

    // Fonction pour se connecter à RabbitMQ et créer un canal
    async initRabbitMQ() {
        try {
            const connection = await amqp.connect('amqp://localhost'); // Connexion à RabbitMQ
            this.rabbitmqChannel = await connection.createChannel(); // Création d'un canal
            console.log('Connected to RabbitMQ');
        } catch (error) {
            console.error('Error connecting to RabbitMQ:', error);
        }
    }

    // Fonction pour envoyer un message à une file RabbitMQ
    async sendToQueue(queue, message) {
        if (!this.rabbitmqChannel) {
            console.error('RabbitMQ channel is not available');
            return;
        }
        await this.rabbitmqChannel.assertQueue(queue, { durable: true });
        this.rabbitmqChannel.sendToQueue(queue, Buffer.from(message));
        console.log(`Message sent to ${queue}: ${message}`);
    }

    /**
     * Get all clients from db.
     */
    async getAll () {
        const clients = await ClientModel.find();
        // Envoyer un message à RabbitMQ après récupération de tous les clients
        const message = JSON.stringify({ action: 'getAll', clients });
        await this.sendToQueue('clientQueue', message);
        return clients;
    }

    /**
     * Get a client by his id
     * 
     * @param {ObjectId} clientId
     */
    async get ({ clientId }) {
        const client = await ClientModel.findById(clientId);
        if (!client) {
            throw new NotFound('Client introuvable.');
        }
        // Envoyer un message à RabbitMQ après récupération du client
        const message = JSON.stringify({ action: 'get', clientId, client });
        await this.sendToQueue('clientQueue', message);
        return client;
    }

    /**
     * Create a customer
     * 
     * @param {Object} fields
     */
    async create ({ fields }) {
        const client = new ClientModel(fields);
        await client.save();
        
        // Envoyer un message à RabbitMQ après la création du client
        const message = JSON.stringify({ action: 'create', clientId: client._id, fields });
        await this.sendToQueue('clientQueue', message);

        return client;
    }

    /**
     * Update a client
     * 
     * @param {ObjectId} clientId
     * @param {Object} fields
     */
    async update ({ clientId, fields }) {
        const client = await ClientModel.findByIdAndUpdate(clientId, fields, { new: true });
        if (!client) {
            throw new NotFound('Client introuvable.');
        }

        // Envoyer un message à RabbitMQ après la mise à jour du client
        const message = JSON.stringify({ action: 'update', clientId, fields });
        await this.sendToQueue('clientQueue', message);

        return client;
    }

    /**
     * Delete a client
     * 
     * @param {ObjectId} clientId
     */
    async remove ({ clientId }) {
        const client = await ClientModel.findByIdAndDelete(clientId);
        if (!client) {
            throw new NotFound('Client introuvable.');
        }

        // Envoyer un message à RabbitMQ après la suppression du client
        const message = JSON.stringify({ action: 'delete', clientId });
        await this.sendToQueue('clientQueue', message);
    }
}
