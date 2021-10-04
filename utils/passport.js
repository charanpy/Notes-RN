const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User.model');
const { generateToken } = require('../utils/jwt');

const passportGoogle = (app) => {
  app.use(passport.initialize());
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK,
      },
      async (accessToken, refreshToken, profile, cb) => {
        console.log(profile);
        const {
          displayName: username,
          id: googleId,
          _json: { email, name },
        } = profile;
        const newUser = {
          googleId,
          email,
          isGoogle: true,
          username: name,
        };
        try {
          const user = await User.findOne({ email });
          if (!user) {
            const newUserDoc = await User.create(newUser);
            return cb(null, newUserDoc);
          }
          return cb(null, user);
        } catch (error) {
          console.log(error);
        }
      }
    )
  );

  app.get(
    '/google-login',
    passport.authenticate('google', {
      scope: ['profile', 'email'],
    })
  );
  app.get(
    '/auth/google/callback',
    passport.authenticate('google', {
      session: false,
      passReqToCallback: true,
    }),
    async function (req, res) {
      try {
        const token = await generateToken({ id: req.user._id }, '1d');
        return res.status(200).json({ token, status: 'success' });
      } catch (error) {
        console.log(error);
      }
    }
  );
};

module.exports = passportGoogle;
