'use strict';

const express = require('express');
const router = express.Router();
const accessController = require('../../controllers/auth.controller');

// SignUp
router.post('/shop/signup', accessController.signUp);

module.exports = router;