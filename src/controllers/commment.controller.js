const catchAsync = require('../utils/catchAsync');
const Comment = require('../models/comment.model');
const AppError = require('../utils/appError');
const User = require('../models/user.model');
const Post = require('../models/post.model');

exports.findAllComments = catchAsync(async (req, res, next) => {
  //? get all active comments
  const comments = await Comment.findAll({
    where: {
      status: true,
    },
    include: [{ model: User }, { model: Post }],
  });

  //? send error if there are no comments
  if (comments.length < 1) {
    return next(new AppError('There is no comments yet'));
  }

  //? send success response with the comments
  return res.status(200).json({
    status: 'success',
    results: comments.length,
    comments,
  });
});

exports.createComment = catchAsync(async (req, res, next) => {
  const { id: userId } = req.currentUser;
  const { text, postId } = req.body;

  const comment = await Comment.create({
    text,
    postId,
    userId,
  });

  return res.status(201).json({
    status: 'success',
    message: 'Comment successfully created',
    comment,
  });
});

exports.getById = catchAsync(async (req, res, next) => {
  const { comment } = req;

  return res.status(200).json({
    status: 'success',
    comment,
  });
});

exports.updateComment = catchAsync(async (req, res, next) => {
  const { comment } = req;
  const { text } = req.body;

  await comment.update({ text });

  return res.status(200).json({
    status: 'success',
    message: 'Successfully updated comment',
  });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  const { comment } = req;

  await comment.update({ status: false });

  return res.status(200).json({
    status: 'success',
    message: 'comment has been deleted',
  });
});
