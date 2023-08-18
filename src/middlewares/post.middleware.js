const catchAsync = require('../utils/catchAsync');
const Post = require('../models/post.model');
const AppError = require('../utils/appError');
const User = require('../models/user.model');
const PostImg = require('../models/postImg.model');
const Comment = require('../models/comment.model');

exports.validpost = catchAsync(async (req, res, next) => {
  //? get id from params
  const { id } = req.params;

  //?search post
  const post = await Post.findOne({
    where: {
      status: true,
      id,
    },
    include: [{ model: User, attributes: ['id', 'name', 'profileImgUrl'] }],
  });

  //? validate if post exist
  if (!post) {
    return next(new AppError(`Post with id: ${id} can't be found`));
  }

  //? add post to req
  req.user = post.user;
  req.post = post;
  next();
});

exports.validFullPost = catchAsync(async (req, res, next) => {
  //? get id from params
  const { id } = req.params;

  //?search post
  const post = await Post.findOne({
    where: {
      status: true,
      id,
    },
    include: [
      { model: User, attributes: ['id', 'name', 'profileImgUrl'] },
      { model: PostImg, attributes: ['id', 'postId', 'postImgUrl'] },
      {
        model: Comment,
        attributes: ['text', 'userId'],
        include: [{ model: User, attributes: ['name', 'profileImgUrl'] }],
      },
    ],
  });

  //? validate if post exist
  if (!post) {
    return next(new AppError(`Post with id: ${id} can't be found`));
  }

  //? add post to req
  req.user = post.user;
  req.post = post;
  next();
});
