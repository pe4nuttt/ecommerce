const express = require('express');
const router = express.Router();
const commentController = require('../../controllers/comment.controller');
const { authenticate, authenticateV2 } = require('../../auth/authUtils');

router.use(authenticateV2);

router.post('', commentController.createComment);
router.get('', commentController.getCommentsByParentId);
router.delete('', commentController.deleteComment);

module.exports = router;
