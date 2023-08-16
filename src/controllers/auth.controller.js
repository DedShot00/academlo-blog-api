const AppError = require('../utils/appError');
const bcrypt = require('bcryptjs');
const catchAsync = require('../utils/catchAsync');
const generateJWT = require('../utils/jwt');
const storage = require('../utils/firebase');
const User = require('../models/user.model');

const { ref, uploadBytes } = require('firebase/storage');

exports.signUp = catchAsync(async (req, res) => {
  const { name, email, password, description } = req.body;

  const imgRef = ref(storage, `users/${Date.now()}-${req.file.originalname}`);
  const imgUpload = await uploadBytes(imgRef, req.file.buffer);

  const salt = await bcrypt.genSalt(12);
  const encryptedPass = await bcrypt.hash(password, salt);

  const user = await User.create({
    name: name.toLowerCase().trim(),
    email: email.toLowerCase().trim(),
    password: encryptedPass,
    description,
    profileImgUrl: imgUpload.metadata.fullPath,
  });

  const token = await generateJWT(user.id);

  res.status(200).json({
    status: 'success',
    message: 'user has been created ',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      description: user.description,
      profileImgUrl: user.profileImgUrl,
    },
  });
});

exports.signIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: {
      email: email.toLowerCase().trim(),
      status: 'active',
    },
  });

  if (!user) {
    return next(new AppError(`user with email: ${email} not found`, 404));
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const token = await generateJWT(user.id);

  res.status(200).json({
    status: 'success',
    message: 'succesfully loged in',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      description: user.description,
      profileImageUrl: user.profileImageUrl,
    },
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //todo traer usuario, viene en la req del middleware
  const { user } = req;

  //todo traer datos de req.body
  const { currentPassword, newPassword } = req.body;

  //todo validar si la contraseña nueva y la actual son iguales
  if (currentPassword === newPassword) {
    return next(new AppError('Password cannot be the same', 401));
  }

  //todo validar contraseña actual igual a contraseña en base
  if (!(await bcrypt.compare(currentPassword, user.password))) {
    return next(new AppError('Invalid password', 401));
  }

  //todo encriptar nueva contraseña
  const salt = await bcrypt.genSalt(12);
  const encryptedPass = await bcrypt.hash(newPassword, salt);

  //todo actualizar user que viene en la req
  await user.update({
    password: encryptedPass,
    passwordChangedAt: new Date(),
  });

  //todo mensaje de confirmacion
  return res.status(200).json({
    status: 'success',
    message: 'password has been succesfully update ',
  });
});
