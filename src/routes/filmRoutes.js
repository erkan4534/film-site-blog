const express = require('express');
const {
  filmCreate,
  filmSearch,
  filmFind,
  filmUpdate,
  filmDelete,
} = require('../controllers/filmController');
const {
  createFilmValidator,
  updateFilmValidator,
  filmIdValidator,
  searchFilmValidator,
} = require('../validators/filmValidators');

const router = express.Router();

/**
 * @swagger
 * /api/films:
 *   get:
 *     tags: [Films]
 *     summary: Filmleri listele / ara
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Film adına göre ara
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Kategori ObjectId
 *     responses:
 *       200:
 *         description: Film listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Film'
 *   post:
 *     tags: [Films]
 *     summary: Film oluştur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FilmCreate'
 *     responses:
 *       201:
 *         description: Film oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Film'
 *       400:
 *         description: Validasyon hatası
 *
 * /api/films/{id}:
 *   get:
 *     tags: [Films]
 *     summary: ID ile film getir
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Film bulundu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Film'
 *       404:
 *         description: Film bulunamadı
 *   put:
 *     tags: [Films]
 *     summary: Film güncelle
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
 *             $ref: '#/components/schemas/FilmUpdate'
 *     responses:
 *       200:
 *         description: Film güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Film'
 *       400:
 *         description: Validasyon hatası
 *   delete:
 *     tags: [Films]
 *     summary: Film sil
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Film silindi
 *       400:
 *         description: Geçersiz film id
 */
router.post('/', createFilmValidator, filmCreate);
router.get('/', searchFilmValidator, filmSearch);
router.get('/:id', filmIdValidator, filmFind);
router.put('/:id', updateFilmValidator, filmUpdate);
router.delete('/:id', filmIdValidator, filmDelete);

module.exports = router;