'use strict';

const Comment = require('../models/comment.model');
const { convertToObjectIdMongodb } = require('../utils');
const { NotFoundError, BadRequestError } = require('../core/error.response');
const { getProductById } = require('../models/repositories/product.repo');

/**
 * Features key:
 * - Add comment [User, Shop]
 * - Get a list of comments [User, Shop]
 * - Delete a commnet [User, Shop, Admin]
 */
class CommentService {
  static async createComment({
    productId,
    userId,
    content,
    parentCommentId = null,
  }) {
    const comment = new Comment({
      comment_productId: productId,
      comment_userId: userId,
      comment_content: content,
      comment_parentId: parentCommentId,
    });

    let rightValue;
    if (parentCommentId) {
      // Reply comment
      const parentComment = await Comment.findById(parentCommentId);

      if (!parentComment) throw new NotFoundError('Parent comment not found!');
      rightValue = parentComment.comment_right;

      // Update comments which have left or right >= rightValue
      await Comment.updateMany(
        {
          comment_productId: convertToObjectIdMongodb(productId),
          comment_right: { $gte: rightValue },
        },
        {
          $inc: { comment_right: 2 },
        },
      );
      await Comment.updateMany(
        {
          comment_productId: convertToObjectIdMongodb(productId),
          comment_left: { $gte: rightValue },
        },
        {
          $inc: { comment_left: 2 },
        },
      );
    } else {
      const maxRightValue = await Comment.findOne(
        {
          comment_productId: convertToObjectIdMongodb(productId),
        },
        'comment_right',
        {
          sort: {
            comment_right: -1,
          },
        },
      );

      if (maxRightValue) {
        rightValue = maxRightValue.right + 1;
      } else {
        rightValue = 1;
      }
    }

    // INSERT to comment
    comment.comment_left = rightValue;
    comment.comment_right = rightValue + 1;

    await comment.save();

    return comment;
  }

  static async getCommentsByParentId({
    productId,
    parentCommentId = null,
    limit = 50,
    skip = 0,
  }) {
    if (!productId) throw new BadRequestError();

    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);

      if (!parentComment) throw new NotFoundError('Comment not found');

      const comments = await Comment.find({
        comment_productId: convertToObjectIdMongodb(productId),
        comment_left: { $gt: parentComment.comment_left },
        comment_right: { $lt: parentComment.comment_right },
      })
        .select({
          comment_left: 1,
          comment_right: 1,
          comment_content: 1,
          comment_parentId: 1,
        })
        .sort({
          comment_left: 1,
        })
        .skip(skip)
        .limit(limit);
      return comments;
    }

    const comments = await Comment.find({
      comment_productId: convertToObjectIdMongodb(productId),
    })
      .select({
        comment_left: 1,
        comment_right: 1,
        comment_content: 1,
        comment_parentId: 1,
      })
      .sort({
        comment_left: 1,
      })
      .skip(skip)
      .limit(limit);

    return comments;
  }

  static async deleteComment({ productId, commentId }) {
    if (!productId || !commentId) {
      throw new BadRequestError();
    }

    const foundProduct = await getProductById(productId);

    if (!foundProduct) throw new NotFoundError('Product not found');

    const foundComment = await Comment.findOne({
      comment_productId: productId,
      _id: convertToObjectIdMongodb(commentId),
    });

    if (!foundComment) throw new NotFoundError('Comment not found');

    const leftVal = foundComment.comment_left;
    const rightVal = foundComment.comment_right;
    const width = rightVal - leftVal + 1;

    await Comment.deleteMany({
      comment_productId: convertToObjectIdMongodb(productId),
      comment_left: { $gte: leftVal },
      comment_right: { $lte: rightVal },
    });

    await Comment.updateMany(
      {
        comment_productId: convertToObjectIdMongodb(productId),
        comment_left: { $gt: rightVal },
      },
      {
        $inc: { comment_left: -width },
      },
    );
    await Comment.updateMany(
      {
        comment_productId: convertToObjectIdMongodb(productId),
        comment_right: { $gt: rightVal },
      },
      {
        $inc: { comment_right: -width },
      },
    );

    return true;
  }
}

module.exports = CommentService;
