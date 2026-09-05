const corsOptions = {
  origin: function (origin, callback) {
    // Origin yoksa (Postman, aynı origin form POST) izin ver
    if (!origin) {
      return callback(null, true);
    }

    // Development: test kolaylığı (iyzico callback / swagger 127.0.0.1)
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }

    const whiteList = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'https://www.google.com',
      'https://sandbox-cpp.iyzipay.com',
      'https://sandbox-api.iyzipay.com',
      'https://sandbox-merchant.iyzipay.com',
      'https://sandbox-ode.iyzico.com',
      'https://sandbox-merchantgw.iyzipay.com',
      'https://cpp.iyzipay.com',
      'https://api.iyzipay.com',
      'https://merchant.iyzipay.com',
      'https://www.iyzico.com',
    ];

    const isIyzico =
      origin.endsWith('.iyzipay.com') ||
      origin.endsWith('.iyzico.com') ||
      origin === 'https://iyzico.com' ||
      origin === 'https://iyzipay.com';

    if (whiteList.includes(origin) || isIyzico) {
      return callback(null, true);
    }

    console.warn('CORS engellendi, Origin:', origin);
    return callback(new Error('CORS politikası tarafından engellendiniz.'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400,
};

module.exports = corsOptions;
