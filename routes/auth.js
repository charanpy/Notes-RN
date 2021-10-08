const express = require('express');

const {
  register,
  sendVerificationCode,
  activateAccount,
  login,
  getMe,
  protect,
} = require('../controller/authController');

const router = express.Router();

router.route('/register').post(register);

router.route('/login').post(login);

router.route('/sendVcode').post(sendVerificationCode);

router.route('/activate').post(activateAccount);

router.route('/me').get(protect, getMe);

module.exports = router;
