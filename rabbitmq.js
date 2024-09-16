import amqp from 'amqplib';

let connection;
let channel;

async function connectRabbitMQ() {
    try {
        // Connexion à RabbitMQ
        connection = await amqp.connect('amqp://localhost');
        channel = await connection.createChannel();

        console.log('Connected to RabbitMQ');
    } catch (error) {
        console.error('Error connecting to RabbitMQ', error);
    }
}

// Fonction pour envoyer un message à RabbitMQ
async function sendMessage(queue, message) {
    if (!channel) {
        await connectRabbitMQ();
    }
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(message));
    console.log(`Message sent to queue ${queue}: ${message}`);
}

async function consumeMessages(queue, callback) {
    if (!channel) {
        await connectRabbitMQ();
    }
    await channel.assertQueue(queue, { durable: true });
    channel.consume(queue, (msg) => {
        if (msg !== null) {
            const content = msg.content.toString();
            console.log(`Message received from queue ${queue}: ${content}`);
            callback(content);
            channel.ack(msg); // Accuser réception du message
        }
    });
}

export { connectRabbitMQ, sendMessage, consumeMessages };
