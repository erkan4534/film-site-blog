const { body } = require('express-validator');
const validate = require('../middleware/validate.js');

const subscribeValidator = [
  body('plan').optional().isIn(['monthly', 'yearly']).withMessage('Plan monthly veya yearly olmalıdır'),
  validate,
];

module.exports = {
  subscribeValidator,
};
