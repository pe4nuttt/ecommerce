'use strict';
const ProductService = require('../services/product.service');
const ProductServiceV2 = require('../services/product.service.v2');
const catchAsync = require('../utils/catchAsync');
const {
  OkResponse,
  CreatedResponse,
  SuccessReponse,
} = require('../core/success.response');

class ProductController {
  createProduct = catchAsync(async (req, res, next) => {
    console.log('user:', req.user);
    // new SuccessReponse({
    //   message: 'Create new product successfully!',
    //   data: await ProductService.createProduct(req.body.product_type, {
    //     ...req.body,
    //     product_shop: req.user.userId,
    //   }),
    // }).send(res);

    new SuccessReponse({
      message: 'Create new product successfully!',
      data: await ProductServiceV2.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  });
}

module.exports = new ProductController();
