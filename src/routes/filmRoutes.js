const express = require('express');
const {
  filmCreate,
  filmSearch,
  filmUpdate,
  filmDelete,
} = require('../controllers/filmController');

const router = express.Router();

router.post('/', filmCreate);
router.get('/', filmSearch);
router.put('/:id', filmUpdate);
router.delete('/:id', filmDelete);

module.exports = router;
