const catchAsync = require('../utils/catchAsync');
const Post = require('../models/post.model');
const AppError = require('../utils/appError');
const User = require('../models/user.model');
const Comment = require('../models/comment.model');

exports.findAllPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.findAll({
    where: {
      status: true,
    },
    attributes: {
      exclude: ['status', 'userId'],
    },
    include: [
      {
        model: User,
        attributes: ['id', 'name', 'description', 'profileImgUrl'],
      },
      {
        model: Comment,
        include: [{ model: User }],
      },
    ],
    order: [['createdAt', 'DESC']],
  });

  if (posts.length < 1) {
    return next(new AppError('There is no posts yet'));
  }

  return res.status(200).json({
    status: 'succes',
    results: posts.length,
    posts,
  });
});

exports.findUserPosts = catchAsync(async (req, res, next) => {
  const { id: userId } = req.currentUser;

  const posts = await Post.findAll({
    where: {
      status: true,
      userId,
    },
    attributes: {
      exclude: ['status'],
    },
    include: [
      {
        model: Comment,
        attributes:['text','id'],
        include: [
          { 
            model: User, 
            attributes: ['name', 'email', 'profileImgUrl'] 
          },
        ],
      },
    ],
    order: [['createdAt', 'DESC']],
  });

  return res.status(200).json({
    status: 'success',
    resutls: posts.length,
    posts,
  });
});

exports.createPost = catchAsync(async (req, res, next) => {
  const { title, content } = req.body;
  const { id: userId } = req.currentUser;

  const post = await Post.create({
    title,
    content,
    userId,
  });

  return res.status(201).json({
    status: 'succes',
    message: 'Post has been created successfully!',
  });
});

exports.getById = catchAsync(async (req, res, next) => {
  const { post } = req;

  return res.status(200).json({
    status: 'success',
    post,
  });
});

exports.updatePost = catchAsync(async (req, res, next) => {
  const { post } = req;
  const { title, content } = req.body;

  await post.update({
    title,
    content,
  });

  return res.status(200).json({
    status: 'success',
    message: 'Successfully updated post',
  });
});

exports.deletePost = catchAsync(async (req, res, next) => {
  const { post } = req;

  await post.update({
    status: false,
  });

  return res.status(200).json({
    status: 'success',
    message: 'Post deleted successfully',
  });
});
