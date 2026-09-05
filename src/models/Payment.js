const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Kullanıcı zorunludur'],
    },
    amount: {
      type: Number,
      required: [true, 'Tutar zorunludur'],
      min: [0, 'Tutar negatif olamaz'],
    },
    currency: {
      type: String,
      default: 'TRY',
      uppercase: true,
      trim: true,
    },
    plan: {
      type: String,
      enum: ['monthly', 'yearly'],
      default: 'monthly',
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    provider: {
      type: String,
      enum: ['mock', 'iyzico'],
      default: 'mock',
    },
    providerPaymentId: {
      type: String,
      trim: true,
      default: null,
    },
    conversationId: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    checkoutToken: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('Payment', paymentSchema);
