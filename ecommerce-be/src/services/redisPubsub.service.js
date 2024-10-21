const Redis = require('redis');

class RedisPubSubService {
  constructor() {
    this.subscriber = Redis.createClient();
    this.publisher = Redis.createClient();
    this.subscriber.connect();
    this.publisher.connect();
    // this.setRedisConstructor();
  }

  publish(channel, message) {
    return new Promise((resolve, reject) => {
      this.publisher.publish(channel, message, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  subscribe(channel, callback) {
    this.subscriber.subscribe(channel);
    this.subscriber.on('messsage', (subscribeChannel, message) => {
      console.log('On message ', subscribeChannel);
      if (channel === subscribeChannel) {
        callback(channel, message);
      }
    });
  }
}

module.exports = new RedisPubSubService();
