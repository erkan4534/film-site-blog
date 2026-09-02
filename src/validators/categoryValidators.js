const { body, param, query } = require('express-validator');
const validate = require('../middleware/validate.js');

const createCategoryValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Kategori adı zorunludur')
    .isLength({ min: 2 })
    .withMessage('Kategori adı en az 2 karakter olmalıdır'),
  body('description')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ min: 3 })
    .withMessage('Açıklama en az 3 karakter olmalıdır'),
  validate,
];

const updateCategoryValidator = [
  param('id').isMongoId().withMessage('Geçersiz kategori id'),
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Kategori adı boş olamaz')
    .isLength({ min: 2 })
    .withMessage('Kategori adı en az 2 karakter olmalıdır'),
  body('description')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ min: 3 })
    .withMessage('Açıklama en az 3 karakter olmalıdır'),
  validate,
];

const categoryIdValidator = [
  param('id').isMongoId().withMessage('Geçersiz kategori id'),
  validate,
];

const searchCategoryValidator = [
  query('name').optional({ values: 'falsy' }).trim(),
  validate,
];

module.exports = {
  createCategoryValidator,
  updateCategoryValidator,
  categoryIdValidator,
  searchCategoryValidator,
};
