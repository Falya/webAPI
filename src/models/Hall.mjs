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
  },
  rows: [
    {
      rowNumber: {
        type: Number,
        required: true,
      },
      rowLength: {
        type: Number,
        required: true,
      },
      rowType: {
        type: String,
        enum: ['simple', 'double', 'vip'],
      },
      price: Number,
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
