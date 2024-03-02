'use strict';

const { BadRequestError } = require('../core/error.response');
const {
  findCartById,
  checkProductByServer,
} = require('../models/repositories/cart.repo');
const { acquireLock, releaseLock } = require('./redis.service');
const DiscountService = require('./discount.service');
const { order } = require('../models/order.model');

class CheckoutService {
  /*
    {
      cartId,
      userId,
      shop_order_ids: [
        {
          shopId,
          shop_discounts: [],
          item_products: [
            {
              price,
              quantity,
              productId
            }
          ]
        },
        {
          shopId,
          shop_discounts: [
            {
              shopId,
              discountId,
              codeId
            }
          ],
          item_products: [
            {
              price,
              quantity,
              productId
            }
          ]
        }
      ]
    }
  */

  static async checkoutReview({ cartId, userId, shop_order_ids }) {
    // Check cart exist or not
    const foundCart = await findCartById(cartId);
    if (!foundCart) throw new BadRequestError('Cart does not exist!');

    const checkout_order = {
        totalPrice: 0,
        feeShip: 0,
        totalDiscount: 0,
        totalCheckout: 0,
      },
      shop_order_ids_new = [];

    // Calculate total bill
    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shopId,
        shop_discounts = [],
        item_products = [],
      } = shop_order_ids[i];

      // Check products available
      const checkProductServer = await checkProductByServer(item_products);
      if (checkProductServer.includes(undefined))
        throw new BadRequestError('Order is not valid');

      // Total order price
      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      checkout_order.totalPrice += checkoutPrice;

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServer,
      };

      if (shop_discounts.length > 0) {
        // Suppose that it's only 1 discount
        const { totalPrice = 0, discount = 0 } =
          await DiscountService.getDiscountAmount({
            codeId: shop_discounts[0].codeId,
            userId,
            shopId,
            products: checkProductServer,
          });

        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount;
        }
      }

      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
      shop_order_ids_new.push(itemCheckout);
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order,
    };
  }

  // ORDER
  static async orderByUser({
    shop_order_ids,
    cartId,
    userId,
    user_address = {},
    user_payment = {},
  }) {
    const { shop_order_ids_new, checkout_order } =
      await CheckoutService.checkoutReview({
        cartId,
        userId,
        shop_order_ids,
      });

    // Check if > quantity in inventory
    // Get new array Products
    const products = shop_order_ids_new.flatMap(order => order.item_products);
    console.log(`[1]:`, products);

    const acquireProducts = [];

    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i];
      const keyLock = await acquireLock(productId, quantity, cartId);
      acquireProducts.push(keyLock ? true : false);
      if (keyLock) {
        await releaseLock(keyLock);
      }
    }

    // If 1 product out of amount
    if (acquireProducts.includes(false)) {
      throw new BadRequestError(
        'Một số sản phẩm đã được cập nhật, vui lòng quay lại giỏ hàng',
      );
    }

    const newOrder = await order.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_products: shop_order_ids_new,
    });

    // If insert order successfully
    if (newOrder) {
      // Remove product in cart
    }

    return newOrder;
  }

  /*
    Query Orders[Users]
  */
  static async getOrdersByUser() {}

  /*
    Get Order Detail by id[Users]
  */
  static async getOrderByOrderId() {}

  /*
    Cancel order[Users]
  */
  static async cancelOrderByUser() {}

  /*
    Update Order Status [SHOP | ADMIN]
  */
  static async updateOrderStatusByShop() {}
}

module.exports = CheckoutService;
