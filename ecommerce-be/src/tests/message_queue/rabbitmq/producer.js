const amqplib = require('amqplib');
const message = 'Hello RabbitMQ';

const runProducer = async () => {
  try {
    const connection = await amqplib.connect(
      'amqp://guest:12345@localhost:5672',
    );
    const channel = await connection.createChannel();

    const queueName = 'test-topic';
    await channel.assertQueue(queueName, {
      durable: true,
    });

    // Send message
    channel.sendToQueue(queueName, Buffer.from(message));
    console.log('Message sent:', message);
  } catch (err) {
    console.error(err);
  }
};

runProducer().catch(console.err);
