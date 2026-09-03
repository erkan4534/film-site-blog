const { body, param, query } = require('express-validator');
const validate = require('../middleware/validate.js');

const createPostValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Başlık zorunludur')
    .isLength({ min: 2 })
    .withMessage('Başlık en az 2 karakter olmalıdır'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('İçerik zorunludur')
    .isLength({ min: 10 })
    .withMessage('İçerik en az 10 karakter olmalıdır'),
  body('film')
    .optional({ values: 'falsy' })
    .isMongoId()
    .withMessage('Geçersiz film id'),
  body('category')
    .optional({ values: 'falsy' })
    .isMongoId()
    .withMessage('Geçersiz kategori id'),
  validate,
];

const updatePostValidator = [
  param('id').isMongoId().withMessage('Geçersiz yazı id'),
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Başlık boş olamaz')
    .isLength({ min: 2 })
    .withMessage('Başlık en az 2 karakter olmalıdır'),
  body('content')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('İçerik boş olamaz')
    .isLength({ min: 10 })
    .withMessage('İçerik en az 10 karakter olmalıdır'),
  body('film')
    .optional({ values: 'falsy' })
    .isMongoId()
    .withMessage('Geçersiz film id'),
  body('category')
    .optional({ values: 'falsy' })
    .isMongoId()
    .withMessage('Geçersiz kategori id'),
  validate,
];

const postIdValidator = [
  param('id').isMongoId().withMessage('Geçersiz yazı id'),
  validate,
];

const searchPostValidator = [
  query('title').optional({ values: 'falsy' }).trim(),
  query('film')
    .optional({ values: 'falsy' })
    .isMongoId()
    .withMessage('Geçersiz film id'),
  query('category')
    .optional({ values: 'falsy' })
    .isMongoId()
    .withMessage('Geçersiz kategori id'),
  query('author')
    .optional({ values: 'falsy' })
    .isMongoId()
    .withMessage('Geçersiz yazar id'),
  validate,
];

module.exports = {
  createPostValidator,
  updatePostValidator,
  postIdValidator,
  searchPostValidator,
};
