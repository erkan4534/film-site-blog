const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Ad zorunludur'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Soyad zorunludur'],
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email zorunludur'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Şifre zorunludur'],
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    plan: {
      type: String,
      enum: ['free', 'premium'],
      default: 'free',
    },
    premiumValidDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('User', userSchema);
