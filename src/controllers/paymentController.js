const Payment = require('../models/Payment');
const User = require('../models/User');

const PLAN_DAYS = {
  monthly: 30,
  yearly: 365,
};

const getPlanPrice = (plan) => {
  if (plan === 'yearly') {
    return Number(process.env.PREMIUM_YEARLY_PRICE || 999);
  }
  return Number(process.env.PREMIUM_MONTHLY_PRICE || 99);
};

// Mevcut premium bitişine (veya bugüne) gün ekler; yeni bitiş tarihini döner
const extendPremiumDate = (currentValidDate, days) => {
  const now = new Date(); // bugünün tarihi

  // Hâlâ geçerli premium var mı?
  const halaPremiumVar = currentValidDate && currentValidDate > now;

  // Varsa eski bitişten devam et; yoksa bugünden başla
  const base = halaPremiumVar ? new Date(currentValidDate) : now;

  base.setDate(base.getDate() + days); // base üzerine 30 veya 365 gün ekle
  return base; // yeni premiumValidDate
};

const paymentSubscribe = async (req, res) => {
  try {
    const plan = req.body.plan || 'monthly';
    const userId = req.user.id;
    const amount = getPlanPrice(plan);

    const payment = await Payment.create({
      user: userId,
      amount,
      currency: 'TRY',
      plan,
      status: 'paid',
      provider: 'mock',
      providerPaymentId: `mock_${Date.now()}`,
    });

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    user.plan = 'premium';
    user.premiumValidDate = extendPremiumDate(
      user.premiumValidDate,
      PLAN_DAYS[plan]
    );
    await user.save();

    return res.status(200).json({
      message: 'Abonelik aktifleştirildi (mock ödeme)',
      payment,
      user: {
        id: user._id,
        plan: user.plan,
        premiumValidDate: user.premiumValidDate,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    return res.status(200).json(payments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const paymentList = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('user', 'firstName lastName email plan')
      .sort({ createdAt: -1 });
    return res.status(200).json(payments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  paymentSubscribe,
  getMyPayments,
  paymentList,
};
