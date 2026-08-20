const express = require('express');
const { verifyToken } = require('../middleware/auth.js');

const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

const router = express.Router();

router.get('/', getAllUsers);
router.post('/', verifyToken, createUser);
router.put('/:id', updateUser);
router.delete('/:userId', deleteUser);

module.exports = router;
