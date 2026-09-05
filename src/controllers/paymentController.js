const Payment = require('../models/Payment');
const User = require('../models/User');
const iyzicoConfig = require('../config/iyzicoConfig');
const {initializeCheckoutForm,retrieveCheckoutForm,} = require('../services/iyzicoService');

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
  const now = new Date();
  const halaPremiumVar = currentValidDate && currentValidDate > now;
  const base = halaPremiumVar ? new Date(currentValidDate) : now;
  base.setDate(base.getDate() + days);
  return base;
};

const activatePremiumFromPayment = async (payment) => {
  if (payment.status === 'paid') {
    const user = await User.findById(payment.user).select(
      'plan premiumValidDate email'
    );
    return { payment, user, alreadyPaid: true };
  }

  payment.status = 'paid';
  await payment.save();

  const user = await User.findById(payment.user);
  if (!user) {
    throw new Error('Kullanıcı bulunamadı');
  }

  user.plan = 'premium';
  user.premiumValidDate = extendPremiumDate(
    user.premiumValidDate,
    PLAN_DAYS[payment.plan] || PLAN_DAYS.monthly
  );
  await user.save();

  return { payment, user, alreadyPaid: false };
};

const subscribeWithMock = async (userId, plan, amount) => {
  const payment = await Payment.create({
    user: userId,
    amount,
    currency: 'TRY',
    plan,
    status: 'paid',
    provider: 'mock',
    providerPaymentId: `mock_${Date.now()}`,
    conversationId: `mock_${userId}_${Date.now()}`,
  });

  const user = await User.findById(userId);
  if (!user) {
    return { status: 404, body: { message: 'Kullanıcı bulunamadı' } };
  }

  user.plan = 'premium';
  user.premiumValidDate = extendPremiumDate(
    user.premiumValidDate,
    PLAN_DAYS[plan]
  );
  await user.save();

  return {
    status: 200,
    body: {
      message: 'Abonelik aktifleştirildi (mock ödeme)',
      payment,
      user: {
        id: user._id,
        plan: user.plan,
        premiumValidDate: user.premiumValidDate,
      },
    },
  };
};

const subscribeWithIyzico = async (userId, plan, amount, ip) => {
  const user = await User.findById(userId);
  if (!user) {
    return { status: 404, body: { message: 'Kullanıcı bulunamadı' } };
  }

  const conversationId = `pay_${userId}_${Date.now()}`;

  const payment = await Payment.create({
    user: userId,
    amount,
    currency: 'TRY',
    plan,
    status: 'pending',
    provider: 'iyzico',
    conversationId,
  });

  try {
    const checkout = await initializeCheckoutForm({ payment, user, ip });

    payment.checkoutToken = checkout.token;
    await payment.save();

    return {
      status: 200,
      body: {
        message: 'Ödeme sayfasına yönlendirin',
        payment,
        token: checkout.token,
        paymentPageUrl: checkout.paymentPageUrl,
        tokenExpireTime: checkout.tokenExpireTime,
      },
    };
  } catch (error) {
    payment.status = 'failed';
    await payment.save();

    return {
      status: 502,
      body: {
        message: error.message || 'iyzico ödeme başlatılamadı',
        details: error.iyzico || undefined,
      },
    };
  }
};

const paymentSubscribe = async (req, res) => {
  try {
    const plan = req.body.plan || 'monthly';
    const userId = req.user.id;
    const amount = getPlanPrice(plan);
    const provider = iyzicoConfig.provider;

    const result =
      provider === 'mock'
        ? await subscribeWithMock(userId, plan, amount)
        : await subscribeWithIyzico(userId, plan, amount, req.ip);

    return res.status(result.status).json(result.body);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const paymentIyzicoCallback = async (req, res) => {
  try {
    const token = req.body.token || req.query.token;
    if (!token) {
      return res.status(400).json({ message: 'token gerekli' });
    }

    const result = await retrieveCheckoutForm(token);

    const payment = await Payment.findOne({
      $or: [
        { checkoutToken: token },
        { conversationId: result.conversationId },
      ],
    });

    if (!payment) {
      return res.status(404).json({ message: 'Ödeme kaydı bulunamadı' });
    }

    if (result.status !== 'success' || result.paymentStatus !== 'SUCCESS') {
      payment.status = 'failed';
      await payment.save();
      return res.status(400).json({
        message: 'Ödeme başarısız',
        payment,
        iyzico: {
          status: result.status,
          paymentStatus: result.paymentStatus,
          errorMessage: result.errorMessage,
        },
      });
    }

    const paidPrice = Number(result.paidPrice);
    if (Math.abs(paidPrice - Number(payment.amount)) > 0.01) {
      payment.status = 'failed';
      await payment.save();
      return res.status(400).json({ message: 'Ödeme tutarı uyuşmuyor' });
    }

    if (result.paymentId) {
      payment.providerPaymentId = String(result.paymentId);
      await payment.save();
    }

    const { user, alreadyPaid } = await activatePremiumFromPayment(payment);

    return res.status(200).json({
      message: alreadyPaid
        ? 'Ödeme zaten tamamlanmış'
        : 'Ödeme başarılı, premium aktif',
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

const paymentIyzicoWebhook = async (req, res) => {
  try {
    const { paymentConversationId, paymentId, status } = req.body;

    if (!paymentConversationId) {
      return res.status(400).json({ message: 'paymentConversationId gerekli' });
    }

    const payment = await Payment.findOne({
      conversationId: paymentConversationId,
    });

    if (!payment) {
      return res.status(404).json({ message: 'Ödeme kaydı bulunamadı' });
    }

    if (String(status).toUpperCase() !== 'SUCCESS') {
      if (payment.status !== 'paid') {
        payment.status = 'failed';
        await payment.save();
      }
      return res.status(200).json({ message: 'Webhook işlendi (failed)' });
    }

    if (paymentId) {
      payment.providerPaymentId = String(paymentId);
      await payment.save();
    }

    await activatePremiumFromPayment(payment);
    return res.status(200).json({ message: 'Webhook işlendi (success)' });
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
  paymentIyzicoCallback,
  paymentIyzicoWebhook,
};
