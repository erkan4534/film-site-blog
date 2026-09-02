const express = require('express');
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

router.post('/', createCategoryValidator, categoryCreate);
router.get('/', searchCategoryValidator, categorySearch);
router.get('/:id', categoryIdValidator, categoryFind);
router.put('/:id', updateCategoryValidator, categoryUpdate);
router.delete('/:id', categoryIdValidator, categoryDelete);

module.exports = router;
