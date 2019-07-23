import mongoose from 'mongoose';
import MovieTheater from './MovieTheater.mjs';
const Schema = mongoose.Schema;

const hallSchema = new Schema({
  hallName: {
    type: String,
    required: true,
  },
  movieTheaterId: {
    type: Schema.Types.ObjectId,
    ref: 'movieTheaters',
    required: true,
  },
  rows: [
    {
      rowNumber: {
        type: Number,
        required: true,
        unique: true,
      },
      rowLength: {
        type: Number,
        required: true,
        min: [1, 'Minimal row length is 1'],
        max: [20, 'Maximum row length is 20'],
      },
      rowType: {
        type: String,
        enum: ['simple', 'double', 'vip'],
        required: true,
      },
      price: {
        type: Number,
        required: true,
        min: [5, 'Minimal price is 5'],
        max: [50, 'Maximum price is 50'],
      },
    },
  ],
});

hallSchema.post('save', function(hall, next) {
  MovieTheater.findById(hall.movieTheaterId)
    .updateOne({ $push: { halls: hall._id } })
    .then(() => next());
});

const Hall = mongoose.model('halls', hallSchema, 'halls');

export default Hall;
