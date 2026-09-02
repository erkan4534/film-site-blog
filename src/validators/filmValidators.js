const { body, param, query } = require('express-validator');
const validate = require('../middleware/validate.js');

const createFilmValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Film adı zorunludur')
    .isLength({ min: 2 })
    .withMessage('Film adı en az 2 karakter olmalıdır'),
  body('description')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ min: 3 })
    .withMessage('Açıklama en az 3 karakter olmalıdır'),
  body('category')
    .optional({ values: 'falsy' })
    .isMongoId()
    .withMessage('Geçersiz kategori id'),
  validate,
];

const updateFilmValidator = [
  param('id').isMongoId().withMessage('Geçersiz film id'),
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Film adı boş olamaz')
    .isLength({ min: 2 })
    .withMessage('Film adı en az 2 karakter olmalıdır'),
  body('description')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ min: 3 })
    .withMessage('Açıklama en az 3 karakter olmalıdır'),
  body('category')
    .optional({ values: 'falsy' })
    .isMongoId()
    .withMessage('Geçersiz kategori id'),
  validate,
];

const filmIdValidator = [
  param('id').isMongoId().withMessage('Geçersiz film id'),
  validate,
];

const searchFilmValidator = [
  query('name').optional({ values: 'falsy' }).trim(),
  query('category')
    .optional({ values: 'falsy' })
    .isMongoId()
    .withMessage('Geçersiz kategori id'),
  validate,
];

module.exports = {
  createFilmValidator,
  updateFilmValidator,
  filmIdValidator,
  searchFilmValidator,
};
