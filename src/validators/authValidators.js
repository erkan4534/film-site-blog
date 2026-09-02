const { body, validationResult } = require('express-validator');
const validate = require('../middleware/validate.js');

const registerValidator = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('Ad zorunludur')
    .isLength({ min: 2 })
    .withMessage('Ad en az 2 karakter olmalıdır'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Soyad zorunludur')
    .isLength({ min: 2 })
    .withMessage('Soyad en az 2 karakter olmalıdır'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email zorunludur')
    .isEmail()
    .withMessage('Geçerli bir email giriniz')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Şifre zorunludur')
    .isLength({ min: 6 })
    .withMessage('Şifre en az 6 karakter olmalıdır'),
  body('address')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ min: 3 })
    .withMessage('Adres en az 3 karakter olmalıdır'),
    validate,
];

const loginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email zorunludur')
    .isEmail()
    .withMessage('Geçerli bir email giriniz')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Şifre zorunludur'),
    validate,
];

module.exports = {
  registerValidator,
  loginValidator,
};
