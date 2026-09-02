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

router.get('/', getAllUsers);
router.post('/', verifyToken, createUserValidator, createUser);
router.put('/:id', updateUserValidator, updateUser);
router.delete('/:userId', userIdValidator, deleteUser);

module.exports = router;
