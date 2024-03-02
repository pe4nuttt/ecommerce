'use strict';
const { connectToRabbitMQForTest } = require('../dbs/init.rabbit');

describe('RabbitMQ Connection', () => {
  test('Should connect to RabbitMQ successfully!', async () => {
    const result = await connectToRabbitMQForTest();
    expect(result).toBeUndefined();
  });
});
