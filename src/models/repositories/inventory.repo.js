'use strict';

const inventory = require('../../models/inventory.model');

const { convertToObjectIdMongodb } = require('../../utils/index');

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = 'unknown',
}) => {
  return await inventory.create({
    invent_productId: productId,
    invent_shopId: shopId,
    invent_stock: stock,
    invent_location: location,
  });
};

const reservationInventory = async ({ productId, quantity, cartId }) => {
  const query = {
      invent_productId: convertToObjectIdMongodb(productId),
      invent_stock: {
        $gte: quantity,
      },
    },
    updateSet = {
      $inc: {
        invent_stock: -quantity,
      },
      $push: {
        invent_reservations: {
          quantity,
          cartId,
          createdOn: new Date(),
        },
      },
    },
    options = { upsert: true, new: true };

  return await inventory.updateOne(query, updateSet, options);
};

module.exports = {
  insertInventory,
  reservationInventory,
};
