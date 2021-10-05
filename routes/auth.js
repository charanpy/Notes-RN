const express = require('express');

const {
  register,
  sendVerificationCode,
  activateAccount,
} = require('../controller/authController');

const router = express.Router();

router.route('/register').post(register);

router.route('/sendVcode').post(sendVerificationCode);

router.route('/activate').post(activateAccount);
module.exports = router;
