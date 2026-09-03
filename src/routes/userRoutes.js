const express = require('express');
const { verifyToken } = require('../middleware/auth.js');

const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const {
  createUserValidator,
  updateUserValidator,
  userIdValidator,
} = require('../validators/userValidators');

const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Tüm kullanıcıları listele
 *     responses:
 *       200:
 *         description: Kullanıcı listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *   post:
 *     tags: [Users]
 *     summary: Yeni kullanıcı oluştur (auth gerekli)
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Kullanıcı oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       403:
 *         description: Token gerekli
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *
 * /api/users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Kullanıcı güncelle
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
 *             type: object
 *             properties:
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 6 }
 *               address: { type: string }
 *     responses:
 *       200:
 *         description: Kullanıcı güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Geçersiz istek
 *
 * /api/users/{userId}:
 *   delete:
 *     tags: [Users]
 *     summary: Kullanıcı sil
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Kullanıcı silindi
 *       400:
 *         description: Geçersiz kullanıcı id
 */
router.get('/', getAllUsers);
router.post('/', verifyToken, createUserValidator, createUser);
router.put('/:id', updateUserValidator, updateUser);
router.delete('/:userId', userIdValidator, deleteUser);

module.exports = router;