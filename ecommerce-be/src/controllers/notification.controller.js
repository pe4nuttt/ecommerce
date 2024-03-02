'use strict';

const { listNotiByUser } = require('../services/notification.service');
const catchAsync = require('../utils/catchAsync');

const { SuccessReponse } = require('../core/success.response');

class NotificationController {
  listNotiByUser = catchAsync(async (req, res, next) => {
    new SuccessReponse({
      message: 'List notification',
      data: await listNotiByUser(req.query),
    }).send(res);
  });
}

module.exports = new NotificationController();
