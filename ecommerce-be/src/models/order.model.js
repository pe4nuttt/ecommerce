'use strict';

const mongoose = require('mongoose');

const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'orders';

const orderSchema = new mongoose.Schema(
  {
    order_userId: {
      type: Number,
      required: true,
    },
    order_checkout: {
      type: Object,
      default: {},

      /*
      order_checkout = {
        totalPrice,
        totalApplyDiscount,
        feeShip
      }
       */
    },
    order_shipping: {
      type: Object,
      default: {},
      /*
      { street, city, state, country }
      */
    },
    order_payment: {
      type: Object,
      default: {},
    },
    order_products: {
      type: Object,
      default: {},
    },
    order_trackingNumber: {
      type: String,
    },
    order_status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'canceled', 'delivered'],
      default: 'pending',
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  },
);

module.exports = {
  order: mongoose.model(DOCUMENT_NAME, orderSchema),
};
