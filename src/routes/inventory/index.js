const express = require('express');
const router = express.Router();
const InventoryController = require('../../controllers/inventory.controller');
const { authenticate, authenticateV2 } = require('../../auth/authUtils');

router.use(authenticateV2);

router.post('/', InventoryController.addStockToInventory);

// authentication
// router.use(authenticateV2);

module.exports = router;
