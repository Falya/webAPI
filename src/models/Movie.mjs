import mongoose from 'mongoose';
import Genre from './Genre.mjs';
const Schema = mongoose.Schema;

const movieSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'No movie`s name!'],
  },
  genre: {
    type: [
      {
        type: String,
        required: [true, 'No movie`s genre!'],
      },
    ],
    validate: {
      validator: params =>
        new Promise((resolve, reject) => {
          if (params.length > 0 && params.length <= 3) {
            console.log('params: ', params);
            Genre.find()
              .where({ name: { $in: params } })
              .then(result => {
                resolve(params.length === result.length);
              })
              .catch(err => resolve(false));
          }
        }),
      message: props => `${props.value} is not a valid genres!`,
    },
  },
  age: {
    type: String,
    required: [true, 'No movie`s age!'],
    min: 0,
    max: 21,
  },
  duration: {
    type: Number,
    required: [true, 'No movie`s duration!'],
  },
  startDate: {
    type: Date,
    required: [true, 'No movie`s start date!'],
    validate: {
      validator: function(params) {
        return params < this.endDate;
      },
      message: props => `${props.value} is not a valid start date!`,
    },
  },
  endDate: {
    type: Date,
    required: [true, 'No movie`s end date!'],
    validate: {
      validator: function(params) {
        return params > this.startDate;
      },
      message: props => `${props.value} is not a valid end date!`,
    },
  },
  description: {
    type: String,
    required: [true, 'No movie`s description!'],
    minlength: 20,
    maxlength: 300,
  },
  language: {
    type: String,
    required: [true, 'No movie`s language!'],
    maxlength: 3,
  },
  poster: {
    type: String,
    required: [true, 'No movie`s poster!'],
    validate: {
      validator: function(params) {
        return /^https:\/\/m.media-amazon.com\/images\//gi.test(params);
      },
      message: props => `${props.value} is not a valid poster link!`,
    },
  },
  trailer: {
    type: String,
    required: [true, 'No movie`s trailer!'],
    validate: {
      validator: function(params) {
        return /^https:\/\/www.youtube.com\/watch/gi.test(params);
      },
      message: props => `${props.value} is not a valid trailer link!`,
    },
  },
});

const Movie = mongoose.model('movies', movieSchema);

export default Movie;
