const { Types } = require('mongoose');
const {
  product,
  clothing,
  electronics,
  furniture,
} = require('../product.model');

const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate({
      path: 'product_shop',
      select: 'name email -_id',
    })
    .sort({ updateAt: -1 })
    .limit(limit)
    .skip(skip)
    .exec();
};

const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundProduct = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });

  if (!foundProduct) {
    return null;
  }

  foundProduct.isDraft = false;
  foundProduct.isPublished = true;
  const { modifiedCount } = await foundProduct.updateOne(foundProduct);
  return modifiedCount;
};

module.exports = {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishForShop,
};
