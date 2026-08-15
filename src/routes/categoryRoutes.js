const express = require('express');
const {
  categoryCreate,
  categorySearch,
  categoryFind,
  categoryUpdate,
  categoryDelete,
} = require('../controllers/categoryController');

const router = express.Router();

router.post('/', categoryCreate);
router.get('/', categorySearch);
router.get('/:id', categoryFind);
router.put('/:id', categoryUpdate);
router.delete('/:id', categoryDelete);

module.exports = router;
