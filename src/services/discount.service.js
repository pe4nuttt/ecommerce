'use strict';
const { BadRequestError, NotFoundError } = require('../core/error.response');
const { convertToObjectIdMongodb } = require('../utils');
const discount = require('../models/discount.model');
const {
  findAllDraftsForShop,
  findAllProducts,
} = require('../models/repositories/product.repo');

const { findAllDiscountCode } = require('../models/repositories/discount.repo');

/**
 * Discount service
 * 1. Generate Discount code [Shop | Admin]
 * 2. Get discount amount [User]
 * 3. Get all discount code [Use | Shop]
 * 4. Verify discount code [User]
 * 5. Delete discount code [Shop | Admin]
 * 6. Cancel discount code [User]
 */

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      min_value,
      max_uses,
      max_uses_per_user,
    } = payload;

    if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
      throw new BadRequestError('Discount code has expired!');
    }

    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError('Start date must be before end date!');
    }

    // Create index for discount code
    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectIdMongodb(shopId),
      })
      .lean();

    if (foundDiscount) {
      throw new BadRequest('Discount code existed!');
    }

    const newDiscount = await discount.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_code: code,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_max_uses_per_user: max_uses_per_user,
      discount_min_order_value: min_order_value,
      discount_max_value: max_value,
      discount_shopId: shopId,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === 'all' ? [] : product_ids,
    });

    return newDiscount;
  }

  static async updateDiscountCode() {}

  // Get list product by discount_code
  static async getAllDiscountCodesWithProduct({
    code,
    shopId,
    userId,
    limit,
    page,
  }) {
    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectIdMongodb(shopId),
      })
      .lean();

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError('Discount not existed!');
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount;
    let products;

    if (discount_applies_to === 'all') {
      products = await findAllProducts({
        filter: {
          product_shop: convertToObjectIdMongodb(shopId),
        },
        limit,
        page,
        sort: 'ctime',
        select: ['product_name'],
      });
    } else {
      products = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit,
        page,
        sort: 'ctime',
        select: ['product_name'],
      });
    }

    return products;
  }

  // Get all discount code of shop
  static async getAllDiscountCodesByShop({ limit, page, shopId }) {
    const discounts = await findAllDiscountCode({
      limit,
      page,
      filter: {
        discount_shopId: shopId,
        discount_is_active: true,
      },
      select: ['-__v', '-discount_shopId'],
    });

    return discounts;
  }
}
