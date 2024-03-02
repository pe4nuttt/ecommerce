'use strict';
const { notiTypeCode } = require('../utils/constants/notification');
const { NOTI } = require('../models/notification.model');

const pushNotiToSystem = async ({
  type = notiTypeCode.NEW_PRODUCT_BY_SHOP,
  receiverId,
  senderId,
  options = {},
}) => {
  let noti_content;

  if (type === notiTypeCode.NEW_PRODUCT_BY_SHOP) {
    noti_content = 'SHOP vừa thêm một sản phẩm: PRODUCT';
  } else if (type === notiTypeCode.NEW_PROMOTION) {
    noti_content = 'SHOP vừa thêm một voucher: PROMOTION';
  }

  const newNoti = NOTI.create({
    noti_type: type,
    noti_content: noti_content,
    noti_receiverId: receiverId,
    noti_senderId: senderId,
    noti_options: options,
  });

  return newNoti;
};

const listNotiByUser = async ({ userId = 1, type = 'ALL', isRead = 0 }) => {
  const match = {
    noti_receiverId: userId,
  };

  if (type !== 'ALL') {
    match['noti_type'] = type;
  }

  return await NOTI.aggregate([
    // {
    //   $match: match,
    // },
    {
      $project: {
        noti_type: 1,
        noti_senderId: 1,
        noti_receiverId: 1,
        noti_content: 1,
        noti_options: 1,
        createdAt: 1,
      },
    },
  ]);
};

module.exports = {
  pushNotiToSystem,
  listNotiByUser,
};
