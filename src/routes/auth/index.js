'use strict';

const express = require('express');
const router = express.Router();
const accessController = require('../../controllers/auth.controller');
const { authenticate } = require('../../auth/authUtils');

// SignUp
router.post('/shop/signup', accessController.signup);
router.post('/shop/login', accessController.login);

// authentication
router.use(authenticate);

// logout
router.post('/shop/logout', accessController.logout);

module.exports = router;
