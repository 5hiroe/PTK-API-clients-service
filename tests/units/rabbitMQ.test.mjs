import { expect } from 'chai';
import sinon from 'sinon';
import amqp from 'amqplib';
import { initRabbitMQ, sendToQueue, closeRabbitMQ } from '../../src/configurations/rabbitmq.js';

describe('RabbitMQ', () => {
    let connectionMock;
    let channelMock;

    beforeEach(() => {
        channelMock = {
            assertQueue: sinon.stub().resolves(),
            sendToQueue: sinon.stub().resolves(), // Ensure sendToQueue is a promise
            close: sinon.stub().resolves()
        };
        
        connectionMock = {
            createChannel: sinon.stub().resolves(channelMock),
            close: sinon.stub().resolves()
        };
        
        sinon.stub(amqp, 'connect').resolves(connectionMock);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should connect to RabbitMQ successfully', async () => {
        const channel = await initRabbitMQ();
    });

    it('should handle RabbitMQ connection error', async () => {
        amqp.connect.rejects(new Error('Connection failed'));

        try {
            await initRabbitMQ();
        } catch (error) {
            expect(error.message).to.equal('Connection failed');
        }
    });

    it('should send a message to the queue', async () => {
        await sendToQueue('testQueue', 'testMessage');
    });

    it('should close RabbitMQ connection and channel', async () => {
        await closeRabbitMQ();
    });

    it('should handle errors while closing RabbitMQ connection', async () => {
        channelMock.close.rejects(new Error('Error closing channel'));
        try {
            await closeRabbitMQ();
        } catch (error) {
            expect(error.message).to.equal('Error closing channel');
        }
    });
});
