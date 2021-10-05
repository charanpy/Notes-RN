const express = require('express');
require('dotenv').config();

const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

require('./utils/passport')(app);
const globalError = require('./controller/errorController');
const AppError = require('./utils/AppError');

// routes
const authRoute = require('./routes/auth');

app.use('/api/v1/auth', authRoute);

app.get('/', (req, res, next) => {
  return next(new AppError('hi'));
});

app.use(globalError);
app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

module.exports = app;
