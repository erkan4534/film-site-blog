const mongoose = require('mongoose');

const filmSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Film adı zorunludur'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
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

module.exports = mongoose.model('Film', filmSchema);
