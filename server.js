const app = require('./app');
require('./utils/connect-mongo')();

app.listen(process.env.PORT || 5000, () => {
  console.log('Server Started');
});
