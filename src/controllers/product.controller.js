'use strict';
const ProductService = require('../services/product.service');
const catchAsync = require('../utils/catchAsync');
const {
  OkResponse,
  CreatedResponse,
  SuccessReponse,
} = require('../core/success.response');

class ProductController {
  createProduct = catchAsync(async (req, res, next) => {
    new SuccessReponse({
      message: 'Create new product successfully!',
      data: await ProductService.createProduct(req.body.product_type, req.body),
    }).send(res);
  });
}

module.exports = new ProductController();
