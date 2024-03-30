const amqplib = require('amqplib');
const message = 'Hello RabbitMQ';

const runProducer = async () => {
  try {
    const connection = await amqplib.connect(
      'amqp://guest:12345@localhost:5672',
    );
    const channel = await connection.createChannel();

    const notificationExchange = 'notificationEx'; // direct exchange
    const notiQueue = 'notificationQueueProcess'; // assertQueue
    const notificationExchangeDLX = 'notificationExDLX';
    const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX';

    // 1. Create Exchange
    await channel.assertExchange(notificationExchange, 'direct', {
      durable: true,
    });

    // 2. Create Queue
    const queueResult = await channel.assertQueue(notiQueue, {
      exclusive: false, // Allow others consume from this queue
      deadLetterExchange: notificationExchangeDLX,
      deadLetterRoutingKey: notificationRoutingKeyDLX,
    });

    // 3. Bind queue to exchange
    await channel.bindQueue(queueResult.queue, notificationExchange);

    // 4. Send message
    const msg = 'A new product has published';
    console.log('Message sent:', msg);

    await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
      expiration: '10000',
    });
  } catch (err) {
    console.error(err);
  }
};

runProducer().catch(console.err);
