'use strict';
const AccessService = require('../services/auth.service');

class AccessController {
  async signUp(req, res, next) {
    try {
      console.log('');
      return res.status(201).json(await AccessService.signUp(req.body));
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AccessController();
