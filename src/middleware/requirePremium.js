const User = require('../models/User');

const requirePremium = async (req, res, next) => {
  try {
    if (req.user?.role === 'admin') {
      return next();
    }

    if (!req.user?.id) {
      return res.status(403).json({ message: 'Token gerekli' });
    }

    const user = await User.findById(req.user.id).select('plan premiumValidDate role');

    if (!user) {
      return res.status(401).json({ message: 'Kullanıcı bulunamadı' });
    }

    const isPremium =
      user.plan === 'premium' &&
      user.premiumValidDate &&
      user.premiumValidDate > new Date();

    if (!isPremium) {
      return res.status(403).json({ message: 'Premium abonelik gerekli' });
    }

    req.user.plan = user.plan;
    req.user.premiumValidDate = user.premiumValidDate;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { requirePremium };
