'use strict';
import discount from '../discount.model';

const findAllDiscountCode = async ({
  limit = 50,
  page = 1,
  sort = 'ctime',
  filter,
  select,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: 1 } : { _id: -1 };
  const discounts = await discount
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(select)
    .lean();

  return discounts;
};

module.exports = {
  findAllDiscountCode,
};
