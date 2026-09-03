const { body, param, query } = require('express-validator');
const validate = require('../middleware/validate.js');

const createHistoryValidator = [
  body('type')
    .trim()
    .notEmpty()
    .withMessage('Geçmiş tipi zorunludur')
    .isIn(['watch', 'read'])
    .withMessage('Tip watch veya read olmalıdır'),
  body('film')
    .if(body('type').equals('watch'))
    .notEmpty()
    .withMessage('İzleme için film zorunludur')
    .isMongoId()
    .withMessage('Geçersiz film id'),
  body('film')
    .if(body('type').equals('read'))
    .isEmpty()
    .withMessage('Okuma kaydında film gönderilemez'),
  body('post')
    .if(body('type').equals('read'))
    .notEmpty()
    .withMessage('Okuma için yazı zorunludur')
    .isMongoId()
    .withMessage('Geçersiz yazı id'),
  body('post')
    .if(body('type').equals('watch'))
    .isEmpty()
    .withMessage('İzleme kaydında yazı gönderilemez'),
  validate,
];

const searchHistoryValidator = [
  query('type')
    .optional({ values: 'falsy' })
    .isIn(['watch', 'read'])
    .withMessage('Tip watch veya read olmalıdır'),
  query('limit')
    .optional({ values: 'falsy' })
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit 1-100 arasında olmalıdır')
    .toInt(),
  validate,
];

const historyIdValidator = [
  param('id').isMongoId().withMessage('Geçersiz geçmiş id'),
  validate,
];

module.exports = {
  createHistoryValidator,
  searchHistoryValidator,
  historyIdValidator,
};
