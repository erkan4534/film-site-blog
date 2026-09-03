const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Başlık zorunludur'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'İçerik zorunludur'],
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Yazar zorunludur'],
    },
    film: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Film',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('Post', postSchema);
