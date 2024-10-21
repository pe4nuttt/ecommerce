const express = require('express');
const router = express.Router();
const UploadController = require('../../controllers/upload.controller');
const { authenticate, authenticateV2 } = require('../../auth/authUtils');
const { uploadDisk } = require('../../configs/multer.config');

router.post('/product', UploadController.uploadFile);
router.post(
  '/product/thumb',
  uploadDisk.single('file'),
  UploadController.uploadFileThumb,
);
router.use(authenticateV2);

// authentication
// router.use(authenticateV2);

module.exports = router;
