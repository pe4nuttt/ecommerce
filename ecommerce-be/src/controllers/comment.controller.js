'use strict';

const CommentService = require('../services/comment.service');
const catchAsync = require('../utils/catchAsync');

const { SuccessReponse } = require('../core/success.response');

class CommentController {
  createComment = catchAsync(async (req, res, next) => {
    new SuccessReponse({
      message: 'Create new comment',
      data: await CommentService.createComment(req.body),
    }).send(res);
  });

  getCommentsByParentId = catchAsync(async (req, res, next) => {
    new SuccessReponse({
      message: 'Get comments successfully!',
      data: await CommentService.getCommentsByParentId(req.query),
    }).send(res);
  });

  deleteComment = catchAsync(async (req, res, next) => {
    new SuccessReponse({
      message: 'Delete comments successfully',
      data: await CommentService.deleteComment(req.body),
    }).send(res);
  });
}

module.exports = new CommentController();
