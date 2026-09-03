const express = require('express');
const { verifyToken } = require('../middleware/auth.js');
const { authorize } = require('../middleware/authorize.js');
const {
  historyCreate,
  historySearch,
  historyDelete,
} = require('../controllers/historyController');
const {
  createHistoryValidator,
  searchHistoryValidator,
  historyIdValidator,
} = require('../validators/historyValidators');

const router = express.Router();

/**
 * @swagger
 * /api/history:
 *   get:
 *     tags: [History]
 *     summary: Kendi izleme / okuma geçmişini listele
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [watch, read]
 *         description: watch = film, read = blog yazısı
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 50
 *     responses:
 *       200:
 *         description: Geçmiş listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/History'
 *   post:
 *     tags: [History]
 *     summary: İzleme veya okuma kaydı oluştur / güncelle
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HistoryCreate'
 *     responses:
 *       200:
 *         description: Geçmiş kaydı oluşturuldu veya güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/History'
 *       400:
 *         description: Validasyon hatası
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       404:
 *         description: Film veya yazı bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *
 * /api/history/{id}:
 *   delete:
 *     tags: [History]
 *     summary: Geçmiş kaydı sil (sadece admin)
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Geçmiş kaydı silindi
 *       403:
 *         description: Yetki yok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       404:
 *         description: Kayıt bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 */
router.get('/', verifyToken, authorize('user', 'admin'), searchHistoryValidator, historySearch);
router.post('/', verifyToken, authorize('user', 'admin'), createHistoryValidator, historyCreate);
router.delete('/:id', verifyToken, authorize('admin'), historyIdValidator, historyDelete);

module.exports = router;
