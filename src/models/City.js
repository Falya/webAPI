const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const citySchema = new Schema({
  city: {
    type: String,
    unique: true
  }
});

const City = mongoose.model('cities', citySchema);

module.exports = City;
