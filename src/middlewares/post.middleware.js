const catchAsync = require("../utils/catchAsync");
const Post = require('../models/post.model');
const AppError = require("../utils/appError");
const User = require("../models/user.model");

exports.validpost = catchAsync(async (req, res, next) => { 
  //? get id from params
  const {id} = req.params

  //?search post 
  const post = await Post.findOne({
    where:{
      status: true,
      id
    },
    include:[{model:User, attributes:['id','name']}]
  })

  //? validate if post exist
  if (!post) {
    return next(new AppError(`Post with id: ${id} can't be found`))
  }

  //? add post to req
  req.user = post.user
  req.post = post
  next()
})
