const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

const generateToken = (payload, expiresIn = '1d') => {
  return jwt.sign(payload, process.env.JWT_TOKEN, {
    expiresIn,
  });
};

const verifyToken = async (token) => {
  let decoded;
  try {
    decoded = await promisify(jwt.verify)(token, process.env.JWT_TOKEN);
  } catch (e) {
    return false;
  }
  const freshUser = await User.findById(decoded.id);

  if (!freshUser) {
    return false;
  }

  return freshUser;
};

module.exports = {
  generateToken,
  verifyToken,
};
