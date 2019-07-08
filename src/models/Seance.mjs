import mongoose from 'mongoose';
import MovieTheater from './MovieTheater.mjs';
const Schema = mongoose.Schema;

const seanceSchema = new Schema({
  movieName: {
    type: Schema.Types.ObjectId,
    ref: 'movies',
    required: true,
  },
  hallId: {
    type: Schema.Types.ObjectId,
    ref: 'halls',
    required: true,
  },
  hallName: {
    type: String,
    required: true,
  },
  format: {
    video: {
      type: String,
      enum: ['2D', '3D'],
      default: '2D',
    },
    sound: {
      type: String,
      enum: ['Dolby Digital'],
      default: 'Dolby Digital',
    },
  },
  date: {
    type: Date,
    required: true,
  },
  soldSeats: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
      },
      rowNumber: Number,
      seatNumber: Number,
    },
  ],
});

seanceSchema.post('save', function(seance, next) {
  MovieTheater.findOne({ halls: seance.hallId })
    .updateOne({ $push: { seances: seance._id } })
    .then(() => next());
});

const Seance = mongoose.model('seances', seanceSchema);

export default Seance;
