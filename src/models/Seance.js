const mongoose = require('mongoose');
const MovieTheater = require('./MovieTheater');
const Schema = mongoose.Schema;

const seanceSchema = new Schema({
  movieName: {
    type: Schema.Types.ObjectId,
    ref: 'movies',
    required: true
  },
  hallId: {
      type: Schema.Types.ObjectId,
      ref: 'movieTheaters.halls',
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
      default: '2D'
    },
    sound: {
      type: String,
      enum: ['Dolby Digital'],
      default: 'Dolby Digital',
    }
  },
  date: {
    type: Date,
    required: true
  },
});

seanceSchema.post('save', function (seance, next) {
  MovieTheater.findOne({'halls._id': seance.hallId}).updateOne({$push: {seances: seance._id}})
  .then(() => next());
});

const Seance = mongoose.model("seances", seanceSchema);

module.exports = Seance;
