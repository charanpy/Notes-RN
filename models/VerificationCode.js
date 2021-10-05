const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { default: isEmail } = require('validator/lib/isEmail');

const VerificationCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      required: [true, 'Code is required'],
    },
    email: {
      type: String,
      validate: isEmail,
      required: [true, 'Email is required'],
    },
  },
  { timestamps: true }
);

VerificationCodeSchema.pre('save', async function (next) {
  this.code = await bcrypt.hash(this.code, 8);
});

VerificationCodeSchema.methods.compareCode = async function (
  userCode,
  hashedCode
) {
  return await bcrypt.compare(userCode, hashedCode);
};

const Verification = mongoose.model('Verification', VerificationCodeSchema);

module.exports = Verification;
