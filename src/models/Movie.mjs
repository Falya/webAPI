import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const movieSchema = new Schema({
  name: String,
  genre: [String],
  age: String,
  duration: Number,
  startDate: Date,
  endDate: Date,
  description: String,
  language: String,
  poster: String,
});

const Movie = mongoose.model('movies', movieSchema);

export default Movie;
