const express = require('express');
const { verifyToken } = require('../middleware/auth.js');
const { authorize } = require('../middleware/authorize.js');
const {
  categoryCreate,
  categorySearch,
  categoryFind,
  categoryUpdate,
  categoryDelete,
} = require('../controllers/categoryController');
const {
  createCategoryValidator,
  updateCategoryValidator,
  categoryIdValidator,
  searchCategoryValidator,
} = require('../validators/categoryValidators');

const router = express.Router();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     tags: [Categories]
 *     summary: Kategorileri listele / ara
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Kategori adına göre ara
 *     responses:
 *       200:
 *         description: Kategori listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       400:
 *         description: Validasyon hatası
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *   post:
 *     tags: [Categories]
 *     summary: Kategori oluştur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryCreate'
 *     responses:
 *       201:
 *         description: Kategori oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Validasyon hatası
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *
 * /api/categories/{id}:
 *   get:
 *     tags: [Categories]
 *     summary: ID ile kategori getir
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Kategori bulundu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Validasyon hatası (geçersiz id)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       404:
 *         description: Kategori bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *   put:
 *     tags: [Categories]
 *     summary: Kategori güncelle
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
 *             $ref: '#/components/schemas/CategoryUpdate'
 *     responses:
 *       200:
 *         description: Kategori güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Validasyon hatası
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *   delete:
 *     tags: [Categories]
 *     summary: Kategori sil
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Kategori silindi
 *       400:
 *         description: Validasyon hatası (geçersiz id)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 */
router.post('/', verifyToken, authorize('user', 'admin'), createCategoryValidator, categoryCreate);
router.get('/', verifyToken, authorize('user', 'admin'), searchCategoryValidator, categorySearch);
router.get('/:id', verifyToken, authorize('user', 'admin'), categoryIdValidator, categoryFind);
router.put('/:id', verifyToken, authorize('user', 'admin'), updateCategoryValidator, categoryUpdate);
router.delete('/:id', verifyToken, authorize('admin'), categoryIdValidator, categoryDelete);

module.exports = router;
