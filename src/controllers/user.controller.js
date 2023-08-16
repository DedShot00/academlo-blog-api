const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const { ref, getDownloadURL } = require('firebase/storage');
const storage = require('../utils/firebase');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    where: {
      status: 'active',
    },
  });

  const usersPromise = users.map(async (user) => {
    const imgRef = ref(storage, user.profileImgUrl);
    const url = await getDownloadURL(imgRef);

    user.profileImgUrl = url
    return user
  });

  const x = await Promise.all(usersPromise)

  return res.status(200).json({
    status: 'success',
    users: x,
  });
});

exports.getOneUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  const imgRef = ref(storage, user.profileImgUrl);
  const url = await getDownloadURL(imgRef);

  return res.status(200).json({
    status: 'success',
    user: {
      name: user.name,
      email: user.email,
      description: user.description,
      profileImgUrl: url,
      role: user.role,
    },
  });
});

exports.updateUser = catchAsync(async (req, res) => {
  const { user } = req;
  const { name, description } = req.body;

  await user.update({ name, description });

  return res.status(200).json({
    status: 'success',
  });
});

exports.deleteUser = catchAsync(async (req, res) => {
  const { user } = req;

  await user.update({ status: 'inactive' });

  return res.status(200).json({
    status: 'success',
  });
});
