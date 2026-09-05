const Iyzipay = require('iyzipay');
const iyzicoConfig = require('../config/iyzicoConfig');

const iyzipay = new Iyzipay({
  apiKey: iyzicoConfig.apiKey,
  secretKey: iyzicoConfig.secretKey,
  uri: iyzicoConfig.uri,
});

const runIyzico = (method, request) =>
  new Promise((resolve, reject) => {
    method(request, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });

const buildBuyer = (user, ip) => {
  const address = user.address || 'Istanbul, Turkey';

  return {
    id: String(user._id),
    name: user.firstName,
    surname: user.lastName,
    gsmNumber: iyzicoConfig.testGsm,
    email: user.email,
    identityNumber: iyzicoConfig.testIdentity,
    registrationAddress: address,
    ip: ip || '85.34.78.112',
    city: 'Istanbul',
    country: 'Turkey',
  };
};

const buildAddress = (user) => {
  const address = user.address || 'Istanbul, Turkey';
  return {
    contactName: `${user.firstName} ${user.lastName}`,
    city: 'Istanbul',
    country: 'Turkey',
    address,
  };
};

const initializeCheckoutForm = async ({ payment, user, ip }) => {
  const price = Number(payment.amount).toFixed(2);
  const planLabel = payment.plan === 'yearly' ? 'Premium Yearly' : 'Premium Monthly';

  const request = {
    locale: Iyzipay.LOCALE.TR,
    conversationId: payment.conversationId,
    price,
    paidPrice: price,
    currency: Iyzipay.CURRENCY.TRY,
    basketId: String(payment._id),
    paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
    callbackUrl: iyzicoConfig.callbackUrl,
    enabledInstallments: [1],
    buyer: buildBuyer(user, ip),
    shippingAddress: buildAddress(user),
    billingAddress: buildAddress(user),
    basketItems: [
      {
        id: `premium-${payment.plan}`,
        name: planLabel,
        category1: 'Subscription',
        itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
        price,
      },
    ],
  };

  const result = await runIyzico(
    iyzipay.checkoutFormInitialize.create.bind(iyzipay.checkoutFormInitialize),
    request
  );

  if (result.status !== 'success') {
    const error = new Error(result.errorMessage || 'iyzico initialize basarisiz');
    error.iyzico = result;
    throw error;
  }

  return {
    token: result.token,
    paymentPageUrl: result.paymentPageUrl,
    tokenExpireTime: result.tokenExpireTime,
  };
};

const retrieveCheckoutForm = async (token) => {
  const result = await runIyzico(
    iyzipay.checkoutForm.retrieve.bind(iyzipay.checkoutForm),
    {
      locale: Iyzipay.LOCALE.TR,
      token,
    }
  );

  return result;
};

module.exports = {
  initializeCheckoutForm,
  retrieveCheckoutForm,
};
