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

router.post('/', createFilmValidator, filmCreate);
router.get('/', searchFilmValidator, filmSearch);
router.get('/:id', filmIdValidator, filmFind);
router.put('/:id', updateFilmValidator, filmUpdate);
router.delete('/:id', filmIdValidator, filmDelete);

module.exports = router;
