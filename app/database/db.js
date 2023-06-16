const mongoose = require('mongoose');

const connectMongoose = () => {
  mongoose.connect('mongodb+srv://er-abhii-FSD:<password>@abhiapi.lihuexo.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // Remove the deprecated options
    // useCreateIndex: true,
    // useFindAndModify: false
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Failed to connect to MongoDB:', error));
};

module.exports = { connectMongoose };
