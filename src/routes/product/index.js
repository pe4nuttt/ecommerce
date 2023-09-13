'use strict';

const express = require('express');
const router = express.Router();
const productController = require('../../controllers/product.controller');
const { authenticate, authenticateV2 } = require('../../auth/authUtils');

// authentication
router.use(authenticateV2);

// logout
router.post('', productController.createProduct);

module.exports = router;
