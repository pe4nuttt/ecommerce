'use strict';

const { promisify } = require('util');

const redis = require('redis');
const {
  reservationInventory,
} = require('../models/repositories/inventory.repo');
const redisClient = redis.createClient();

console.log(redisClient);

// async function testRedisConnection() {
//   const clientTest = await redis.createClient().connect();

//   console.log('Redis client::', clientTest.pExpire);

//   clientTest
//     .ping()
//     .then(res => {
//       console.log('PING');
//     })
//     .catch(err => {
//       console.log(err);
//     });
// }
// testRedisConnection();

const pexpire = promisify(redisClient.pExpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setNX).bind(redisClient);

const acquireLock = async (productId, quantity, cartId) => {
  const key = `lock_${productId}`;
  const retryTimes = 10;
  const expireTime = 3000; // 3 seconds time lock

  for (let i = 0; i < retryTimes; i++) {
    const result = await setnxAsync(key, expireTime);
    console.log('result:::', result);
    if (result === 1) {
      // Handle with Inventory
      const isReservation = await reservationInventory({
        productId,
        quantity,
        cartId,
      });

      if (isReservation.modifiedCount) {
        await pexpire(key, expireTime);
        return key;
      }

      return null;
    } else {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }
};

const releaseLock = async keyLock => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient);

  return await delAsyncKey(keyLock);
};

module.exports = {
  acquireLock,
  releaseLock,
};
