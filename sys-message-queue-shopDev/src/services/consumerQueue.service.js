'use strict';

const { consumerQueue, connectToRabbitMQ } = require('../dbs/init.rabbit');

const messageService = {
  consumerToQueue: async queueName => {
    try {
      const { channel, connection } = await connectToRabbitMQ();
      await consumerQueue(channel, queueName);
    } catch (err) {
      console.log(`Error consumer to queue::`, err);
    }
  },

  // Case processing
  consumerQueueNormal: async queueName => {
    try {
      const { channel, connection } = await connectToRabbitMQ();

      const notiQueue = 'notificationQueueProcess'; // assertQueue

      const tmpTimeExprired = 15000;

      // 1. TTL Error
      // setTimeout(() => {
      //   channel.consume(notiQueue, msg => {
      //     console.log(
      //       'GET notificationQueueProcess msg successfully:',
      //       msg.content.toString(),
      //     );
      //     channel.ack(msg);
      //   });
      // }, tmpTimeExprired);

      // 2. LOGIC
      channel.consume(notiQueue, msg => {
        try {
          const numberTest = Math.random();
          console.log({ numberTest });

          if (numberTest < 0.8) {
            throw new Error('Send notification failed:: HOT FIX');
          }

          console.log(
            'GET notificationQueueProcess msg successfully:',
            msg.content.toString(),
          );
          channel.ack(msg);
        } catch (err) {
          console.error('SEND notification error:', err);
          channel.nack(msg, false, false);
        }
      });
    } catch (err) {
      console.error(err);
    }
  },

  // Case failed
  consumerQueueFailed: async queueName => {
    try {
      const { channel, connection } = await connectToRabbitMQ();
      const notificationExchangeDLX = 'notificationExDLX';
      const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX';

      const notiQueueHandler = 'notificationQueueHotFix';

      await channel.assertExchange(notificationExchangeDLX, 'direct', {
        durable: true,
      });

      const queueResult = await channel.assertQueue(notiQueueHandler, {
        exclusive: false,
      });

      await channel.bindQueue(
        queueResult.queue,
        notificationExchangeDLX,
        notificationRoutingKeyDLX,
      );

      channel.consume(
        queueResult.queue,
        msgFailed => {
          console.log(
            'This notification error, pls hot fix::',
            msgFailed.content.toString(),
          );
        },
        {
          noAck: true,
        },
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
};

module.exports = messageService;
