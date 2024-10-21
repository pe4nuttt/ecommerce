const RedisPubSubService = require('../services/redisPubsub.service');

class InventoryServiceTest {
  constructor() {
    console.log(1);
    // RedisPubSubService.subscriber.connect(() => {
    RedisPubSubService.subscribe('purchase_events', (channel, message) => {
      console.log('Receive message', message);
      InventoryServiceTest.updateInventory(message);
    });
    // });
  }

  static updateInventory(productId, quantity) {
    console.log(3);

    console.log(`Update inventory ${productId} with quantity ${quantity}`);
  }
}

module.exports = new InventoryServiceTest();
