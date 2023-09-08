'use strict';
const AccessService = require('../services/auth.service');
const catchAsync = require('../utils/catchAsync');
const { OkResponse, CreatedResponse } = require('../core/success.response');

class AccessController {
  signUp = catchAsync(async (req, res, next) => {
    try {
      console.log('');
      new CreatedResponse({
        message: 'Registed Successfully!',
        data: await AccessService.signUp(req.body),
      }).send(res);
    } catch (err) {
      next(err);
    }
  });
}

module.exports = new AccessController();
