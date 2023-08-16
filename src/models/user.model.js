const { DataTypes } = require('sequelize');
const { db } = require('../database/config');

const User = db.define('users', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(2),
    allowNull: false,
  },
  passwordChangedAt: {
    type: DataTypes.DATE,
    field: 'password_changed_at',
    allowNull: true,
  },
  profileImgUrl: {
    type: DataTypes.STRING,
    defaultValue:
      'https://images.pexels.com/photos/3541390/pexels-photo-3541390.jpeg',
    field: 'profile_img_url',
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
    allowNull: false,
  },
});


module.exports = User