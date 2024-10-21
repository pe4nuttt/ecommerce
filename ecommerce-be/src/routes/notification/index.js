const express = require('express');
const router = express.Router();
const NotificationController = require('../../controllers/notification.controller');
const { authenticate, authenticateV2 } = require('../../auth/authUtils');

// NOT LOGIN

router.use(authenticateV2);

router.get('', NotificationController.listNotiByUser);

module.exports = router;
