const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      validate: isEmail,
      trim: true,
    },
    isGoogle: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: function () {
        console.log(this);
        if (this.isGoogle) return false;
        return [true, 'Password is required'];
      },
      trim: true,
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      minlength: [2, 'Username should be minimum of 2 character long'],
      trim: true,
    },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (this?.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
