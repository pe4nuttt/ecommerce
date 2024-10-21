const amqplib = require('amqplib');
const message = 'Hello RabbitMQ';

const runConsumer = async () => {
  try {
    const connection = await amqplib.connect(
      'amqp://guest:12345@localhost:5672',
    );
    const channel = await connection.createChannel();

    const queueName = 'test-topic';
    await channel.assertQueue(queueName, {
      durable: true,
    });

    // Listener
    channel.consume(queueName, messages => {
      if (messages !== null) {
        console.log(`Received:: ${messages.content.toString()} messages`);
        channel.ack(messages);
      } else {
        console.log('Consumer cancelled by server');
      }
    });
  } catch (err) {
    console.error(err);
  }
};

runConsumer().catch(console.err);
