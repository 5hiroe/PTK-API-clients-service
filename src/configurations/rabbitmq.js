// rabbitmq.js
import amqp from 'amqplib';

let rabbitmqChannel = null;
let rabbitmqConnection = null;

export async function initRabbitMQ() {
    if (!rabbitmqChannel) {
        try {
            rabbitmqConnection = await amqp.connect(process.env.RABBITMQ_URL);
            rabbitmqChannel = await rabbitmqConnection.createChannel();
            console.log('Connected to RabbitMQ');
        } catch (error) {
            console.error('Error connecting to RabbitMQ:', error);
            throw error;
        }
    }
    return rabbitmqChannel;
}

export async function closeRabbitMQ() {
    try {
        if (rabbitmqChannel) {
            await rabbitmqChannel.close();
        }
        if (rabbitmqConnection) {
            await rabbitmqConnection.close();
        }
        console.log('RabbitMQ connection closed');
    } catch (error) {
        console.error('Error closing RabbitMQ connection:', error);
    }
}

export async function sendToQueue(queue, message) {
    const channel = await initRabbitMQ(); // S'assurer que la connexion est établie
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(message));
    console.log(`Message sent to ${queue}: ${message}`);
}
