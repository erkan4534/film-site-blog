const express = require('express');
const { verifyToken } = require('../middleware/auth.js');
const { authorize } = require('../middleware/authorize.js');
const {paymentSubscribe,getMyPayments,paymentList,paymentIyzicoCallback,paymentIyzicoWebhook} = require('../controllers/paymentController');
const { subscribeValidator } = require('../validators/paymentValidators');

const router = express.Router();

/**
 * @swagger
 * /api/payments/subscribe:
 *   post:
 *     tags: [Payments]
 *     summary: Premium abonelik (mock veya iyzico Checkout Form)
 *     description: |
 *       PAYMENT_PROVIDER=mock ise hemen premium açılır.
 *       PAYMENT_PROVIDER=iyzico ise pending Payment oluşur ve paymentPageUrl döner;
 *       frontend kullanıcıyı bu URL'ye yönlendirmelidir.
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentSubscribe'
 *     responses:
 *       200:
 *         description: Mock'ta aktif / iyzico'da paymentPageUrl
 *       403:
 *         description: Token gerekli
 *
 * /api/payments/my-payments:
 *   get:
 *     tags: [Payments]
 *     summary: Kendi ödeme geçmişim
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ödeme listesi
 *
 * /api/payments:
 *   get:
 *     tags: [Payments]
 *     summary: Tüm ödemeler (admin)
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tüm ödemeler
 *       403:
 *         description: Yetki yok
 *
 * /api/payments/iyzico/callback:
 *   post:
 *     tags: [Payments]
 *     summary: iyzico Checkout Form callback (token ile sonucu doğrula)
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ödeme başarılı, premium aktif
 *       400:
 *         description: Ödeme başarısız veya token yok
 *
 * /api/payments/iyzico/webhook:
 *   post:
 *     tags: [Payments]
 *     summary: iyzico webhook (yedek teyit)
 *     responses:
 *       200:
 *         description: Webhook işlendi
 */
router.post('/subscribe', verifyToken,authorize('user', 'admin'),subscribeValidator,paymentSubscribe);
router.get('/my-payments', verifyToken, authorize('user', 'admin'), getMyPayments);
router.get('/', verifyToken, authorize('admin'), paymentList);

// iyzico yönlendirmesi / webhook — auth yok
router.post('/iyzico/callback', paymentIyzicoCallback);
router.post('/iyzico/webhook', paymentIyzicoWebhook);

module.exports = router;
