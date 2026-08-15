const express = require('express');
const {
  filmCreate,
  filmSearch,
  filmFind,
  filmUpdate,
  filmDelete,
} = require('../controllers/filmController');

const router = express.Router();

router.post('/', filmCreate);
router.get('/', filmSearch);
router.get('/:id', filmFind);
router.put('/:id', filmUpdate);
router.delete('/:id', filmDelete);

module.exports = router;
