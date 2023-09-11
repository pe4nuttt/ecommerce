'use strict';
const AuthService = require('../services/auth.service');
const catchAsync = require('../utils/catchAsync');
const {
  OkResponse,
  CreatedResponse,
  SuccessReponse,
} = require('../core/success.response');

class AccessController {
  signup = catchAsync(async (req, res, next) => {
    new CreatedResponse({
      message: 'Registed Successfully!',
      data: await AuthService.signup(req.body),
    }).send(res);
  });

  login = catchAsync(async (req, res, next) => {
    new SuccessReponse({ data: await AuthService.login(req.body) }).send(res);
  });

  logout = catchAsync(async (req, res, next) => {
    new SuccessReponse({
      message: 'Logout successfully!',
      data: await AuthService.logout(req.keyStore),
    }).send(res);
  });
}

module.exports = new AccessController();
