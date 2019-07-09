import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const movieTheaterSchema = new Schema({
  cinemaName: {
    type: String,
    required: true,
  },
  city: {
    type: Schema.Types.ObjectId,
    ref: 'cities',
    required: true,
  },
  adress: {
    type: String,
    required: true,
  },
  halls: [
    {
      type: Schema.Types.ObjectId,
      ref: 'halls',
    },
  ],
  seances: [
    {
      type: Schema.Types.ObjectId,
      ref: 'seances',
    },
  ],
  features: [
    {
      product: String,
      price: Number,
    },
  ],
});

const MovieTheater = mongoose.model('movieTheaters', movieTheaterSchema, 'movieTheaters');

export default MovieTheater;
