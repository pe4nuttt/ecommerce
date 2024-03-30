'use strict';

const {
  consumerToQueue,
  consumerQueueFailed,
  consumerQueueNormal,
} = require('./src/services/consumerQueue.service');
const queueName = 'test-topic';
// consumerToQueue(queueName)
//   .then(() => {
//     console.log('Message consumer started::', queueName);
//   })
//   .catch(err => {
//     console.log('Message Error::', err.message);
//   });

consumerQueueNormal(queueName)
  .then(() => {
    console.log('Message consumerQueueNormal started::');
  })
  .catch(err => {
    console.log('Message Error::', err.message);
  });

consumerQueueFailed(queueName)
  .then(() => {
    console.log('Message consumerQueueFailed started::');
  })
  .catch(err => {
    console.log('Message Error::', err.message);
  });
