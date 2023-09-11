'use strict';

const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth.controller');
const { authenticate } = require('../../auth/authUtils');

// SignUp
router.post('/shop/signup', authController.signup);
router.post('/shop/login', authController.login);

// Refresh token
router.post('/shop/handle-refresh-token', authController.handleRefreshToken);

// authentication
router.use(authenticate);

// logout
router.post('/shop/logout', authController.logout);

module.exports = router;
