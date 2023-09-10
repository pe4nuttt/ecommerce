'use strict';
const AccessService = require('../services/auth.service');
const catchAsync = require('../utils/catchAsync');
const {
  OkResponse,
  CreatedResponse,
  SuccessReponse,
} = require('../core/success.response');

class AccessController {
  signUp = catchAsync(async (req, res, next) => {
    new CreatedResponse({
      message: 'Registed Successfully!',
      data: await AccessService.signUp(req.body),
    }).send(res);
  });

  login = catchAsync(async (req, res, next) => {
    new SuccessReponse({ data: await AccessService.login(req.body) }).send(res);
  });
}

module.exports = new AccessController();
