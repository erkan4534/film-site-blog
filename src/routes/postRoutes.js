const express = require('express');
const { verifyToken } = require('../middleware/auth.js');
const { authorize } = require('../middleware/authorize.js');
const { requirePremium } = require('../middleware/requirePremium.js');
const {
  postCreate,
  postSearch,
  postFind,
  postUpdate,
  postDelete,
} = require('../controllers/postController');
const {
  createPostValidator,
  updatePostValidator,
  postIdValidator,
  searchPostValidator,
} = require('../validators/postValidators');

const router = express.Router();

/**
 * @swagger
 * /api/posts:
 *   get:
 *     tags: [Posts]
 *     summary: Blog yazılarını listele / ara
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Başlığa göre ara
 *       - in: query
 *         name: film
 *         schema:
 *           type: string
 *         description: Film ObjectId
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Kategori ObjectId
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Yazar ObjectId
 *     responses:
 *       200:
 *         description: Yazı listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       400:
 *         description: Validasyon hatası
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *   post:
 *     tags: [Posts]
 *     summary: Blog yazısı oluştur
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostCreate'
 *     responses:
 *       201:
 *         description: Yazı oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Validasyon hatası
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *
 * /api/posts/{id}:
 *   get:
 *     tags: [Posts]
 *     summary: ID ile yazı getir
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
 *         description: Yazı bulundu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Yazı bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *   put:
 *     tags: [Posts]
 *     summary: Yazı güncelle
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostUpdate'
 *     responses:
 *       200:
 *         description: Yazı güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Validasyon hatası
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *   delete:
 *     tags: [Posts]
 *     summary: Yazı sil (sadece admin)
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
 *         description: Yazı silindi
 *       403:
 *         description: Yetki yok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 */
router.post('/', verifyToken, authorize('user', 'admin'), createPostValidator, postCreate);
router.get('/', verifyToken, authorize('user', 'admin'), searchPostValidator, postSearch);
router.get('/:id', verifyToken, authorize('user', 'admin'), requirePremium, postIdValidator, postFind);
router.put('/:id', verifyToken, authorize('user', 'admin'), updatePostValidator, postUpdate);
router.delete('/:id', verifyToken, authorize('admin'), postIdValidator, postDelete);

module.exports = router;
