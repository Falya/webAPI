const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hallSchema = new Schema({
  hallName: {
    type: String,
    required: true
  },
  rows: [
    {
      rowNumber: {
        type: Number,
        required: true
      },
      rowLength: {
        type: Number,
        required: true
      },
      rowType: {
        type: String,
        enum: ['simple', 'double', 'vip']
      },
      price: Number,
    }
  ]
});

const movieTheaterSchema = new Schema({
  cinemaName: {
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

const MovieTheater = mongoose.model('movieTheaters', movieTheaterSchema, 'movieTheaters');

module.exports = MovieTheater;
