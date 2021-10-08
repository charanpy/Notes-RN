const User = require('../models/User.model');
const Verification = require('../models/VerificationCode');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const generateCode = require('generate-password');
const sendEmail = require('../utils/nodemailer');
const { generateToken, verifyToken } = require('../utils/jwt');

const genCode = () =>
  generateCode.generate({
    numbers: true,
    length: 10,
  });

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please fill all fields', 400));
  }

  const user = await User.findOne({ email });
  console.log(await user.comparePassword(password, user.password));

  if (!user || !(await user.comparePassword(password, user.password)))
    return next(new AppError('Invalid credentials', 400));

  const token = await generateToken({ id: user._id }, '1d');

  return res.status(200).json({
    status: 'success',
    data: { user, token },
  });
});

exports.sendVerificationCode = catchAsync(async (req, res, next) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return next(new AppError('Please fill all fields', 400));
  }

  // await sendEmail({ to: email, subject: 'Hi', text: 'Hi' });

  const user = await User.findOne({ email });

  if (user && user?.isVerified)
    return next(new AppError('Email already registered', 400));

  if (!user) await User.create({ email, password, username });

  const code = genCode();

  const isCodeExist = await Verification.findOne({ email });

  if (isCodeExist) {
    isCodeExist.code = code;
    await isCodeExist.save();
    return res.status(200).json({
      status: 'success',
      verification: isCodeExist,
      code,
    });
  }

  const verification = await Verification.create({ code, email });

  return res.status(201).json({
    status: 'success',
    verification,
    code,
  });
});

exports.activateAccount = catchAsync(async (req, res, next) => {
  const { email, code } = req.body;

  if (!email || !code)
    return next(new AppError('Email and code is required', 400));

  const verification = await Verification.findOne({ email });

  if (!verification)
    return next(new AppError('Invalid verification code', 400));

  if (!(await verification.compareCode(code, verification.code))) {
    return next(new AppError('Invalid verification code', 400));
  }

  const user = await User.findOne({ email });
  user.isVerified = true;
  await user.save();

  await verification.remove();

  return res.status(200).json({
    status: 'success',
    user,
  });
});

exports.register = catchAsync(async (req, res, next) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return next(new AppError('Please fill all fields', 400));
  }

  const user = await User.findOne({ email });

  if (user) return next(new AppError('Email already registered', 400));

  const newUser = await User.create({ email, password, username });

  return res.status(200).json({ status: 'success', user: newUser });
});

exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  return res.status(200).json({
    status: 'success',
    user,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('You are not logged in.Please login to get access', 401)
    );
  }
  let decoded;
  try {
    decoded = await verifyToken(token, process.env.JWT_TOKEN);
  } catch (e) {
    return next(new AppError('Please login to get access', 401));
  }

  if (!decoded)
    return next(
      new AppError('You are not logged in.Please login to get access', 401)
    );
  const freshUser = await User.findById(decoded.id);

  if (!freshUser) {
    return next(new AppError('User does not exist', 401));
  }

  req.user = freshUser;

  next();
});
