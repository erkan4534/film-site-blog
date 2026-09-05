module.exports = {
  provider: process.env.PAYMENT_PROVIDER || 'iyzico',
  apiKey: process.env.IYZICO_API_KEY,
  secretKey: process.env.IYZICO_SECRET_KEY,
  uri: process.env.IYZICO_URI || 'https://sandbox-api.iyzipay.com',
  callbackUrl: process.env.IYZICO_CALLBACK_URL,
  testIdentity: process.env.IYZICO_TEST_IDENTITY || '74300864791',
  testGsm: process.env.IYZICO_TEST_GSM || '+905555434332',
};
