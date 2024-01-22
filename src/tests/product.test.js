const RedisPubSubService = require('../services/redisPubsub.service');

class ProductServiceTest {
  purchaseProduct(productId, quantity) {
    const order = {
      productId,
      quantity,
    };

    // RedisPubSubService.publisher.connect().then(() => {
    RedisPubSubService.publish('purchase_events', JSON.stringify(order));
    console.log('Purchase event');
    // });
  }
}

module.exports = new ProductServiceTest();
