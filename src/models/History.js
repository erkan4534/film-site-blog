const mongoose = require('mongoose');

const historySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Kullanıcı zorunludur'],
    },
    type: {
      type: String,
      enum: ['watch', 'read'],
      required: [true, 'Geçmiş tipi zorunludur'],
    },
    film: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Film',
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

historySchema.index(
  { user: 1, type: 1, film: 1 },
  { unique: true, partialFilterExpression: { type: 'watch', film: { $exists: true } } }
);

historySchema.index(
  { user: 1, type: 1, post: 1 },
  { unique: true, partialFilterExpression: { type: 'read', post: { $exists: true } } }
);

module.exports = mongoose.model('History', historySchema);
