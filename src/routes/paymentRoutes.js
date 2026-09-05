const express = require('express');
const { verifyToken } = require('../middleware/auth.js');
const { authorize } = require('../middleware/authorize.js');
const {paymentSubscribe,getMyPayments,paymentList,} = require('../controllers/paymentController');
const { subscribeValidator } = require('../validators/paymentValidators');

const router = express.Router();

/**
 * @swagger
 * /api/payments/subscribe:
 *   post:
 *     tags: [Payments]
 *     summary: Premium abonelik (mock ödeme)
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               plan:
 *                 type: string
 *                 enum: [monthly, yearly]
 *                 default: monthly
 *     responses:
 *       200:
 *         description: Abonelik aktifleştirildi
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
 */
router.post('/subscribe',verifyToken,authorize('user', 'admin'),subscribeValidator,paymentSubscribe);
router.get('/my-payments', verifyToken, authorize('user', 'admin'), getMyPayments);
router.get('/', verifyToken, authorize('admin'), paymentList);

module.exports = router;
