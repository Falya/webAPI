const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieSchema = new Schema({
  name: {
    type: String,
  },
  genre:{
    type: String,
  },
  age: {
    type: Number,
  },
  start_date: {
    type: Date,
  },
  end_date: {
    type: Date,
  },
  description: {
    type: String,
  },
  language: {
    type: String,
  },
  poster: {
    type: String,
  }
});

const Movie = mongoose.model("Movies", movieSchema);

module.exports = Movie;
