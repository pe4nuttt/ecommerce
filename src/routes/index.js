'use strict';

const express = require('express');
const { checkApiKey, checkPermission } = require('../auth/checkAuth');
const router = express.Router();

// Check apiKey
router.use(checkApiKey);

// Check permission
router.use(checkPermission('0000'));

router.use('/api/v1/product', require('./product'));
router.use('/api/v1', require('./auth'));

module.exports = router;
