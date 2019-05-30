const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hallSchema = new Schema({
  hall_name: {
    type: String,
    required: true
  },
  rows: [
    {
      row_number: {
        type: Number,
        required: true
      },
      row_length: {
        type: Number,
        required: true
      },
      row_type: {
        type: String,
        enum: ['simple', 'double', 'vip']
      }
    }
  ]
});

const movieTheaterSchema = new Schema({
  cinema_name: {
    type: String,
    required: true
  },
  city: {
    type: Schema.Types.ObjectId,
    ref: 'cities',
    required: true
  },
  adress: {
    type: String,
    required: true
  },
  halls: [
    {
      type: hallSchema,
      index: true
    }
  ],
  seances: [
    {
      type: Schema.Types.ObjectId,
      ref: 'seances'
    }
  ]
});

const MovieTheater = mongoose.model('movie_theaters', movieTheaterSchema);

module.exports = MovieTheater;
