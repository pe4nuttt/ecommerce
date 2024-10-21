'use strict';

const amqplib = require('amqplib');

const connectToRabbitMQ = async () => {
  try {
    const connection = await amqplib.connect(
      'amqp://guest:12345@localhost:5672',
    );

    if (!connection) throw new Error('Connection not established');

    const channel = await connection.createChannel();

    return {
      channel,
      connection,
    };
  } catch (err) {}
};

const connectToRabbitMQForTest = async () => {
  try {
    const { channel, connection } = connectToRabbitMQ();

    // Publish message to queue
    const queue = 'test-queue';
    const message = 'Hello RabbitMQ';
    await channel.assertQueue(queue);
    channel.sendToQueue(queue, Buffer.from(message));

    // Close the connection
    await connection.close();
  } catch (err) {
    console.error('Error connection to RabbitMQ:: ', err);
    throw err;
  }
};

const consumerQueue = async (channel, queueName) => {
  try {
    channel.assertQueue(queueName, {
      durable: true,
    });

    channel.consume(
      queueName,
      message => {
        console.log('Received Message::', message.content.toString());

        // 1. Find users followed shop
        // 2. Send msg to user
        // 3. If send successfully => success
        // 4. Error => setup DLX
      },
      {
        noAck: true,
      },
    );
  } catch (err) {
    console.error('Error connection to RabbitMQ:: ', err);
    throw err;
  }
};

module.exports = {
  connectToRabbitMQ,
  connectToRabbitMQForTest,
  consumerQueue,
};
