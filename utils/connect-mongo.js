const mongoose = require('mongoose');

const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Db Connected');
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectMongo;
