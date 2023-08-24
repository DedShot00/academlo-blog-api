const catchAsync = require('../utils/catchAsync');
const Post = require('../models/post.model');
const AppError = require('../utils/appError');
const User = require('../models/user.model');
const Comment = require('../models/comment.model');
const PostImg = require('../models/postImg.model');

const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const storage = require('../utils/firebase');

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
      { model: Comment, include: [{ model: User }] },
      { model: PostImg, attributes: ['id', 'postImgUrl'] },
    ],
    order: [['createdAt', 'DESC']],
  });

  if (posts.length < 1) {
    return next(new AppError('There is no posts yet', 404));
  }

  const postPromises = posts.map(async (post) => {
    const userProfileRef = ref(storage, post.user.profileImgUrl);
    const resolvedUser = await getDownloadURL(userProfileRef);

    //* resolver urls postImgs
    post.user.profileImgUrl = resolvedUser;

    if (post.PostImgs.length > 0) {
      const postImgsPromises = post.PostImgs.map(async (postImg) => {
        const imgRef = ref(storage, postImg.postImgUrl);
        const resolvedUrl = await getDownloadURL(imgRef);

        postImg.postImgUrl = resolvedUrl;

        return postImg;
      });

      await Promise.all(postImgsPromises);
    }

    if (post.comments.length > 0) {
      const userImgCommentsPromises = post.comments.map(async (comment) => {
        const imgRef = ref(storage, comment.user.profileImgUrl);
        const url = await getDownloadURL(imgRef);

        comment.user.profileImgUrl = url;
        return comment;
      });
      await Promise.all(userImgCommentsPromises);
    }
  });

  await Promise.all(postPromises);

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
    include: [{model:PostImg, attributes:['postImgUrl']}],
    order: [['createdAt', 'DESC']],
  });

  if (posts.length > 0) {
    const postPromises = posts.map(async (post) => {
      const postImgPromises = post.PostImgs.map( async (img) => { 
        const imgRef = ref(storage, img.postImgUrl)
        const downloadUrl = await getDownloadURL(imgRef)

        img.postImgUrl = downloadUrl
        return img
       })
       const resolvedPostImgs = await Promise.all(postImgPromises)
       post.PostImgs = resolvedPostImgs

       return post
    });

    await Promise.all(postPromises)
  }

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

  const postImgsPromises = req.files.map(async (file) => {
    const imgRef = ref(storage, `posts/${Date.now()}-${file.originalname}`);
    const uploadedImg = await uploadBytes(imgRef, file.buffer);

    return await PostImg.create({
      postId: post.id,
      postImgUrl: uploadedImg.metadata.fullPath,
    });
  });

  const x = await Promise.all(postImgsPromises);

  return res.status(201).json({
    status: 'succes',
    message: 'Post has been created successfully!',
    post
  });
});

exports.getById = catchAsync(async (req, res, next) => {
  const { post } = req;

  //? generate img download url and assign it to profileImgUrl
  const userProfileRef = ref(storage, post.user.profileImgUrl);
  const resolvedUser = await getDownloadURL(userProfileRef);

  //* resolver urls postImgs
  post.user.profileImgUrl = resolvedUser;

  if (post.PostImgs.length > 0) {
    const postImgsPromises = post.PostImgs.map(async (postImg) => {
      const imgRef = ref(storage, postImg.postImgUrl);
      const resolvedUrl = await getDownloadURL(imgRef);

      postImg.postImgUrl = resolvedUrl;

      return postImg;
    });

    await Promise.all(postImgsPromises);
  }

  if (post.comments.length > 0) {
    const userImgCommentsPromises = post.comments.map(async (comment) => {
      const imgRef = ref(storage, comment.user.profileImgUrl);
      const url = await getDownloadURL(imgRef);

      comment.user.profileImgUrl = url;
      return comment;
    });
    await Promise.all(userImgCommentsPromises);
  }

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
